const Coin = function (game, x, y, key, frame) {

    // Initialize sprite
    Phaser.Image.call(this, game, x, y, key, frame);

    this.anchor.set(0.5);

    this.smoothed = false;
    this.tileBasedPosition = [0, 0];

};

Coin.prototype = Object.create(Phaser.Image.prototype);
Coin.prototype.constructor = Phaser.Image;

// Coin.prototype.update = function() {
//     "use strict";
//
//
//
// }
