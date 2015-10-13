var funneldata = {
    categories : [
        "stream",
        "blog",
        "review",
        "video review",
        "tutorial",
        "walkthrough",
        "guide",
        "video guide",
        "image",
        "meme",
        "tweet",
        "article",
        "post",
        "video",
        "pin",
        "channel",
        "vine",
        "tournament",
        "invite",
        "news",
        "video news",
        "podcast",
        "audio",
        "playlist",
        "LFG",
        "show",
        "match",
        "game",
        "showcase",
        "mod",
        "newrelease",
        "bestsellers",
        "pricedrop",
        "comingsoon",
        "emulator",
        "roms"
    ],

    sources: [
        {
            "name" : "twitch",
            "domain": "twitch.tv",
            "mainCategory": "Games",
            "subCategory": "Video Games",
            "api": {
                "url": "https://api.twitch.tv/kraken",
                "version": "",
                "clientId": "2274eckao3qkvzkel59r88bv3dt8yl1",
                "clientSecret": "njbbsphjwiow5ilt2enw4inmtghz6kv",
                "endPoints": {
                    "general": {
                        "games": {
                            "uri": "/games/top",
                            "params": ["limit", "offset"],
                            "categories" : ["game"],
                        },
                        "streams": {
                            "uri": "/streams",
                            "params": ["game", "channel", "limit", "offset", "client_id"],
                            "categories" : ["stream"],
                        },
                        "videos": {
                            "uri": "/videos/top",
                            "params": ["limit", "offset", "game", "period"],
                            "categories" : ["video"],
                        }

                    },
                    "search": {
                        "channels": {
                            "uri": "/search/channels",
                            "params": ["query", "limit", "offset"],
                            "categories" : ["channel"],
                        },
                        "streams": {
                            "uri": "/search/streams",
                            "params": ["query", "limit", "offset", "hls"],
                            "categories" : ["stream"],
                        },
                        "games": {
                            "uri": "/search/games",
                            "params" : ["query", "type", "live"],
                            "categories" : ["game"],
                        }
                    }
                }
            }
        },
        {
            "name" : "ign",
            "domain": "ign.com",
            "mainCategory": "Games",
            "subCategory": "Video Games",
            "api": {
                "url": "https://videogamesrating.p.mashape.com/get.php",
                "version": "",
                "apiTestKey": "EmZDNyXFGdmshrDJ7GULxLTy5NAVp1IioAZjsne3eFyLXha5iY",
                "apiProdKey" : "Ef5wCF4Q7XmshNFE1pfs3V2Rcq2ap1M4dfdjsng60IU89lYcWH",
                "endPoints": {
                    "reviews" : {
                        "params" : ["count", "game"],
                        "categories" : ["review"],
                    }
                }
            },
            "feeds" : [
                {
                    "categories" : ["article"],
                    "url" : "http://feeds.ign.com/ign/games-articles?format=xml"
                },
                {
                    "categories" : ["video"],
                    "url" : "http://feeds.ign.com/ign/games-videos?format=xml"
                },
                {
                "categories" : ["walkthrough"],
                "url" : "http://feeds.ign.com/ignfeeds/faqs?format=xml"
                },
                {
                    "categories" : ["video review"],
                    "url" : "http://feeds.ign.com/ign/video-reviews?format=xml"
                },
                {
                    "categories" : ["video guide"],
                    "url" : "http://feeds.ign.com/ign/video-guides?format=xml"
                },
                {
                    "categories" : ["review"],
                    "url" : "http://feeds.ign.com/ign/game-reviews?format=xml"
                }
            ]
        },
        {
            "name" : "nexusmods",
            "rank": 5,
            "domain": "nexusmods.com",
            "mainCategory": "Games",
            "subCategory": "Video Games",
            "feeds" : [
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/darksouls/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/darksouls/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/darksouls2/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/darksouls2/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/dragonage/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/dragonage/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/dragonage2/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/dragonage2/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/dragonageinquisition/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/dragonageinquisition/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/fallout3/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/fallout3/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/dyinglight/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/dyinglight/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/newvegas/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/newvegas/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/finalfantasy14/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/finalfantasy14/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/gta5/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/gta5/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/masseffect3/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/masseffect3/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/metalgearsolidv/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/metalgearsolidv/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/phantompain/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/phantompain/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/minecraft/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/minecraft/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/morrowind/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/morrowind/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/oblivion/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/oblivion/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/oblivion/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/skyrim/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/skyrim/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/starbound/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/starbound/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/stateofdecay/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/stateofdecay/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/tabletopsimulator/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/witcher2/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/witcher2/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/witcher3/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/witcher3/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/warthunder/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/warthunder/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/worldoftanks/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/worldoftanks/rss/updatedtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/xcom/rss/newtoday/"
                },
                {
                    "categories" : ["mod"],
                    "url" : "http://www.nexusmods.com/xcom/rss/updatedtoday/"
                }
            ]
        },
        {
            "name" : "rockstargames",
            "rank": 8,
            "domain": "rockstargames.com",
            "mainCategory": "Games",
            "subCategory": "Video Games",
            "feeds" : [
                //{
                //    "categories" : ["news"],
                //    "url" : "http://www.rockstargames.com/newswire.rss"
                //}
                {
                    "categories" : ["news"],
                    "url" : "http://www.rockstargames.com/newswire/tag/grand-theft-auto.rss"
                }
            ]
        },
        {
            "name" : "ea",
            "rank": 10,
            "domain": "ea.com",
            "mainCategory": "Games",
            "subCategory": "Video Games",
            "feeds" : [
                {
                    "categories" : ["news"],
                    "url" : "http://news.ea.com/feeds/press_release/46011/rss.xml"
                },
                {
                    "categories" : ["news"],
                    "url" : "http://news.ea.com/feeds/press_release/46010/rss.xml"
                }
            ]
        },
        {
            "name" : "gamespot",
            "rank": 13,
            "domain": "gamespot.com",
            "mainCategory": "Games",
            "subCategory": "Video Games",
            "feeds" : [
                {
                    "categories" : ["review"],
                    "url" : "http://www.gamespot.com/feeds/reviews/"
                },
                {
                    "categories" : ["showcase"],
                    "url" : "http://www.gamespot.com/feeds/new-games/"
                },
                {
                    "categories" : ["article"],
                    "url" : "http://www.gamespot.com/feeds/news/"
                },
                {
                    "categories" : ["video"],
                    "url" : "http://www.gamespot.com/feeds/video/"
                },
                {
                    "categories" : ["image"],
                    "url" : "http://www.gamespot.com/feeds/image-galleries/"
                }
            ]
        },
        {
            "name" : "gamestop",
            "rank": 15,
            "domain": "gamestop.com",
            "mainCategory": "Games",
            "subCategory": "Video Games",
            "feeds" : [
                {
                    "categories" : ["bestsellers"],
                    "url" : "http://www.gamestop.com/SyndicationHandler.ashx?Filter=BestSellers"
                },
                {
                    "categories" : ["comingsoon"],
                    "url" : "http://www.gamestop.com/SyndicationHandler.ashx?Filter=comingsoon"
                },
                {
                    "categories" : ["newrelease"],
                    "url" : "http://www.gamestop.com/SyndicationHandler.ashx?Filter=nowshipping"
                },
                {
                    "categories" : ["pricedrop"],
                    "url" : "http://www.gamestop.com/SyndicationHandler.ashx?Filter=pricedrops"
                }
            ]
        },
        {
            "name" : "emuparadise",
            "rank": 16,
            "domain": "emuparadise.me",
            "mainCategory": "Games",
            "subCategory": "Video Games",
            "feeds" : [
                {
                    "categories" : ["roms"],
                    "url" : "http://feeds.feedburner.com/Emuparadise?format=xml"
                }
            ]
        },
        {
            "name" : "pcgamer",
            "rank": 30,
            "domain": "pcgamer.com",
            "mainCategory": "Games",
            "subCategory": "Video Games",
            "feeds" : [
                {
                    "categories" : ["news"],
                    "url" : "http://dynamic.feedsportal.com/pf/510578/http://www.pcgamer.com/feed/rss2/"
                }
            ]
        },
        {
            "name" : "engadget",
            "rank": 31,
            "domain": "engadget.com",
            "mainCategory": "Games",
            "subCategory": "Video Games",
            "feeds" : [
                {
                    "categories" : ["news"],
                    "url" : "http://www.engadget.com/tag/@gaming/rss.xml"
                }
            ]
        }
    ]
};

module.exports = funneldata;