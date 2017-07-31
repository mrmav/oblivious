const Ground = function (game, x, y, key, frame) {

    // Initialize sprite
    Phaser.Sprite.call(this, game, x, y, key, frame);

    this.smoothed = false;

    this.tileBasedPosition = [0, 0];

};

Ground.prototype = Object.create(Phaser.Sprite.prototype);
Ground.prototype.constructor = Phaser.Sprite;