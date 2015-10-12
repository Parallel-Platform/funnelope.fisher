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
            "rank": 3,
            "domain": "gamefaqs.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 4,
            "domain": "battlefield.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
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
            "rank": 6,
            "domain": "jeuxvideo.com",
            "mainCategory": "Games",
            "subCategory": "Video Games",
            "language" : "french"
        },
        {
            "rank": 7,
            "domain": "xbox.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
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
            "rank": 9,
            "domain": "duowan.com",
            "mainCategory": "Games",
            "subCategory": "Video Games",
            "language" : "mandarin"
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
            "rank": 11,
            "domain": "gamersky.com",
            "mainCategory": "Games",
            "subCategory": "Video Games",
            "language" : "mandarin"
        },
        {
            "rank": 12,
            "domain": "oceanofgames.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
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
            "rank": 14,
            "domain": "3dmgame.com",
            "mainCategory": "Games",
            "subCategory": "Video Games",
            "language" : "mandarin"
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
            "rank": 17,
            "domain": "hltv.org",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 18,
            "domain": "gamestorrents.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 19,
            "domain": "inven.co.kr",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 20,
            "domain": "minijuegos.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 21,
            "domain": "dotabuff.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 22,
            "domain": "360game.vn",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 23,
            "domain": "ubi.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 24,
            "domain": "vnwebgame.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 25,
            "domain": "bungie.net",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 26,
            "domain": "playground.ru",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 27,
            "domain": "skidrowreloaded.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 28,
            "domain": "origin.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 29,
            "domain": "tgbus.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 30,
            "domain": "pcgamer.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 31,
            "domain": "7k7k.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 32,
            "domain": "ali213.net",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 33,
            "domain": "ngacn.cc",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 34,
            "domain": "gry-online.pl",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 35,
            "domain": "dw.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 36,
            "domain": "garena.vn",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 37,
            "domain": "nexon.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 38,
            "domain": "farming-simulator.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 39,
            "domain": "gtainside.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 40,
            "domain": "neogaf.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 41,
            "domain": "gog.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 42,
            "domain": "yahoo-mbga.jp",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 43,
            "domain": "modhoster.de",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 44,
            "domain": "gta5-mods.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 45,
            "domain": "riotgames.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 46,
            "domain": "steamgifts.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 47,
            "domain": "coolrom.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 48,
            "domain": "game-game.com.ua",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 49,
            "domain": "zyngagames.com",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        },
        {
            "rank": 50,
            "domain": "desert-operations.es",
            "mainCategory": "Games",
            "subCategory": "Video Games"
        }
    ]
};

module.exports = funneldata;