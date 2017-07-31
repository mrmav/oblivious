Game.HowTo = function(){};

Game.HowTo.prototype = {

    init: function() {



    },

    create: function() {

        let text =  "On desktop:\n";
        text += "Use the arrows to control the hero.\n";
        text += "Press the 'Z' key to perform an attack!\n\n";
        text += "On mobile:\n";
        text += "Use the analog at the left to control the hero.\n";
        text += "Press the 'A' button on the right to perform an attack!\n\n";
        text += "The hero will attack to the direction you were last moving!\n";

        this.howToText = this.add.bitmapText(this.game.width / 2, 100, "font", text, 10);
        this.howToText.anchor.set(0.5, 0);
        this.howToText.align = "center";

        this.menuText = this.add.bitmapText(2, this.game.height -2, "font", "Menu", 10);
        this.menuText.anchor.set(0, 1);
        this.menuText.inputEnabled = true;
        this.menuText.events.onInputDown.add(() => {
            "use strict";

            this.game.state.start("Game.Menu");

        });

    }

};