var rp = require('request-promise');
var config = require('./config.js');
var http = require('http');
var url = require('url');

var gamesdb = {
    
    getGame: function (id){
    },

    searchGames: function (query){
        if (query !== null && query !== undefined && query !== '') {
            
            var gameDbRef = config.thegamedb;
            var gameDbUrl = gameDbRef.url + gameDbRef.endpoints.GetGamesList + '?name=' + encodeURIComponent(query.toLowerCase());
            
            options = {
                uri : gameDbUrl,
                timeout : 1800000
            }
            
            console.log('calling GamesDB.net - GetGamesList');
            return rp(options);
        }
        return null;
    },

    getGamesByPlatform: function (platformid){
        if (platformid) {
            var gameDbRef = config.thegamedb;
            var gameDbUrl = gameDbRef.url + gameDbRef.endpoints.GetPlatformGames + '?platform=' + platformid;

            options = {
                uri : gameDbUrl,
                timeout : 1800000
            }

            console.log('calling GamesDB.net - GetPlatformGames');
            return rp(options);
        }
    }
};

module.exports = gamesdb;