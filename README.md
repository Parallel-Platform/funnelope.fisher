# funnelope.fisher
It's a "funnel"...it's a "lope"...it's a funnelope! :P

funnelope.fisher is a small nodejs program/experiment that retrieves media content across various gaming sites and 'tries' to categorize them by video game, while building relevant content/search tags for them as well. Head on over to the [content/ign.json](https://github.com/Parallel-Platform/funnelope.fisher/blob/master/content/ign.json) file for an example of what a tagged content looks like

## Motivation - (Why the 'fudge' am I even doing this?)

1. Because it's fun!
2. Because I'm trying to build a web-based platform dedicated to video game entertainment/services and 
3. Because my 2 little boys dominate the TV in my living room with Bubbleguppy reruns, and so my PC's the only place I can find solace at home, and not go crazy from cartoon sing-a-longs lulz :\

## Requirements
* [NodeJS](https://nodejs.org/)
* A games.json file generated from the [funnelope.downloader](https://github.com/Parallel-Platform/funnelope.downloader)

## Installation

* Install the node dependencies.

```shell
npm install
```

* Pull down the [funnelope.downloader](https://github.com/Parallel-Platform/funnelope.downloader) repo, run it (**warning**, it takes a long time, as it downloads all video games for "every platform" and stores them to a JSON file) and copy over the games.json file over to this project's root directory
* (Or you could just use the current games.json files within the repo, but it is stale and will need to be updated)

* For each "fisher" you are running (execept Twitch), make sure you have created the appropriate <fisher>.json file in the content folder.

## Running

Run the application via node.js

```shell
node app.js
```


