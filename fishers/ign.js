﻿/* ----------------------------------------------------------------------------
 * Name: ign.js
 * Description: ign fisherman
 * 
 * IGN makes it's data available via RSS 2.0 feeds.
 * we are going to need to retrieve all IGN feed data, extract
 * what we need, figure out if what we extracted is stale,
 * categorize it for the game it pertains to, and save it to our content DB
 * 
 * TODO: Need some serious Unit Tests for this
 * --------------------------------------------------------------------------*/

var Q = require('q');
var os = require('os');
var fs = require('fs');
var async = require('async');

var natural = require('natural');
var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(1, 1000);
                    
var pos = require('pos');
var rp = require('request-promise');
var _ = require('underscore');
var s = require("underscore.string");
var parseXML = require('xml2js').parseString;

//Games store
var gamesStore = require('../games.json');
gamesStore.games = gamesStore.games == null || gamesStore.games == undefined ? [] : gamesStore.games;

//Article Store
var ignArticles = require('../content/ign.json');
ignArticles.ign = ignArticles.ign == null || ignArticles.ign == undefined ? [] : ignArticles.ign;

var funneldata = require('../funneldata');
var config = require('../config');
var latinizer = require('../utils/latinizer');

ignCategories = [
    { ign: 'ignfeeds/faqs', category: 'walkthrough' },
    { ign: 'ign/games-articles', category: 'article' },
    { ign: 'ign/games-videos', category: 'video' },
    { ign: 'ign/video-reviews', category: 'video review' },
    { ign: 'ign/video-guides', category: 'video guide' },
    { ign: 'ign/game-reviews', category: 'review' },
];

var categorizeContent = function (contentList) {
    //This is the tricky part lulz ( ._.)
    
    if (contentList && contentList.length > 0) {
        
        var NGrams = natural.NGrams;
        _.each(contentList, function (content, contentItemIndex) {

            /* ----------------------------------------------------------------------------------------------------------------------------
             * We are going to use nGrams and try and break up the "title" of the content into various permutations of word combinations
             * (using Triangle number sequencing) we will then cross reference each combination against some store containing game data, 
             * to see if the word combination matches the name of a video game. if it does, we mark it and put it to the side for further 
             * processing.
             * This could be CPU intensive, but it won't be a lot of processing since article titles are typically not long.
             * 
             * You can calculate the number of combinations in a title using the formula (n(n + 1)) / 2 where 'n' is the number of words in
             * a game title/sentence.
             * --------------------------------------------------------------------------------------------------------------------------*/
            var latinizedTitle = latinizer.latinize(removeSpecialChars(content.title));
            var words = new pos.Lexer().lex(latinizedTitle);
            var tagger = new pos.Tagger();
            var taggedWordsAndPOS = tagger.tag(words);
            var taggedWords = [];
            
            //Get just the tagged words - remove the POS
            _.each(taggedWordsAndPOS, function (taggedWordArray) {
                taggedWords.push(taggedWordArray[0]);
            });
            
            //We'll assume the subject matter within the title - the game name - occurs within the first 5 words of the title
            if (taggedWords.length > config.titleWordLimit) {
                taggedWords.splice((config.titleWordLimit + 1), 50); //just delete everything after index 5 or whatever the config setting is
                latinizedTitle = latinizedTitle.substring(0, (latinizedTitle.indexOf(taggedWords[config.titleWordLimit]) + taggedWords[config.titleWordLimit].length));
            }
            
            var permutationLimit = taggedWords !== null && taggedWords !== undefined ? taggedWords.length : 0;
            var combinedWordSets = [];
            
            for (i = 1; i <= permutationLimit; i++) {
                //take the nGram using the current position of the loop. We'll take every possible permutation up to the total count of words
                //in the title
                var wordCombinationArrays = NGrams.ngrams(latinizedTitle, i); //output is an array of arrays
                
                //Now process the array of arrays, combining the array items into words and cross checking them against our games API services
                if (wordCombinationArrays) {
                    _.each(wordCombinationArrays, function (array) {
                        var combinedWord = '';
                        _.each(array, function (word) {
                            combinedWord += word + ' ';
                        });
                        combinedWordSets.push(combinedWord.trim());
                    });
                }
            }
            
            /* Now process the sets of words - cross reference against game db stores in this order
             * (A) - Check local games.json
             * (B) - Check giantbomb API - super duper last resort so we dont get banned :|
             * */

            _.each(combinedWordSets, function (wordSet) {
                
                //TWEAK - We'll assume that whatever games we want referenced within an article will be title cased.
                //So therefore, only check words that are title cased
                if ((wordSet[0] === wordSet[0].toUpperCase()) && wordSet.length >= 4) {
                    
                    var currRankedGames = [];
                    var contentTitle = latinizedTitle.toLowerCase();
                    var currContentTitle = content.title;
                    var currWordTag = wordSet.trim();
                    
                    var searchResults = _.reduce(gamesStore.games, function (memo, game) {
                        var match = s.include(game.title.toLowerCase(), currWordTag.toLowerCase());
                        
                        if (match) {
                            memo.push(game);
                        }
                        return memo;
                    }, []);
                    
                    //do something with searchResults
                    if (searchResults !== null && searchResults !== undefined && searchResults.length > 0) {
                        
                        //Now for every game we retrieved from our store, peform our word-frequency ranking
                        _.each(searchResults, function (currGame, currGameIndex) {
                            //break down game title into multiple words
                            var currTitle = latinizer.latinize(removeSpecialChars(currGame.title));
                            
                            var currWords = new pos.Lexer().lex(currTitle);
                            var currTagger = new pos.Tagger();
                            var currTaggedWordsAndPOS = currTagger.tag(currWords);
                            var currTaggedWords = [];
                            
                            //Get just the tagged words - remove the POS
                            _.each(currTaggedWordsAndPOS, function (currTaggedWordArray) {
                                currTaggedWords.push(currTaggedWordArray[0].trim());
                            });
                            
                            //Now that we have all the tagged words - in an array - start the frequency-word ranking for each word. When we frequency
                            //rank a game, store it in the currRankedGames array
                            var currWordRank = 0;
                            var copyContentTitle = contentTitle;
                            var matchedWordIndexes = [];
                            
                            _.each(currTaggedWords, function (currWord, currWordIndex) {
                                var occured = copyContentTitle.indexOf(currWord.toLowerCase().trim());
                                if (occured !== null && occured !== undefined && occured > -1) {
                                    var indexExists = _.find(matchedWordIndexes, function (indexItem) {
                                        return indexItem == occured;
                                    });
                                    
                                    if (indexExists == null || indexExists == undefined) {
                                        //match - add to it's rank: Update we will factor in the length of the word as part of it's rank
                                        //so what this means is the more letters a matched word has, the higher it's rank
                                        currWordRank += currWord.length;
                                        
                                        //remove the matched item from the title
                                        copyContentTitle = spliceSlice(copyContentTitle, occured, currWord.length);
                                    }
                                }
                            });
                            
                            //save the game and it's rank within our array - if the game title already exists within our array
                            //(the exact same title - word for word) then we pass it, and dont add it in, since we dont want duplicates
                            var rankedGameAlready = _.findWhere(currRankedGames, { game: currGame.title });
                            if (!rankedGameAlready) {
                                currRankedGames.push({ game: currGame.title, rank: currWordRank, gameObj: currGame });
                            }
                        });
                        
                        if (currRankedGames.length > 0) {
                            //Determine how we evaluate relevancy - right now it's based on rank, but it sould also account some type of context...
                            //...maybe time
                            var maxRankedGame = _.max(currRankedGames, function (rankedGame) {
                                var dateInt = 0;
                                if (rankedGame.gameObj.releasedate !== null && rankedGame.gameObj.releasedate !== undefined && rankedGame.gameObj.releasedate !== '' && typeof Date.parse(rankedGame.gameObj.releasedate) === 'number') {
                                    var dateInt = Date.parse(rankedGame.gameObj.releasedate);
                                }
                                return rankedGame.rank + dateInt;
                            });
                            
                            if (maxRankedGame !== null && maxRankedGame !== undefined) {
                                
                                //Check the article store for any articles that have the same title
                                var articleResults = _.reduce(ignArticles.ign, function (memo, article) {
                                    var match = s.include(article.title.trim().toLowerCase(), content.title.trim().toLowerCase());
                                    
                                    if (match) {
                                        memo.push(article);
                                    }
                                    return memo;
                                }, []);
                                
                                if (articleResults !== null && articleResults !== undefined && articleResults.length > 0) {
                                    //There should only be one article match really
                                    _.each(articleResults, function (article, articleIndex) { 
                                        //Add the game, and it's rank as well as the tag for the game to the article if they dont exist already

                                        var foundGame = _.findWhere(article.games, { game: maxRankedGame.game });
                                        if (foundGame == null || foundGame == undefined) {
                                            article.games.push({ game: maxRankedGame.game, matchedrank: maxRankedGame.rank });
                                        }

                                        var foundTag = _.findWhere(article.tags, { tag: currWordTag });
                                        if (foundTag == null || foundTag == undefined) {
                                            article.tags.push({ tag: currWordTag });
                                        }

                                        //Check for tags from IGN directly
                                        if (content.tags !== null && content.tags !== undefined) {
                                            _.each(content.tags, function (tag) {
                                                var foundIGNTag = _.findWhere(article.tags, { tag: tag });
                                                if (foundIGNTag == null || foundIGNTag == undefined) {
                                                    article.tags.push({ tag: tag });
                                                }
                                            });
                                        }
                                    })
                                    
                                    //update the ign articles json
                                    //write our new article to the json file.
                                    var articleJSON = JSON.stringify(ignArticles, null, 4);
                                    fs.writeFileSync("content/ign.json", articleJSON);

                                    console.log('updated ign content: ' + currContentTitle);
                                }
                                else {

                                    //Add the new article - simple stuff
                                    var newContent = {
                                        title: content.title,
                                        media: content.media,
                                        url: content.url,
                                        description: content.description,
                                        source: content.source,
                                        publishdate: content.publishdate,
                                        category: content.category,
                                        games: [],
                                        tags: []
                                    }

                                    newContent.games.push({ game: maxRankedGame.game, matchedrank: maxRankedGame.rank });
                                    newContent.tags.push({ tag: currWordTag });

                                    //If we have extra tags form IGN, add them too
                                    if (content.tags !== null && content.tags !== undefined) {
                                        _.each(content.tags, function (tag) {
                                            newContent.tags.push({ tag: tag });
                                        });
                                    }

                                    //Store the article
                                    ignArticles.ign.push(newContent);

                                    //write our new article to the json file.
                                    var articleJSON = JSON.stringify(ignArticles, null, 4);
                                    fs.writeFileSync("content/ign.json", articleJSON);

                                    console.log('saved ign content: ' + currContentTitle);
                                }
                            }
                        }
                    }
                }
            });
        });
    }
}

var pullCatch = function (feed) {
    console.log('DING: Caught some IGN fish...');
    
    var options = {
        tagNameProcessors: [removeColon],
        ignoreAttrs : false
    }
    
    parseXML(feed, options, function (err, result) {
        if (!err && result && result.rss && result.rss.channel && result.rss.channel.length > 0) {
            
            var feedburnerinfoObj = result.rss.channel[0].feedburner_info !== null && result.rss.channel[0].feedburner_info !== undefined && result.rss.channel[0].feedburner_info.length > 0 ? result.rss.channel[0].feedburner_info[0] : null;
            var feedburnerinfoUri = feedburnerinfoObj.$.uri;
            
            var categoryObj = _.findWhere(ignCategories, { ign: feedburnerinfoUri });
            var category = categoryObj !== null && categoryObj !== undefined ? categoryObj.category : '';
            var content = [];
            
            //Haul in our catch and this is where we gut them and extract what we need from them
            _.each(result.rss.channel[0].item, function (feedItem) {
                var title = feedItem.title !== null && feedItem.title !== undefined && feedItem.title.length > 0 ? feedItem.title[0] : null;
                var description = feedItem.description !== null && feedItem.description !== undefined && feedItem.description.length > 0 ? feedItem.description[0] : null;
                var url = feedItem.link !== null && feedItem.link !== undefined && feedItem.link.length > 0 ? feedItem.link[0] : null;
                var mediaContentArray = feedItem.media_content;
                var source = feedItem.source !== null && feedItem.source !== undefined && feedItem.source.length > 0 ?  feedItem.source[0]._ : null;
                var media = {};
                var tagsExtra = [];
                var publishdate = feedItem.pubDate !== null && feedItem.pubDate !== undefined && feedItem.pubDate.length > 0 ?  feedItem.pubDate[0] : null;
                
                //GO FUCKING FIGURE: IGN sometimes categorizes their content by product. And I wrote this blasted thingy for nothing XD
                var product = null;
                var productRaw = feedItem.product_product !== null && feedItem.product_product !== undefined && feedItem.product_product.length > 0 ? feedItem.product_product[0] : null;
                
                //Now get all the meta data for the products we need
                if (productRaw !== null) {
                    product = {};
                    product.productgrouping = productRaw.product_grouping !== null && productRaw.product_grouping !== undefined && productRaw.product_grouping.length > 0 ? productRaw.product_grouping[0] : null;
                    product.producttitle = productRaw.product_title !== null && productRaw.product_title !== undefined && productRaw.product_title.length > 0 ? productRaw.product_title[0] : null;
                    product.type = productRaw.product_type !== null && productRaw.product_type !== undefined && productRaw.product_type.length > 0 ? productRaw.product_type[0] : null;
                    product.url = productRaw.product_url !== null && productRaw.product_url !== undefined && productRaw.product_url.length > 0 ? productRaw.product_url[0] : null;
                }

                if (mediaContentArray !== null && mediaContentArray !== undefined && mediaContentArray.length > 0) {
                    var mediaContentItem = mediaContentArray[0];
                    
                    if (mediaContentItem !== null && mediaContentItem !== undefined  && mediaContentItem.media_thumbnail && mediaContentItem.media_thumbnail.length > 0) {
                        
                        var image = {
                            height: mediaContentItem.media_thumbnail[0].$.height !== null && mediaContentItem.media_thumbnail[0].$.height !== undefined && mediaContentItem.media_thumbnail[0].$.height !== '' ? mediaContentItem.media_thumbnail[0].$.height : '',
                            width: mediaContentItem.media_thumbnail[0].$.width !== null && mediaContentItem.media_thumbnail[0].$.width !== undefined && mediaContentItem.media_thumbnail[0].$.width !== '' ? mediaContentItem.media_thumbnail[0].$.width : '',
                            url: mediaContentItem.media_thumbnail[0].$.url !== null && mediaContentItem.media_thumbnail[0].$.url !== undefined && mediaContentItem.media_thumbnail[0].$.url !== '' ? mediaContentItem.media_thumbnail[0].$.url : ''
                        };

                        media = {
                            image : image,
                            type : mediaContentItem.$.type !== null && mediaContentItem.$.type !== undefined && mediaContentItem.$.type !== '' ? mediaContentItem.$.type : '',
                            url : mediaContentItem.$.url !== null && mediaContentItem.$.url !== undefined ? mediaContentItem.$.url : '',
                            bitrate: mediaContentItem.$.bitrate !== null && mediaContentItem.$.bitrate !== undefined ? mediaContentItem.$.bitrate : '',
                            height: mediaContentItem.$.height !== null && mediaContentItem.$.height !== undefined ? mediaContentItem.$.height : '',
                            width: mediaContentItem.$.width !== null && mediaContentItem.$.width !== undefined ? mediaContentItem.$.width : '',
                        }
                    }

                    //The media object from ign also keeps keywords which we can use as tags. GET THEM NAOW!!!!!
                    if (mediaContentItem !== null && mediaContentItem !== undefined && mediaContentItem.media_keywords && mediaContentItem.media_keywords.length > 0 && mediaContentItem.media_keywords[0] !== '') {
                        tagsExtra = mediaContentItem.media_keywords[0].split(',');
                    }
                }
                content.push({
                    title: title, 
                    description: description, 
                    media: media, 
                    url : url,
                    source: source,
                    publishdate: publishdate,
                    product: product !== null && product !== undefined ? product : null,
                    tags: tagsExtra !== null && tagsExtra !== undefined && tagsExtra.length > 0 ? tagsExtra : null,
                    category: category
                });
            });

            categorizeContent(content);
        }
    });
}

var ign_fisher = {
    goFishing: function (){
        console.log('DING: Fishing for IGN fish...');

        var ign_parent = this;
        var ign_source = _.findWhere(funneldata.sources, { name : "ign" });

        if (ign_source) {
            _.each(ign_source.feeds, function (feedSource) {
                var source = feedSource;
                rp(feedSource.url).then(pullCatch);
            });
        }
    },
}

function removeColon(name){
    name = name.replace(':', '_');
    return name;
}

function removeSpecialChars(word){
    word = word.replace("'s", "");
    word = word.replace("?", "");
    word = word.replace("-", " ");

    return word;
}

function spliceSlice(str, index, count, add) {
    return str.slice(0, index) + (add || "") + str.slice(index + count);
}

module.exports = ign_fisher;
