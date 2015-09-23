var config = {
    "limit" : 25,
    "rssFeedIntervalMins" : 30,
    "titleWordLimit" : 1000,
    "giant_bomb": {
        "url" : "http://www.giantbomb.com/api/",
        "key" : "9caedc058d2f9553e2de63e66dde3d81df03d6d0",
        "endpoints" : {
            "games" : "games",
            "genres" : "genres",
            "platforms" : "platforms",
            "search" : "search"
        },
        "formats": {
            "json" : "json",
            "xml" : "xml"
        },
        "resources" : {
            'game' : 'game',
            'franchise' : 'franchise',
            'character' : 'character',
            'concept' : 'concept', 
            'object' : 'object',
            'location' : 'location',
            'person' : 'person',
            'company' : 'company',
            'video' : 'video'
        },
        "limit" : 4,
        "sample_url" : "http://www.giantbomb.com/api/game/3030-4725/?api_key=[YOUR-KEY]",
        "sample_url_json" : "http://www.giantbomb.com/api/game/3030-4725/?api_key=[YOUR-KEY]&format=json&field_list=genres,name",
        "sample_url_breakdown" : "http://www.giantbomb.com/api/[RESOURCE-TYPE]/[RESOURCE-ID]/?api_key=[YOUR-KEY]&format=[RESPONSE-DATA-FORMAT]&field_list=[COMMA-SEPARATED-LIST-OF-RESOURCE-FIELDS]"
    },
    "thegamedb": {
        "url" : " http://thegamesdb.net/api/",
        "endpoints": {
            "GetGamesList" : "GetGamesList.php",
            "GetGame" : "GetGame.php",
            "GetPlatformGames" : "GetPlatformGames.php"
        }
    },
    "firebase" : {
        "url" : 'https://funnelope.firebaseio.com/',
        "secret" : 'Rq5E8qkQNfPhFNegvDpeMjCkGcr8ccbmunLhclZd',
        "endpoints" : {
            "gametags" : "gametags",
            "games" : "games",
            "content" : "content"
        },
        "contentEndPoints": {
            "twitch" : "twitch",
            "youtube" : "youtube",
            "ign" : "ign"
        }
    }
};

module.exports = config;