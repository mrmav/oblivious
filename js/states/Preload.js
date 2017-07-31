Game.Preload = function() {};

Game.Preload.prototype = {

    init: function() {
        "use strict";

        this.text = this.add.bitmapText(this.world.centerX, this.world.centerY, 'font', 'Loading: 0%', 16);
        this.text.anchor.set(0.5);

    },

    preload: function() {

        // load all assets, files, etc

        // Load tileset
        //key, url, frameWidth, frameHeight, frameMax, margin, spacing
        this.load.spritesheet('tileset', 'assets/tileset.png', 16, 16, -1, 0, 1);

        // load gamepad
        this.load.atlas('gamepad', 'assets/gamepad.png', 'assets/gamepad.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

        // load sound
        this.load.audio('sfx', 'assets/sound/optimized/sfx.ogg');
        this.load.audio('ambient', 'assets/sound/optimized/atmoseerie01.ogg');


        this.load.onFileComplete.add(this.fileLoaded, this);


    },

    create: function() {


    },

    fileLoaded: function (progress) {

        this.text.text = "Loading: " + progress + "%";

    },

    loadUpdate: function () {

    },

    create: function () {

        this.add.tween(this.text.scale).to( { x: 0, y: 0 }, 1000, "Elastic.easeIn", true, 250);

        this.time.events.add(1200, function(){
            this.state.start("Game.Menu");
        }, this);


    }

};