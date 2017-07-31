Game.Credits = function(){};

Game.Credits.prototype = {

    init: function() {



    },

    create: function() {


        this.titleText = this.add.bitmapText(this.game.width / 2, 50, "font", "Made possible by:", 32);
        this.titleText.anchor.set(0.5, 0);

        let text =  "www.kenney.nl:\n";
        text += "Font, Tileset, Characters, Mobile controls & Sound Effects\n\n";
        text += "www.opengameart.org:\n";
        text += "Matt Hackett of Lost Decade Games: Life heart icon\n";
        text += "Iwan 'qubodup' Gabovitch: Music Theme & Sound effects\n\n";
        text += "Game Developer:\n";
        text += "mrmav";


        this.creditsText = this.add.bitmapText(this.game.width / 2, 100, "font", text, 10);
        this.creditsText.anchor.set(0.5, 0);
        this.creditsText.align = "center";


        this.menuText = this.add.bitmapText(2, this.game.height -2, "font", "Menu", 10);
        this.menuText.anchor.set(0, 1);
        this.menuText.inputEnabled = true;
        this.menuText.events.onInputDown.add(() => {
            "use strict";

            this.game.state.start("Game.Menu");

        });

    }

};