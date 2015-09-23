/* ----------------------------------------------------------------------------
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
var Fireproof = require('fireproof');
Fireproof.bless(Q);

var Firebase = require('firebase');
var natural = require('natural');
var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(1, 1000);
                    
var pos = require('pos');
var rp = require('request-promise');
var _ = require('underscore');
var parseXML = require('xml2js').parseString;

var gamesStore = require('../games.json');
gamesStore.games = gamesStore.games == null || gamesStore.games == undefined ? [] : gamesStore.games;

var si = require('search-index')({ indexPath: 'gamesindex'});

var funneldata = require('../funneldata');
var giantbomb = require('../giantbomb');
var gameDB = require('../thegamedb');
var config = require('../config');
var latinizer = require('../utils/latinizer');

var categorizeContent = function (contentList) {
    //This is the tricky part lulz ( ._.)
    
    if (contentList && contentList.length > 0) {
        
        var NGrams = natural.NGrams;
        _.each(contentList, function (content) {
            //We are going to use nGrams and try and break up the "title" of the content into various permutations of word combinations
            //(using Triangle number sequencing) we will then cross reference each combination against some store containing game data, 
            //to see if the word combination matches the name of a video game. if it does, we mark it and put it to the side for further 
            //processing.This could be CPU intensive, but it won't be a lot of processing since article titles are typically not long.
            //You can calculate the number of combinations in a title using the formula (n(n + 1)) / 2 where 'n' is the number of words in
            //a game title/sentence.
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
            * (C) - Check giantbomb API - super duper last resort so we dont get banned :|
            * */

            _.each(combinedWordSets, function (wordSet) {
                
                //TWEAK - We'll assume that whatever games we want referenced within an article will be title cased.
                //So therefore, only check words that are title cased
                if ((wordSet[0] === wordSet[0].toUpperCase()) && wordSet.length >= 4) {
                    
                    var currRankedGames = [];
                    var contentTitle = latinizedTitle.toLowerCase();
                    var currContentTitle = content.title;
                    var currWordTag = wordSet.trim();

                    si.search({ "query": { "title": [wordSet] } }, function (err, searchResults) {
                        //do something with searchResults
                        if (searchResults.totalHits > 0) {

                            //Now for every game we retrieved from our store, peform our word-frequency ranking
                            _.each(searchResults.hits, function (hitItem, currGameIndex) {
                                //break down game title into multiple words
                                var currGame = hitItem.document;
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
                                    currRankedGames.push({ game: currGame.title, rank: currWordRank });
                                }
                            });

                            if (currRankedGames.length > 0) {
                                var maxRankedGame = _.max(currRankedGames, function (rankedGame) { return rankedGame.rank; });
                                
                                if (maxRankedGame) {
                                    //save the game for this article within our DB
                                    var ignContentRef = new Firebase(config.firebase.url + config.firebase.endpoints.content + '/' + config.firebase.contentEndPoints.ign);
                                    var ignContentProof = new Fireproof(ignContentRef);
                                    
                                    var delayedFunction = function () {
                                        ignContentProof
                                        .orderByChild('title')
                                        .equalTo(content.title)
                                        .once('value', function (contentSnapshot) {
                                                var retrievedContent = contentSnapshot.val();
                                                var currWordSearchTag = currWordTag;
                                            
                                                if (retrievedContent == null || retrievedContent == undefined) {
                                                
                                                    //do an add - simple stuff
                                                    var newContent = {
                                                        title: content.title,
                                                        media: content.media,
                                                        url: content.url,
                                                        description: content.description
                                                    }
                                                
                                                    var newignContentRef = new Firebase(config.firebase.url + config.firebase.endpoints.content + '/' + config.firebase.contentEndPoints.ign);
                                                    var newignContentProof = new Fireproof(newignContentRef);
                                                    console.log('saved: ' + currContentTitle);
                                                
                                                    //save record
                                                    var newignContentAddedRef = newignContentProof.push(newContent);
                                                
                                                    if (newignContentAddedRef) {
                                                    
                                                        //add game
                                                        var newignContentTagsRef = newignContentAddedRef.child('games');
                                                        newignContentTagsRef.push({ game: maxRankedGame.game, matchedrank: maxRankedGame.rank });
                                                    
                                                        //add the tags
                                                        var newignContentTagsRef = newignContentAddedRef.child('tags');
                                                        newignContentTagsRef.push({ tag: currWordSearchTag });
                                                    }
                                                }
                                                else {
                                                    //we might have more than one article with the same title (not likely, but we need to acct for it)
                                                    var retrievedContentList = _.map(retrievedContent, function (ignContent, ignContentKey) {
                                                        return { id: ignContentKey, content: ignContent };
                                                    });
                                                
                                                    if (retrievedContentList) {
                                                        //update all instances of the content retrieved
                                                        _.each(retrievedContentList, function (ignContent) {
                                                        
                                                            //update the tags & matched games of the article - (this way, we'll build an index of search tags for the article as well)
                                                            var ignContentItemTagsRef = new Firebase(config.firebase.url + config.firebase.endpoints.content + '/' + config.firebase.contentEndPoints.ign + '/' + ignContent.id + '/tags');
                                                            var ignContentItemTagsProof = new Fireproof(ignContentItemTagsRef);
                                                        
                                                            var ignContentItemGamesRef = new Firebase(config.firebase.url + config.firebase.endpoints.content + '/' + config.firebase.contentEndPoints.ign + '/' + ignContent.id + '/games');
                                                            var ignContentItemGamesProof = new Fireproof(ignContentItemGamesRef);
                                                        
                                                            //Update Tags
                                                            ignContentItemTagsProof.once('value', function (tagsSnapshot) {
                                                                var tags = tagsSnapshot.val();
                                                            
                                                                //there should be at least one tag in this scenario
                                                                if (tags) {
                                                                    var tagsList = _.map(tags, function (tag, tagKey) { return tag; });
                                                                    if (tagsList) {
                                                                        //check if the tag we are about to add exists already
                                                                        var searchedTag = _.findWhere(tagsList, { tag: currWordSearchTag });
                                                                    
                                                                        if (!searchedTag) {
                                                                            //save the tag to the list
                                                                            ignContentItemTagsProof.push({ tag: currWordSearchTag });
                                                                        }
                                                                    }
                                                                }
                                                            });
                                                        
                                                            //Update Games
                                                            ignContentItemGamesProof.once('value', function (gamesSnapshot) {
                                                                var games = gamesSnapshot.val();
                                                            
                                                                //there should be at least one tag in this scenario
                                                                if (games) {
                                                                    var gamesList = _.map(games, function (game, gameKey) { return game; });
                                                                    if (gamesList) {
                                                                        //check if the tag we are about to add exists already
                                                                        var searchedGame = _.findWhere(gamesList, { game: maxRankedGame.game });
                                                                    
                                                                        if (!searchedGame) {
                                                                            //save the tag to the list
                                                                            ignContentItemGamesProof.push({ game: maxRankedGame.game, matchedrank: maxRankedGame.rank });
                                                                        }
                                                                    }
                                                                }
                                                            });
                                                        });
                                                    }
                                                }
                                            });
                                    };
                                    
                                    limiter.removeTokens(1, function () {
                                        delayedFunction();
                                    });
                                }
                            }
                        }
                    })
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
            
            var content = [];
            
            //Haul in our catch and this is where we gut them and extract what we need from them
            _.each(result.rss.channel[0].item, function (feedItem) {
                var title = feedItem.title !== null && feedItem.title !== undefined && feedItem.title.length > 0 ? feedItem.title[0] : null;
                var description = feedItem.description !== null && feedItem.description !== undefined && feedItem.description.length > 0 ? feedItem.description[0] : null;
                var url = feedItem.link !== null && feedItem.link !== undefined && feedItem.link.length > 0 ? feedItem.link[0] : null;
                var mediaContentArray = feedItem.media_content;
                var media = {};
                
                if (mediaContentArray && mediaContentArray.length > 0) {
                    var mediaContentItem = mediaContentArray[0];
                    
                    if (mediaContentItem && mediaContentItem.media_thumbnail && mediaContentItem.media_thumbnail.length > 0) {
                        media = {
                            type : 'image',
                            url : mediaContentItem.media_thumbnail[0].$.url
                        }
                    }
                }
                content.push({ title: title, description: description, media: media, url : url });
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

    goFishingPeriodically: function (interval){
    }
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
