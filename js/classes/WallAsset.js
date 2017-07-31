const WallAsset = function (game, x, y, key, frame) {

    // Initialize sprite
    Phaser.Image.call(this, game, x, y, key, frame);

    this.smoothed = false;
    this.tileBasedPosition = [0, 0];

};

WallAsset.prototype = Object.create(Phaser.Image.prototype);
WallAsset.prototype.constructor = Phaser.Image;

