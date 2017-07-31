const HitBox = function(game, x, y, width, height, damage, dir) {
	
	Phaser.Sprite.call(this, game, x, y, null);

	this.name = "hitbox" + dir;

	// physics
	game.physics.enable(this);
	this.body.immovable = true;	
	this.body.setSize(width, height);
	this.body.enable = false;
	
	this.damage = damage;
	this.dir = dir;

	this.renderable = false;
};

HitBox.prototype = Object.create(Phaser.Sprite.prototype);
HitBox.prototype.constructor = Phaser.Sprite;

HitBox.prototype.makeDamage = function(opponent) {
	
	return opponent.receiveDamage(this.damage);
	
};