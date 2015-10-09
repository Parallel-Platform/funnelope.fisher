/* ----------------------------------------------------------------------------
 * Name: nexusmods.js
 * Description: nexusmods fisherman
 * 
 * Nexusmods makes it's data available via RSS 2.0 feeds.
 * we are going to need to retrieve all Nexusmods feed data, extract
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
var nexusmodsArticles = require('../content/nexusmods.json');
nexusmodsArticles.nexusmods = nexusmodsArticles.nexusmods == null || nexusmodsArticles.nexusmods == undefined ? [] : nexusmodsArticles.nexusmods;

var funneldata = require('../funneldata');
var config = require('../config');
var latinizer = require('../utils/latinizer');

var nexusmodsGames = [
    { game: 'Dark Souls' },
    { game: 'Dark Souls II' },
    { game: 'Dragon Age: Origins' },
    { game: 'Dragon Age II' },
    { game: 'Dragon Age: Inquisition' },
    { game: 'Fallout 3' },
    { game: 'Dying Light' },
    { game: 'Fallout: New Vegas' },
    { game: 'Final Fantasy XIV Online: A Realm Reborn' },
    { game: 'Grand Theft Auto V' },
    { game: 'Mass Effect 3' },
    { game: 'Metal Gear Solid V: Ground Zeroes' },
    { game: 'Metal Gear Solid V: The Phantom Pain' },
    { game: 'Minecraft' },
    { game: 'The Elder Scrolls III: Morrowind' },
    { game: 'The Elder Scrolls IV: Oblivion' },
    { game: 'The Elder Scrolls V: Skyrim' },
    { game: 'Starbound' },
    { game: 'State of Decay' },
    { game: 'Tabletop Simulator' },
    { game: 'The Witcher 2' },
    { game: 'The Witcher 3' },
    { game: 'War Thunder' },
    { game: 'World of Tanks' },
    { game: 'XCOM: Enemy Unknown' }
];

var categorizeContent = function (contentList) {
    //This is the tricky part lulz ( ._.)
    
    if (contentList && contentList.length > 0) {
        
        var NGrams = natural.NGrams;
        _.each(contentList, function (content, contentItemIndex) {
            
            /* ---------------------------------------------------------------------------------------------------------------------------------
             * We have the name of the game for the mods feed tied into the feed_title, so we don't need to do our traditional game nGram search
             * -------------------------------------------------------------------------------------------------------------------------------*/
            var feedtitle = content.feedtitle;
            var game = '';
            
            for (gameindex = 0; gameindex < nexusmodsGames.length; gameindex++) {
                var foundIndex = feedtitle.trim().toLowerCase().indexOf(nexusmodsGames[gameindex].game.trim().toLowerCase());
                
                if (foundIndex !== null && foundIndex !== undefined && foundIndex > -1) {
                    game = nexusmodsGames[gameindex].game;
                    break;
                }
            }
            
            //Add the article for the game
            if (game !== null && game !== undefined && game !== '') {
                var articleResult = _.findWhere(nexusmodsArticles.nexusmods, { title: content });
                            
                if (articleResult == null || articleResult == undefined) {

                    //Add the new article - simple stuff
                    var newContent = {
                        title: content.title,
                        url: content.url,
                        description: content.description,
                        category: content.category,
                        games: [{
                                "game": game
                            }],
                        tags: [{"tag" : game }]
                    }

                    //Store the article
                    nexusmodsArticles.nexusmods.push(newContent);
                    
                    //write our new article to the json file.
                    var articleJSON = JSON.stringify(nexusmodsArticles, null, 4);
                    fs.writeFileSync("content/nexusmods.json", articleJSON);
                    
                    console.log('saved nexusmods content: ' + content.title);
                }
            }
        });
    }
}

var pullCatch = function (feed) {
    console.log('DING: Caught some Nexusmods fish...');
    
    var options = {
        tagNameProcessors: [removeColon],
        ignoreAttrs : false
    }
    
    parseXML(feed, options, function (err, result) {
        if (!err && result && result.rss && result.rss.channel && result.rss.channel.length > 0) {
            
            var feed_description = '';
            if (result.rss.channel[0].description !== null && result.rss.channel[0].title !== undefined && result.rss.channel[0].title.length > 0) {
                feed_title = result.rss.channel[0].title[0];
            }

            var content = [];
            
            //Haul in our catch and this is where we gut them and extract what we need from them
            _.each(result.rss.channel[0].item, function (feedItem) {
                var title = feedItem.title !== null && feedItem.title !== undefined && feedItem.title.length > 0 ? feedItem.title[0] : null;
                var description = feedItem.description !== null && feedItem.description !== undefined && feedItem.description.length > 0 ? feedItem.description[0] : null;
                var url = feedItem.link !== null && feedItem.link !== undefined && feedItem.link.length > 0 ? feedItem.link[0] : null;
                
                content.push({
                    category: 'mod',
                    feedtitle: feed_title,
                    title: title, 
                    description: description, 
                    url : url
                });
            });            
            categorizeContent(content);
        }
    });
}


var nexusmods_fisher = {
    goFishing: function () {
        console.log('DING: Fishing for Nexusmods fish...');
        
        var nexusmods_parent = this;
        var nexusmods_source = _.findWhere(funneldata.sources, { name : "nexusmods" });
        
        if (nexusmods_source) {
            _.each(nexusmods_source.feeds, function (feedSource) {
                var source = feedSource;
                rp(feedSource.url).then(pullCatch);
            });
        }
    },
}

function removeColon(name) {
    name = name.replace(':', '_');
    return name;
}

function removeSpecialChars(word) {
    word = word.replace("'s", "");
    word = word.replace("?", "");
    word = word.replace("-", " ");
    
    return word;
}

function spliceSlice(str, index, count, add) {
    return str.slice(0, index) + (add || "") + str.slice(index + count);
}

module.exports = nexusmods_fisher;