let Game = {

    author: "mrmav",
    name: "OBLIVIOUS",

    config: {
        width: 640,
        height: 360,
        renderer: Phaser.AUTO,
        enableDebug: false
    },

    tilesSize: 48,
    hash: "",
    level: 1,
    mapWidth: 6,
    mapHeight: 5,
    playerHealth: 0,
    deaths: 0,

    lighting: true,
    bodys: false,
    DEBUG_MODE: false

};

Game.makeid = function() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

Game.setGameData = function() {
    "use strict";

    localStorage["oblivious.hash"] = Game.hash;
    localStorage["oblivious.level"] = Game.level;
    localStorage["oblivious.playerHealth"] = Game.playerHealth;
    localStorage["oblivious.mapWidth"] = Game.mapWidth;
    localStorage["oblivious.mapHeight"] = Game.mapHeight;
    localStorage["oblivious.deaths"] = Game.deaths;

};



Game.getGameData = function() {

    if(localStorage.length > 0) {

        Game.hash = localStorage["oblivious.hash"];
        Game.level = parseInt(localStorage["oblivious.level"]);
        Game.playerHealth = parseInt(localStorage["oblivious.playerHealth"]);
        Game.mapWidth = parseInt(localStorage["oblivious.mapWidth"]);
        Game.mapHeight = parseInt(localStorage["oblivious.mapHeight"]);
        Game.deaths = parseInt(localStorage["oblivious.deaths"]);
    }

};



Game.reset = function() {
    "use strict";

    localStorage.clear();

    Game.hash = Game.makeid();

    Game.level = 1;
    Game.mapWidth = 6;
    Game.mapHeight = 5;
    Game.playerHealth = 0;
    Game.deaths = 0;

};

Game.goFull = function() {
    "use strict";

    if (game.scale.isFullScreen)
    {
        game.scale.stopFullScreen();
    }
    else
    {
        game.scale.startFullScreen(false);
    }

};