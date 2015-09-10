var natural = require('natural');
var pos = require('pos');
var rp = require('request-promise');
var _ = require('underscore');

var funneldata = require('../funneldata');
var config = require('../config');

var twitch_fisher = {

    apiMethods: {

        getStreams: function (limit, offset, game){
            var twitch_source = _.findWhere(funneldata.sources, { name : "twitch" });
            
            if (twitch_source) {
                var url = twitch_source.api.url + '/' + twitch_source.api.endPoints.general.streams.uri;
                var clientid = twitch_source.api.clientId;

                limit = limit == null || limit == undefined ? config.limit : limit;
                offset = offset == null || offset == undefined ? 0 : offset;
                
                url += '?limit=' + limit + '&offset=' + offset;

                if (game !== null && game !== undefined && game !== '') {
                    url += '&game=' + encodeURIComponent(game);
                }
                return rp(url);
            }
            else {
                return null;
            }
        },

        getVideos: function (limit, offset, game, period){
            var twitch_source = _.findWhere(funneldata.sources, { name : "twitch" });
            
            if (twitch_source) {
                var url = twitch_source.api.url + '/' + twitch_source.api.endPoints.general.videos.uri;
                var clientid = twitch_source.api.clientId;
                
                limit = limit == null || limit == undefined ? config.limit : limit;
                offset = offset == null || offset == undefined ? 0 : offset;
                period = period == null || period == undefined || period == '' ? 'all' : period;
                
                url += '?limit=' + limit + '&offset=' + offset + '&period=' + period;
                
                if (game !== null && game !== undefined && game !== '') {
                    url += '&game=' + encodeURIComponent(game);
                }
                return rp(url);
            }
            else {
                return null;
            }
        },
        
        searchChannels: function (limit, offset, query) {
            var twitch_source = _.findWhere(funneldata.sources, { name : "twitch" });
            
            if (twitch_source) {
                var url = twitch_source.api.url + '/' + twitch_source.api.endPoints.search.channels.uri;
                var clientid = twitch_source.api.clientId;
                
                limit = limit == null || limit == undefined ? config.limit : limit;
                offset = offset == null || offset == undefined ? 0 : offset;
                query = query == null || query == undefined ? '' : encodeURIComponent(query);
                
                url += '?limit=' + limit + '&offset=' + offset + '&query=' + query;
                return rp(url);
            }
            else {
                return null;
            }
        },

        searchStreams: function (limit, offset, query){
            var twitch_source = _.findWhere(funneldata.sources, { name : "twitch" });
            
            if (twitch_source) {
                var url = twitch_source.api.url + '/' + twitch_source.api.endPoints.search.streams.uri;
                var clientid = twitch_source.api.clientId;
                
                limit = limit == null || limit == undefined ? config.limit : limit;
                offset = offset == null || offset == undefined ? 0 : offset;
                query = query == null || query == undefined ? '' : encodeURIComponent(query);
                
                url += '?limit=' + limit + '&offset=' + offset + '&query=' + query;
                return rp(url);
            }
            else {
                return null;
            }
        }
    }
};

module.exports = twitch_fisher;