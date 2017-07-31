const Fireplace = function (game, x, y) {

    // Initialize sprite
    Phaser.Image.call(this, game, x, y, "tileset");

    this.animations.add("base", [52, 53], 4, true);
    this.animations.play("base");

    // settings
    this.smoothed = false;

    // light system variables
    this.neighboursDimension = 2;
    this.tileBasedPosition = [0, 0];
    this.neighbourTiles = Generator.vonNeumannNeighborhood(this.neighboursDimension, 2);
    this.worldNeighbourTiles = Generator.vonNeumannNeighborhood(this.neighboursDimension, 2);


};

Fireplace.prototype = Object.create(Phaser.Sprite.prototype);
Fireplace.prototype.constructor = Phaser.Sprite;

Fireplace.prototype.updateNeighbourTiles = function(grid) {

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