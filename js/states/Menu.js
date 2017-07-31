Game.Menu = function(){};

Game.Menu.prototype = {

    init: function() {


    },

    create: function() {

        this.ambient = this.add.audio('ambient');
        this.ambient.play("", 0, 1, true);

        this.titleText = this.add.bitmapText(this.game.width / 2, 50, "font", Game.name, 64);
        this.titleText.anchor.set(0.5, 0);
        this.add.tween(this.titleText.scale).to( { x: 1.1, y: 1.1 }, 1000, Phaser.Easing.Bounce.None, true, 0, -1, true).start();

        this.playText = this.add.bitmapText(2, this.game.height - 100, "font", "", 16);
        this.playText.anchor.set(0, 1);
        this.playText.inputEnabled = true;
        this.playText.events.onInputDown.add(() => {
            "use strict";

            this.game.state.start("Game.Play");

        });

        this.goFullScreen = this.add.bitmapText(this.game.width - 2, 2, "font", "fullscreen", 10);
        this.goFullScreen.anchor.set(1, 0);
        this.goFullScreen.inputEnabled = true;
        this.goFullScreen.events.onInputDown.add(() => {
            "use strict";

            Game.goFull();

        });

        // first run
        if(localStorage.length < 1) {

            localStorage.clear();
            Game.reset();

            this.playText.setText(`Play Game`);

        } else {

            Game.getGameData();

            this.playText.setText(`Continue world "${Game.hash}", level ${Game.level}`);

            this.resetText = this.add.bitmapText(2, this.game.height - 100 + 18, "font", "reset", 12);
            this.resetText.anchor.set(0, 1);
            this.resetText.inputEnabled = true;
            this.resetText.events.onInputDown.add(() => {
                "use strict";

                Game.reset();
                this.game.state.start("Game.Menu");

            });

            let s = Game.deaths > 1 ? "s" : "";
            this.obliviatedText = this.add.bitmapText(this.game.width / 2, 150, "font", "", 10);
            this.obliviatedText.setText(Game.deaths + "time" + s + " obliviated");
            this.obliviatedText.anchor.set(0.5, 0);


        }

        this.howToText = this.add.bitmapText(2, this.game.height -16, "font", "How to play", 10);
        this.howToText.anchor.set(0, 1);
        this.howToText.inputEnabled = true;
        this.howToText.events.onInputDown.add(() => {
            "use strict";

            this.game.state.start("Game.HowTo");

        });

        this.creditsText = this.add.bitmapText(2, this.game.height -2, "font", "Credits", 10);
        this.creditsText.anchor.set(0, 1);
        this.creditsText.inputEnabled = true;
        this.creditsText.events.onInputDown.add(() => {
            "use strict";

            this.game.state.start("Game.Credits");

        });

        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //  Stop the following keys from propagating up to the browser
        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

        this.spaceKey.onDown.add(()=>{
            "use strict";

            this.game.state.start("Game.Play");

        })


    },

    shutdown: function() {
        "use strict";

        this.game.sound.stopAll()

    }

};