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
            var latinizedTitle = latinizer.latinize(content.title);
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
                        combinedWordSets.push(combinedWord)
                    });
                }
            }

            /* Now process the sets of words - cross reference against game db stores in this order
             * (A) - Check funnelope known titles Firebase DB
             * (B) - Check theGameDB.net store
             * (C) - Check giantbomb API
             * */
            var titleMatches = [];
            var gamesDBMatches = [];

            _.each(combinedWordSets, function (wordSet) {
                var contentValue = content;

                //(A) - Check our firebase gameTags DB
                var isMatch = false;
                var gameTagNameRefs = new Firebase(config.firebase.url + config.firebase.endpoints.gametags);
                var gameTagNameProof = new Fireproof(gameTagNameRefs);

                gameTagNameProof
                    .orderByChild('tag')
                    .equalTo(wordSet)
                    .once('value')
                    .then(function (snapshot) {
                        var result = snapshot.val();
                        if (result) {
                            isMatch = true;
                            titleMatches.push({
                                'query' : wordSet,
                                'tag' : result.tag,
                                'gametitle' : result.gametitle
                            });
                        }
                    });
                
                if (!isMatch) {
                    //(B) - Check theGameDB.net store
                    var queueArray = [];

                    var delayedFunction = function () {
                        gameDB.searchGames(wordSet).then(function (data) {
                            if (data !== null && data !== undefined) {
                                //TESTING: Write Matches to file in CSV - Just GamesDB matches for now
                                var options = {
                                    tagNameProcessors: [removeColon],
                                    ignoreAttrs : false
                                }
                                
                                
                                parseXML(data, options, function (err, parsedResult) {
                                    var gamesTitles = '';
                                    
                                    if (parsedResult.Data !== null && parsedResult.Data !== undefined && parsedResult.Data.Game !== null && parsedResult.Data.Game !== undefined && parsedResult.Data.Game.length > 0) {
                                        _.each(parsedResult.Data.Game, function (gameArray) {
                                            if (gameArray !== null && gameArray !== undefined  && gameArray.GameTitle !== null && gameArray.GameTitle !== undefined && gameArray.GameTitle.length > 0) {
                                                gamesTitles += gameArray.GameTitle[0] + '|';
                                            }
                                        });
                                    }
                                    
                                    fs.appendFile('thegameDBmatches.txt', content.title + ', ' + wordSet + ', ' + gamesTitles + os.EOL, function (err) {
                                        if (err) return console.log(err);
                                    });
                                });
                            
                            }
                        });
                    };

                    limiter.removeTokens(1, function () {
                        delayedFunction();
                    });
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
                content.push({ title: title, description: description, media: media });
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
    return name.replace(':', '_');
}

module.exports = ign_fisher;