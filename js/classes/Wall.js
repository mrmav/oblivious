const Wall = function (game, x, y, key, frame) {

    // Initialize sprite
    Phaser.Sprite.call(this, game, x, y, key, frame);

    this.smoothed = false;

    game.physics.enable(this);
    this.body.immovable = true;

    this.tileBasedPosition = [0, 0];


};

Wall.prototype = Object.create(Phaser.Sprite.prototype);
Wall.prototype.constructor = Phaser.Sprite;