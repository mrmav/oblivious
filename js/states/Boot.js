Game.Boot = function(){};

Game.Boot.prototype = {

    init: function() {

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;

        // enable crisp rendering
        this.game.renderer.renderSession.roundPixels = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        this.stage.setBackgroundColor("#000000");
        this.time.advancedTiming = true;

        Game.hash = Game.makeid();

        //this.time.desiredFps = 60;

    },

    preload: function() {

        // load a few assets for loading and splash screen

        // font
        this.load.bitmapFont('font', 'assets/fonts/kenpixel_regular.png', 'assets/fonts/kenpixel_regular.fnt');

    },

    create: function() {

        this.state.start("Game.Preload");

    }

};