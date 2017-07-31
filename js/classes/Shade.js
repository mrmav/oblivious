const Shade = function (game, x, y, key, frame) {

    // Initialize sprite
    Phaser.Sprite.call(this, game, x, y, key, frame);

    this.smoothed = false;

    this.maxAlpha = 1;
    this.alpha = this.maxAlpha;

    this.tileBasedPosition = [0, 0];

};

Shade.prototype = Object.create(Phaser.Sprite.prototype);
Shade.prototype.constructor = Phaser.Sprite;