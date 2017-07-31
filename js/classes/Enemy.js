const Enemy = function (game, x, y, img, key, corridorReference, sfx) {

    // Initialize sprite
    Phaser.Sprite.call(this, game, x, y, img, key);

    this.inputEnabled = true;
    //this.events.onInputDown.add(() => {console.log(this)}, this);

    // settings
    this.anchor.set(0.5);
    this.smoothed = false;
    this.scale.set(Game.tilesSize * 0.75 / 16);

    // physics
    game.physics.enable(this);
    this.body.allowGravity = false;

    // variables movement
    this.tileBasedPosition = [0, 0];
    this.turnAroundPoint = [0, 0];
    this.facing = 0;

    this.corridor = corridorReference;

    /*
     * General speed
     */
    this.initialSpeed = 20 * (Game.tilesSize / 16);

    /*
     * Set speed in relation to the corridor that this enemy patrols
     * (sorry, the axis are reversed.... noob --')
     */
    if (corridorReference.direction === "w") {

        this.speed = new Phaser.Point(0, this.initialSpeed);

    } else if (corridorReference.direction === "e") {

        this.speed = new Phaser.Point(0, -this.initialSpeed);

    } else if (corridorReference.direction === "n") {

        this.speed = new Phaser.Point(this.initialSpeed, 0);

    } else if (corridorReference.direction === "s") {

        this.speed = new Phaser.Point(-this.initialSpeed, 0);

    }


    /*
     * If this enemy is ready or not to think in turning around
     */
    this.seekTurnAround = true;

    /**
     * In which corridor end is this enemy
     */
    this.corridorEnd = 0;

    // health bar
    this.maxHealth = 2;
    this.health = this.maxHealth;
    this.damage = 1;
    this.blinking = false;
    this.blinkingTimer = 0;
    this.blinkingInterval = 500;

    this.sfx = sfx;
    this.noiseTimer = 0;
    this.noiseInterval = 2000;

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Phaser.Sprite;

Enemy.prototype.update = function() {


    if(this.game.time.now > this.noiseTimer) {

        let chance = this.game.rnd.between(1, 100) <= 10;

        if(chance) {

            this.playMonsterNoiseSound();


        }

        this.noiseTimer = this.game.time.now + this.noiseInterval;

    }


    if(this.seekTurnAround) {

        /*
         * If this enemys is at a turning point, flip its heading direction
         */
        if(this.tileBasedPosition[0] === this.turnAroundPoint[0] &&
           this.tileBasedPosition[1] === this.turnAroundPoint[1]) {

            this.flipDirection();

            this.seekTurnAround = false;

        }

    }

    /*
     * This checkouts the enemy from the current turning point
     * Whithout this, the enemy would glitch and be infinatly
     * changing direction, resulting in not moving at all.
     */
    if(this.tileBasedPosition[0] !== this.turnAroundPoint[0] ||
       this.tileBasedPosition[1] !== this.turnAroundPoint[1]) {

        this.seekTurnAround = true;

    }

    if (this.blinking) {

        this.tint = 0xff0000;

        if (this.game.time.now % 20 > 10) {

            this.alpha = 0.5;


        } else {

            this.alpha = 1;

        }

        if (this.game.time.now > this.blinkingTimer) {

            this.blinking = false;
            this.alpha = 1;
            this.tint = 0xffffff;
            this.setSpeed(this.initialSpeed);
        }

    }


    /*
     * Apply the speed to the velocity vector
     */
    this.body.velocity.x = this.speed.x;
    this.body.velocity.y = this.speed.y;


};

/*
 * This is the function responsible for fliping this enemy heading direction. 
 */
Enemy.prototype.flipDirection = function() {

    if(this.speed.x !== 0) this.speed.x = this.speed.x * -1;
    if(this.speed.y !== 0) this.speed.y = this.speed.y * -1;

    /*
     * based on corridorEnd, it sets turningPoint to be 
     * the opposite turning point
     */
    if(this.corridorEnd === 0) {

        this.turnAroundPoint[0] = this.corridor.data[this.corridor.data.length -1][0];
        this.turnAroundPoint[1] = this.corridor.data[this.corridor.data.length -1][1];

        this.corridorEnd = 1;
        this.facing = 1;

    } else if (this.corridorEnd === 1) {

        this.turnAroundPoint[0] = this.corridor.data[0][0];
        this.turnAroundPoint[1] = this.corridor.data[0][1];

        this.corridorEnd = 0;
        this.facing = -1;

    }

};

Enemy.prototype.setSpeed = function(s) {
    "use strict";

    if(this.speed.x !== 0) {

        this.speed.x = this.speed.x > 0 ? s : -s;

    } else if (this.speed.y !== 0) {

        this.speed.y = this.speed.y > 0 ? s : -s;

    }

};

Enemy.prototype.receiveDamage = function(n, k) {

    this.health -= n;

    if(this.health <= 0) {

        this.destroy();
        this.sfx.play("monsterDie");

        return 1;

    } else {

        this.blinkingTimer = this.game.time.now + this.blinkingInterval;
        this.blinking = true;

        this.sfx.play("monsterHit");

        return 0;
    }

};

Enemy.prototype.playMonsterNoiseSound = function() {
    "use strict";

    this.sfx.play("monsterNoise" + this.game.rnd.between(1, 2));

};