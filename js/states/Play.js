Game.Play = function () {

    this.generator = null;
    this.sizeIncrementsWidth = 3;
    this.sizeIncrementsHeight = 2;

};

Game.Play.prototype = {

    init: function () {

        this.killedEnemies = 0;
        this.generator = new Generator([Game.hash + Game.level]);
        //this.size = this.generator.rnd.between(3, 21);
        this.mapSize = {width: Game.mapWidth, height: Game.mapHeight};  // must be w >= 6 and odd and h >= 3 not odd
        // width and height are actually messed up in this game. I suck.

    },

    create: function () {

        if(Game.DEBUG_MODE)  this.game.add.plugin(Phaser.Plugin.Debug);

        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.maze = this.generator.makeMaze2(this.mapSize.width, this.mapSize.height);

        // maybe setting bounds to the world
        // and killing enemies that go outside of it
        // its a nice solution for their bug of not turning back xD
        this.world.setBounds(0, 0, this.maze.height * Game.tilesSize, this.maze.width * Game.tilesSize);

        /*

        Sound

         */

        this.ambient = this.add.audio('ambient');
        this.ambient.play("", 0, 1, true);
        this.sfx = this.add.audio('sfx');
        this.sfx.allowMultiple = true;

        //	And this defines the markers.

        //	They consist of a key (for replaying), the time the sound starts and the duration, both given in seconds.
        //	You can also set the volume and loop state, although we don't use them in this example (see the docs)
        this.sfx.addMarker('footstep1', 0.00, 0.24);
        this.sfx.addMarker('footstep2', 0.25, 0.28);
        this.sfx.addMarker('footstep3', 0.55, 0.24);

        this.sfx.addMarker('attack1', 0.80, 0.40);
        this.sfx.addMarker('attack2', 1.45, 0.40);
        this.sfx.addMarker('attack3', 2.10, 0.40);

        this.sfx.addMarker('hit1', 2.70, 0.70);
        this.sfx.addMarker('hit2', 3.80, 0.70);
        this.sfx.addMarker('hit3', 5.00, 0.70);
        this.sfx.addMarker('hit4', 5.90, 0.70);
        this.sfx.addMarker('hit5', 6.90, 0.70);

        this.sfx.addMarker('monsterDie', 8.00, 1.00);
        this.sfx.addMarker('monsterHit', 9.05, 0.25);
        this.sfx.addMarker('monsterNoise1',  9.40, 2.30);
        this.sfx.addMarker('monsterNoise2', 11.80, 2.30);

        this.sfx.addMarker('pickupCoin', 14.25, 0.30);

        this.sfx.addMarker('playerHurt1', 14.60, 0.70);
        this.sfx.addMarker('playerHurt2', 15.36, 0.30);

        /*
         *  Game Objects
         */
        this.lightEmittingObjects = [];
        this.worldLightMatrix = [];
        this.resetWorldLightMatrix();

        this.tiles = this.add.group();
        this.wallAssets = this.add.group();

        let p = this.maze.deadEnds[0];  // this sets it to be the last cell discovered (i guess..)
        this.end = this.createEndAsset(p[0] * Game.tilesSize, p[1] * Game.tilesSize);

        this.coins = this.add.group();
        this.createCoins();

        this.enemies = this.add.group();
        this.numberOfEnemies = 0;
        if(Game.level > 2) {

            this.createEnemies();

        }

        this.player = new Player(game, Game.tilesSize * 1.5, Game.tilesSize * 2.5, null, null, this.sfx);  // spawn hero at the first tile [1, 2] (0.5 to center)
        this.player.health = Game.playerHealth > 0 ? Game.playerHealth : this.player.health;
        this.add.existing(this.player);
        this.player.hostiles.push(this.enemies);
        this.lightEmittingObjects.push(this.player);

        this.shades = this.add.group();

        for (let y = 0; y < this.maze.grid[0].length; y++) {

            for (let x = 0; x < this.maze.grid.length; x++) {

                if (this.maze.grid[x][y] === 2) {

                    this.tiles.add(this.createWallTile(x * Game.tilesSize, y * Game.tilesSize, "wall"));
                    this.createWallAsset(x * Game.tilesSize, y * Game.tilesSize);

                } else if (this.maze.grid[x][y] === 1) {

                    this.tiles.add(this.createWallTile(x * Game.tilesSize, y * Game.tilesSize, "ceiling"));

                } else if (this.maze.grid[x][y] === 0) {

                    this.tiles.add(this.createGroundTile(x * Game.tilesSize, y * Game.tilesSize));

                }

                this.shades.add(this.createShadeTile(x * Game.tilesSize, y * Game.tilesSize, "tileset", 47));

            }

        }

        this.cameraLerp = 0.2;
        this.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, this.cameraLerp, this.cameraLerp);
        this.camera.roundPX = false;
        this.camera.bounds = null;
        this.camera.tileBounds = {
            topLeftCorner: [0, 0],
            bottomRightCorner: [0, 0]
        };
        this.camera.position.x = this.player.position.x;
        this.camera.position.y = this.player.position.y;


        /*
        Input
         */
        if (this.game.device.desktop) {

            this.attackKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);

            //  Stop the following keys from propagating up to the browser
            this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.Z]);

            this.cursors = this.input.keyboard.createCursorKeys();

        } else {

            this.gamepad = new VirtualGamepad(this.game, // game
                91,                    // joystick x
                this.game.height - 91,   // joystick y
                this.game.width - 91,  // buttons x
                this.game.height - 91, // buttons y
                81,                    // joystick action radius
                50                     // size
            );

        }

        /*
        Visual elements
         */

        this.ui = this.add.group();
        this.ui.fixedToCamera = true;

        this.playerIcon = this.game.add.image(2, 2, "tileset", 59);
        this.hearts = this.add.group();
        for(let i = 0; i < this.player.health; i++) {
            let h = this.add.image(20 + (i * (16 + 2)), 2, "tileset", 50);
            h.scale.set(16 / 11);
            this.hearts.add(h);
        }

        this.enemyIcon = this.game.add.image(2, 18, "tileset", 57);
        this.enemyCountText = this.game.add.bitmapText(2 + 16 + 2, 18, 'font', ` 0 / ${this.numberOfEnemies}`, 16);
        this.enemyIcon.addChild(this.enemyCountText);

        this.coinIcon = this.game.add.image(2, 18*2, "tileset", 44);
        this.coinCountText = this.game.add.bitmapText(2 + 16 + 2, 18*2, 'font', ` 0 / ${this.coins.children.length}`, 16);
        this.coinIcon.addChild(this.coinCountText);

        this.ui.add(this.playerIcon);
        this.ui.add(this.hearts);
        this.ui.add(this.enemyIcon);
        this.ui.add(this.coinIcon);
        this.ui.add(this.enemyCountText);
        this.ui.add(this.coinCountText);

        this.notificationText = this.add.bitmapText(0, 0, 'font', '', 16);
        this.notificationText.anchor.set(0.5);
        this.notificationText.alpha = 0;
        this.notificationText.kill();
        //to(properties, duration, ease, autoStart, delay, repeat, yoyo) {Phaser.Tween}
        this.notificationTextTweenIn = this.add.tween(this.notificationText).to({alpha: 1}, 1500, Phaser.Easing.Linear.Out);
        this.notificationTextTweenOut = this.add.tween(this.notificationText).to({alpha: 0}, 2500, Phaser.Easing.Linear.In);
        this.notificationTextTweenIn.chain(this.notificationTextTweenOut);
        this.notificationTextTweenOut.onComplete.add(() => {
            "use strict";
            this.notificationText.kill();
        });

        Game.setGameData();

    },

    update: function () {

        this.updateEnemies();

        if(this.player.alive) {

            this.updatePlayer();

            this.physics.arcade.collide(this.tiles, this.player);

            if (!this.player.attacking && !this.player.imune) {

                this.physics.arcade.overlap(this.player, this.enemies, (p, e) => {

                    p.receiveDamage(e.damage);

                    if(this.hearts.children[this.hearts.children.length - 1] !== undefined) {

                        this.hearts.children[this.hearts.children.length - 1].destroy();

                    }

                    if (p.health <= 0) {

                        this.notify(this.player.position.x, this.player.position.y, "You died.");

                        if(!this.game.device.desktop) {
                            this.gamepad.destroy();
                        }
                        this.ui.killAll();

                        Game.deaths++;

                        Game.setGameData();

                        // add(delay, callback, callbackContext, arguments)
                        this.time.events.add(5000, () => {

                            this.game.state.start("Game.Menu");

                        });

                    }

                });

            }

            this.updateCoinsPickup();
            this.updateUIEnemyText();

        } else {

            this.camera.reset();
            this.camera.focusOnXY(this.player.deadLocation.x, this.player.deadLocation.y);

        }

        this.updateCameraTileBounds();
        this.updateTiles();
        this.resetWorldLightMatrix();
        this.updateLightEmittingObjectsNeighbours();
        this.updateWorldLightMatrix();

        this.testLevelComplete();

    },

    createCoins: function() {
        "use strict";

        let l = this.maze.corridors.length;
        for(let i = 1; i < l; i++) {  // skip first

            let chance = this.generator.rnd.between(1, 100) <= 50;

            if(chance) {

                let l1 = this.maze.corridors[i].data.length -1;

                for(let j = 1; j < l1; j++) {  // the corridors are extrapolated by 1 in both dirs)

                    let chance = this.generator.rnd.between(0, 100) <= 75;

                    let tileX = this.maze.corridors[i].data[j][0];
                    let tileY = this.maze.corridors[i].data[j][1];

                    // not spawning in the exit
                    if(tileX === this.end.tileBasedPosition[0] &&
                       tileY === this.end.tileBasedPosition[1]) {

                        chance = false;

                    }

                    if(chance) {

                        let coin = new Coin(
                            game,
                            this.maze.corridors[i].data[j][0] * Game.tilesSize + (Game.tilesSize / 2),
                            this.maze.corridors[i].data[j][1] * Game.tilesSize + (Game.tilesSize / 2),
                            "tileset",
                            44
                        );
                        coin.scale.set(Game.tilesSize / 2 / 16);
                        this.getTileBasedPosition(coin);
                        this.add.existing(coin);
                        this.coins.add(coin);

                    }

                }

            }


        }

    },

    createShadeTile: function (x, y, img, frame) {

        let shade = new Shade(game, x, y, img, frame);
        shade.scale.set(Game.tilesSize / 16);
        this.getTileBasedPosition(shade);

        this.add.existing(shade);

        return shade;

    },

    createEndAsset: function(x, y) {

        // generate wall assets
        let frame = this.generator.rnd.between(45, 46);

        let end = new WallAsset(game, x, y, "tileset", frame);

        this.getTileBasedPosition(end);

        end.scale.set(Game.tilesSize / 16);  // 16 is the image size

        this.add.existing(end);

        return end;


    },

    createWallAsset: function(x, y) {

        // generate wall assets
        let frame = this.generator.rnd.between(24, 43);

        let number = this.generator.rnd.between(1, 100);

        if(number <= 5) { // 25 percent

            let fire = new Fireplace(game, x, y);
            fire.scale.set(Game.tilesSize / 16);  // 16 is the image size
            this.getTileBasedPosition(fire);

            this.add.existing(fire);
            this.wallAssets.add(fire);
            this.lightEmittingObjects.push(fire);



        } else if(number <= 15) { // 25 percent

            let torch = new Torch(game, x + (Game.tilesSize / 2), y + (Game.tilesSize / 2));
            torch.scale.set(Game.tilesSize / 16);  // 16 is the image size
            this.getTileBasedPosition(torch);

            this.add.existing(torch);
            this.wallAssets.add(torch);
            this.lightEmittingObjects.push(torch);



        } else if(number <= 50) {

            let asset = new WallAsset(game, x, y, "tileset", frame);

            asset.scale.set(Game.tilesSize / 16);  // 16 is the image size

            this.add.existing(asset);

            this.wallAssets.add(asset);

        }

    },

    createWallTile: function (x, y, type) {

        let frame = -1;

        if(type === "ceiling") {

            frame = this.generator.bitmaskCeilings(this.maze.grid, [Math.floor(x / Game.tilesSize), Math.floor(y / Game.tilesSize)]);

        } else if(type === "wall") {

            frame = this.generator.getWallFrame(this.maze.grid, [Math.floor(x / Game.tilesSize), Math.floor(y / Game.tilesSize)]);

        } else {

            console.warn("No type specified at wall creation.");
            return;

        }

        let wall = new Wall(game, x, y, "tileset", frame);
        wall.scale.set(Game.tilesSize / 16);  // 16 is the image size
        this.getTileBasedPosition(wall);

        this.add.existing(wall);

        // wall.debug.body = true;

        return wall;

    },

    createGroundTile: function (x, y) {

        let ground = new Ground(game, x, y, "tileset", this.generator.rnd.between(16, 19));
        ground.scale.set(Game.tilesSize / 16);  // 16 is the image size
        this.getTileBasedPosition(ground);

        this.add.existing(ground);

        return ground;

    },

    createEnemies: function () {

        // enemys will be randomly spawned on corridors
        // no enemys on the first corridor
        // no duplicated enemys on corridors ?

        let l = this.maze.corridors.length;
        for (let i = 1; i < l; i++) {

            let chance = this.generator.rnd.between(0, 1) < 1;

            if (chance) {

                let enemy = new Enemy(game, this.maze.corridors[i].data[1][0] * Game.tilesSize + Game.tilesSize / 2,
                    this.maze.corridors[i].data[1][1] * Game.tilesSize + Game.tilesSize / 2,
                    "tileset",
                    this.generator.rnd.between(56, 58),
                    this.maze.corridors[i],
                    this.sfx);

                enemy.turnAroundPoint[0] = this.maze.corridors[i].data[0][0];
                enemy.turnAroundPoint[1] = this.maze.corridors[i].data[0][1];

                this.game.add.existing(enemy);

                this.enemies.add(enemy);

                this.numberOfEnemies++;

            }

        }
    },

    getTileBasedPosition: function (obj, offsetx = 0, offsety = 0) {

        obj.tileBasedPosition[0] = Math.floor((obj.position.x + offsetx) / Game.tilesSize);
        obj.tileBasedPosition[1] = Math.floor((obj.position.y + offsety) / Game.tilesSize);
    },

    getTileAt: function (group, positionArray, func) {

        let t = this[group].getAt((positionArray[1] * this.maze.height + positionArray[0]));

        if (func !== undefined) {

            func(t);

        }

        return t;

    },

    updatePlayer: function () {

        this.getTileBasedPosition(this.player);

        if (this.game.device.desktop) {

            if (this.cursors.left.isDown) {
                this.player.moveLeft();

            }
            else if (this.cursors.right.isDown) {
                this.player.moveRight();
            }

            if (this.cursors.up.isDown) {
                this.player.moveUp();
            }
            else if (this.cursors.down.isDown) {
                this.player.moveDown();
            }

            if (this.attackKey.isDown) {

                this.player.attack(this.enemies);

            }

        } else {

            // for mobile

            this.gamepad.update();

            let speedX = this.player.speed * this.gamepad.properties.deltaX;
            let speedY = this.player.speed * this.gamepad.properties.deltaY;

            if (Math.abs(speedX) >= Math.abs(speedY)) {

                if (this.gamepad.properties.x > 0) {

                    this.player.moveRight(speedX);

                } else if (this.gamepad.properties.x < 0) {

                    this.player.moveLeft(speedX);

                }

            }
            if (Math.abs(speedY) > Math.abs(speedX)) {

                if (this.gamepad.properties.y > 0) {

                    this.player.moveDown(speedY);

                } else if (this.gamepad.properties.y < 0) {

                    this.player.moveUp(speedY);

                }

            }

            // override player facing direction
            if (Math.abs(speedX) > Math.abs(speedY)) {

                if (speedX < 0) {

                    this.player.facing = 0;

                } else if (speedX > 0) {

                    this.player.facing = 2;

                }

            } else {

                if (speedY < 0) {

                    this.player.facing = 1;

                } else if (speedY > 0) {

                    this.player.facing = 3;

                }

            }

            if (this.gamepad.button.isDown) {
                this.player.attack(this.enemies);
            }

        }

        if (Game.bodys) {

            this.game.debug.body(this.player);
        }

    },

    updateCoinsPickup: function() {
        "use strict";

        this.coins.forEach(c => {

            if(c.alive && c.tileBasedPosition[0] === this.player.tileBasedPosition[0] &&
               c.tileBasedPosition[1] === this.player.tileBasedPosition[1]) {

                this.player.pickups += 1;
                this.sfx.play("pickupCoin");
                c.kill();

                this.updateUICoinText();

            }

        });


    },

    updateLightEmittingObjectsNeighbours: function() {
        "use strict";

        let l = this.lightEmittingObjects.length;

        for(let i = 0; i < l; i++) {

            this.lightEmittingObjects[i].updateNeighbourTiles(this.maze.grid);

        }

        //console.log(this.lightEmittingObjects[0].worldNeighbourTiles)

    },

    resetWorldLightMatrix: function() {
        "use strict";

        for(let i = 0; i < this.maze.height; i++) {

            this.worldLightMatrix[i] = [];

            for(let j = 0; j < this.maze.width; j++) {

                this.worldLightMatrix[i][j] = -10;

            }

        }

    },

    updateWorldLightMatrix: function() {
        "use strict";

        let l = this.lightEmittingObjects.length;
        for(let i = 0; i < l; i++) {

            // index0 is the player
            // skip if player is dead for effect
            if(i === 0 && !this.player.alive) {
                continue;
            }

            let obj = this.lightEmittingObjects[i];

            let l1 = obj.worldNeighbourTiles.length;
            for(let j = 0; j < l1; j++) {

                let x = obj.worldNeighbourTiles[j][0];
                let y = obj.worldNeighbourTiles[j][1];

                let valueX = obj.neighbourTiles[j][0];
                let valueY = obj.neighbourTiles[j][1];

                let dist = Math.abs(valueX) + Math.abs(valueY);

                if(x > -1 && y > -1) {

                    if(dist < Math.abs(this.worldLightMatrix[x][y])) {

                        this.worldLightMatrix[x][y] = dist;

                    }

                }

            }

        }

    },

    updateEnemies: function () {

        let offsetx = 0;
        let offsety = 0;

        this.enemies.forEach(e => {

            offsetx = 0;
            offsety = 0;

            if (e.speed.x !== 0 && e.speed.x > 0) offsetx = e.width / 2;
            if (e.speed.x !== 0 && e.speed.x < 0) offsetx = -(e.width / 2);
            if (e.speed.y !== 0 && e.speed.y > 0) offsety = e.height / 2;
            if (e.speed.y !== 0 && e.speed.y < 0) offsety = -(e.height / 2);

            this.getTileBasedPosition(e, offsetx, offsety);

            // kill out of bounds
            if(e.position.x - e.width < 0 ||
                e.position.x + e.width > this.game.world.width ||
                e.position.y - e.height < 0 ||
                e.position.y + e.height > this.game.world.height) {

                this.enemies.remove(e, true, true);
                this.numberOfEnemies--;

                console.log("Enemy out of bounds kill");

            }

            if (Game.bodys) this.game.debug.body(e);

        });

    },

    updateShadeAlpha: function (shade) {

        // darken tile
        let applyValue = shade.alpha * 1.01;

        if (applyValue > 1) {
            shade.alpha = 1;
        } else {
            shade.alpha = applyValue;
        }

        // lighten tile
        let x = shade.tileBasedPosition[0];
        let y = shade.tileBasedPosition[1];

        if(this.worldLightMatrix[x][y] > -1) {

            let dist = this.worldLightMatrix[x][y];

            let maxValue = Phaser.Math.mapLinear(dist, 0, 3, 0.25, 0.75);  // the distance, range min, range max, min applicable, max applicable

            applyValue = shade.alpha * 0.95;

            if (applyValue > maxValue) {
                shade.alpha = applyValue;
            } else {
                shade.alpha = maxValue;
            }

        }

    },

    updateCameraTileBounds: function () {

        let x1 = Math.floor(this.camera.view.x / Game.tilesSize);
        let y1 = Math.floor(this.camera.view.y / Game.tilesSize);

        let x2 = Math.floor((this.camera.view.x + this.camera.view.width) / Game.tilesSize);
        let y2 = Math.floor((this.camera.view.y + this.camera.view.height) / Game.tilesSize);


        this.camera.tileBounds.topLeftCorner[0] = x1 > 0 ? x1 : 0;
        this.camera.tileBounds.topLeftCorner[1] = y1 > 0 ? y1 : 0;

        this.camera.tileBounds.bottomRightCorner[0] = x2 > (this.maze.height - 1) ? this.maze.height - 1 : x2;
        this.camera.tileBounds.bottomRightCorner[1] = y2 > (this.maze.width - 1) ? this.maze.width - 1 : y2 ;


    },

    setRenderableTiles: function (tile, shade) {

        tile.exists = false;
        if (tile.body !== null) tile.body.enabled = false;

        shade.exists = false;


        if (tile.tileBasedPosition[0] >= this.camera.tileBounds.topLeftCorner[0] &&
            tile.tileBasedPosition[0] <= this.camera.tileBounds.bottomRightCorner[0] &&
            tile.tileBasedPosition[1] >= this.camera.tileBounds.topLeftCorner[1] &&
            tile.tileBasedPosition[1] <= this.camera.tileBounds.bottomRightCorner[1]) {

            tile.exists = true;
            if (tile.body !== null) tile.body.enabled = true;

            shade.exists = true;

        }


    },

    updateTiles: function () {

        this.tiles.forEach(tile => {

            let shade = this.getTileAt("shades", tile.tileBasedPosition);

            this.setRenderableTiles(tile, shade);

            //only update renderable shades
            if (shade.exists) this.updateShadeAlpha(shade);

            if (Game.bodys) this.game.debug.body(tile);


        });

    },

    updateUICoinText: function() {
        "use strict";

        this.coinCountText.text = ` ${this.player.pickups} / ${this.coins.children.length}`;

    },

    updateUIEnemyText: function() {
        "use strict";

        this.enemyCountText.text = ` ${this.player.killedEnemies} / ${this.numberOfEnemies}`;

    },

    testLevelComplete: function() {
        "use strict";

        if(this.player.tileBasedPosition[0] === this.end.tileBasedPosition[0] &&
            this.player.tileBasedPosition[1] === this.end.tileBasedPosition[1]) {

            if (this.numberOfEnemies === this.player.killedEnemies &&
                this.coins.children.length === this.player.pickups) {

                this.nextLevel();

            } else {

                this.notify(this.end.position.x + Game.tilesSize / 2, this.end.position.y - Game.tilesSize / 2, "Level not clear yet...");

            }
        }

    },

    nextLevel: function() {
        "use strict";

        Game.level++;
        Game.mapWidth += this.sizeIncrementsWidth;
        Game.mapHeight += this.sizeIncrementsHeight;
        Game.playerHealth = this.player.health >= 5 ? this.player.health : this.player.health + 1;

        Game.setGameData();

        this.game.state.start("Game.Play");

    },

    notify: function(x, y, string) {
        "use strict";

        this.notificationText.revive();

        this.notificationText.x = x;
        this.notificationText.y = y;
        this.notificationText.setText(string);

        this.notificationTextTweenIn.start();

    },

    shutdown: function() {
        "use strict";

        this.game.sound.stopAll()

    }

};