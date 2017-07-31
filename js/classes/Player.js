const Player = function (game, x, y, key, frame, sfx) {

    // Initialize sprite
    Phaser.Sprite.call(this, game, x, y, "tileset", 59);

    // settings
    this.anchor.set(0.5);
    this.smoothed = false;
    this.scaleValue = Game.tilesSize * 0.75 / 16;
    this.scale.set(this.scaleValue);

    // variables
    this.initialSpeed = 100 * this.scale.x;  // speed based on size
    this.speed = this.initialSpeed;

    this.facing = 2;

    this.maxHealth = 5;
    this.health = this.maxHealth;
    this.deadLocation = new Phaser.Point();

    this.attackRate = 400;
    this.attackReach = Game.tilesSize / 2;
    this.attackduration = 100;
    this.lastAttack = 0;
    this.attacking = false;
    this.damage = 1;
    this.hostiles = [];
    this.killedEnemies = 0;

    this.imuneInterval = 1000;
    this.imuneTimer = 0;
    this.imune = false;

    this.pickups = 0;

    // physics
    game.physics.enable(this);
    this.body.allowGravity = false;

    // light system variables
    this.neighboursDimension = 2;
    this.tileBasedPosition = [0, 0];
    this.neighbourTiles = Generator.vonNeumannNeighborhood(this.neighboursDimension, 2);
    this.worldNeighbourTiles = Generator.vonNeumannNeighborhood(this.neighboursDimension, 2);

    // attack effect
    this.attackTween = game.add.tween(this.position).to({x: 0, y: 0}, this.attackduration, Phaser.Easing.Linear.Out);
    this.attackTween.onComplete.add(() => {

        //COLLISION
        this.game.physics.arcade.overlap(this, this.hostiles, (hitbox, enemy) => {

            this.killedEnemies += this.makeDamage(enemy);
            this.playHitSound();

        });

    });
    this.recoverAttackTween = game.add.tween(this.position).to({x: 0, y: 0}, this.attackduration, Phaser.Easing.Linear.Out);
    this.recoverAttackTween.onComplete.add(() => {
        this.attacking = false
    });

    this.attackTween.chain(this.recoverAttackTween);


    this.sfx = sfx;


};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Phaser.Sprite;

Player.prototype.update = function() {

    // update immunity and blinking
    if (this.imune) {

        this.tint = 0xff0000;

        if (this.game.time.now % 20 > 10) {

            this.alpha = 0.5;

        } else {

            this.alpha = 1;

        }

        if (this.game.time.now > this.imuneTimer) {

            this.imune = false;
            this.alpha = 1;
            this.tint = 0xffffff;

        }

    }

    // movement damping
    this.body.velocity.multiply(0.8, 0.8);

};

Player.prototype.attack = function(group) {

    if(this.lastAttack < this.game.time.now) {

        this.attacking = true;

        // ANIMATION
        let a = this.attackReach;
        let x = 0;
        let y = 0;

        switch(this.facing) {
            case 0: x = -a; break;
            case 1: y = -a; break;
            case 2: x =  a; break;
            case 3: y =  a; break;
        }

        this.recoverAttackTween.timeline[0].vEnd.x = this.position.x;
        this.recoverAttackTween.timeline[0].vEnd.y = this.position.y;

        this.attackTween.timeline[0].vEnd.x = this.position.x + x;
        this.attackTween.timeline[0].vEnd.y = this.position.y + y;

        this.attackTween.start();
        this.playAttackSound();

        this.lastAttack = this.game.time.now + this.attackRate;

    }

};

Player.prototype.moveRight = function(speed = this.speed) {
	
	this.body.velocity.x = speed;
	this.facing = 2;
	this.playFootstepSound();

	//flip sprite
    this.scale.x = this.scaleValue;
	
};

Player.prototype.moveLeft = function(speed = -this.speed) {
	
	this.body.velocity.x = speed;
	this.facing = 0;
    this.playFootstepSound();

    this.scale.x = -this.scaleValue;

};

Player.prototype.moveDown = function(speed = this.speed) {
	
	this.body.velocity.y = speed;
	this.facing = 3;
    this.playFootstepSound();

};

Player.prototype.moveUp = function(speed = -this.speed) {
	
	this.body.velocity.y = speed;
	this.facing = 1;
    this.playFootstepSound();

};

Player.prototype.die = function() {
	
	this.game.state.start("Game.Play");
		
};

Player.prototype.updateNeighbourTiles = function(grid) {

    let l = this.neighbourTiles.length;
    let width  = grid.length;
    let height = grid[0].length;

    for(let i = 0; i < l; i++) {

        /**
         * Position on the world, for example:
         * If player has a position of [1, 1] and
         * the current neighbour we are checking is the [-1, 0] (left tile)
         * then x = 0, y = 1
         */
        
        let x = this.tileBasedPosition[0] + this.neighbourTiles[i][0];
        let y = this.tileBasedPosition[1] + this.neighbourTiles[i][1];

        // if x (tile based) is less than the width (tile based)
        if((x >= 0 && x < width && grid[x] !== "undefined"))  {

            this.worldNeighbourTiles[i][0] = x;

            if((y >= 0 && y < height && grid[x][y] !== "undefined")) {

                this.worldNeighbourTiles[i][1] = y;

            } else {

                this.worldNeighbourTiles[i][1] = -1;

            }

        } else {

            this.worldNeighbourTiles[i][0] = -1;

        }


    }



};

Player.prototype.generateNewNeighbours = function(n) {

    this.neighboursDimension = this.neighboursDimension + n >= 1 ? this.neighboursDimension + n : 1;

    this.neighbourTiles = Generator.vonNeumannNeighborhood(this.neighboursDimension, 2);
    this.worldNeighbourTiles = Generator.vonNeumannNeighborhood(this.neighboursDimension, 2);

};

Player.prototype.receiveDamage = function(n) {

    this.health -= n;

    if(this.health <= 0) {

        this.deadLocation.x = this.position.x;
        this.deadLocation.y = this.position.y;

        this.kill();
        
    } else {

        this.imune = true;
        this.imuneTimer = this.game.time.now + this.imuneInterval;

    }

    this.playHurtSound();

};

Player.prototype.makeDamage = function(opponent) {

    return opponent.receiveDamage(this.damage);

};

Player.prototype.playFootstepSound = function() {
    "use strict";

    if(this.game.time.now % 80 < 5) {

        this.sfx.play("footstep" + this.game.rnd.between(1, 3));

    }

};

Player.prototype.playHitSound = function() {
    "use strict";

    this.sfx.play("hit" + this.game.rnd.between(1, 5));

};

Player.prototype.playAttackSound = function() {
    "use strict";

    this.sfx.play("attack" + this.game.rnd.between(1, 3));

};
Player.prototype.playHurtSound = function() {
    "use strict";

    this.sfx.play("playerHurt" + this.game.rnd.between(1, 2));

};
