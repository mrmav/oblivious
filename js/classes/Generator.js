class Generator {

	constructor(seed) {

		this.seed = seed;
		this.rnd = new Phaser.RandomDataGenerator(this.seed);
		this.vonNeighbours = Generator.vonNeumannNeighborhood(2, 2);

	}

	/** 
	 * Generates a perfect maze.
	 * Code from http://www.emanueleferonato.com/2015/06/30/pure-javascript-perfect-tile-maze-generation-with-a-bit-of-magic-thanks-to-phaser/
	 * Thanks a ton!
	 * 
	 * @param  {int} mazeWidth=21
	 * @param  {int} mazeHeight=21
	 * 
	 */
	makeMaze(mazeWidth = 21, mazeHeight = 21) {

		let grid = [];
		let moves = [];
		let corridors = [];
		let previousDirection = "";

		// starting position
		let pos = {x: 1, y: 1};

		// populate empty cells
		for(let i = 0; i < mazeHeight; i++) {
			
			grid[i] = [];
			
			for(let j = 0; j < mazeWidth; j++) {
				
				grid[i][j] = 1;
				
			}
						
		}

		grid[pos.x][pos.y] = 0;

		moves.push(pos.y + pos.y * mazeWidth);

		while(moves.length > 0) {

			let check = [];
			let corridorData = [];
			
			if(	pos.x + 2 > 0 && pos.x + 2 < mazeHeight - 1 && grid[pos.x + 2][pos.y] == 1) {
				
				check.push('S');

			}

			if(	pos.x - 2 > 0 && pos.x - 2 < mazeHeight - 1 && grid[pos.x - 2][pos.y] == 1) {
				
				check.push('N');

			}

			if(	pos.y - 2 > 0 && pos.y - 2 < mazeWidth - 1 && grid[pos.x][pos.y - 2] == 1) {
				
				check.push('W');

			}

			if(	pos.y + 2 > 0 && pos.y + 2 < mazeWidth - 1 && grid[pos.x][pos.y + 2] == 1) {
				
				check.push('E');

			}


			if(check.length > 0) {

				let move = check[this.rnd.between(0, check.length - 1)];

				if(move !== previousDirection) {

					corridors.push(new Corridor());
					corridors[corridors.length - 1].data.push([pos.x, pos.y]);

				}

				previousDirection = move;

				switch(move) {

					case 'N':
						grid[pos.x - 2][pos.y] = 0;
						grid[pos.x - 1][pos.y] = 0;

						corridors[corridors.length - 1].data.push([pos.x - 1, pos.y]);
						corridors[corridors.length - 1].data.push([pos.x - 2, pos.y]);

						corridors[corridors.length - 1].direction = "n";

						pos.x -= 2;
						break;

					case 'S':
						grid[pos.x + 2][pos.y] = 0;
						grid[pos.x + 1][pos.y] = 0;

						corridors[corridors.length - 1].data.push([pos.x + 1, pos.y]);
						corridors[corridors.length - 1].data.push([pos.x + 2, pos.y]);

						corridors[corridors.length - 1].direction = "s";

						pos.x += 2;
						break;

					case 'W':
						grid[pos.x][pos.y - 2] = 0;
						grid[pos.x][pos.y - 1] = 0;

						corridors[corridors.length - 1].data.push([pos.x, pos.y - 1]);
						corridors[corridors.length - 1].data.push([pos.x, pos.y - 2]);

						corridors[corridors.length - 1].direction = "w";

						pos.y -= 2;
						break;

					case 'E':
						grid[pos.x][pos.y + 2] = 0;
						grid[pos.x][pos.y + 1] = 0;

						corridors[corridors.length - 1].data.push([pos.x, pos.y + 1]);
						corridors[corridors.length - 1].data.push([pos.x, pos.y + 2]);

						corridors[corridors.length - 1].direction = "e";

						pos.y += 2;
						break;

				}

				moves.push(pos.y + pos.x * mazeWidth);

			} else {

				let back = moves.pop();
				pos.x = Math.floor(back/mazeWidth);
				pos.y = back % mazeWidth;

			}

		}

		for(let i = 0; i < corridors.length; i++) corridors[i].extrapolate();

		return {
			width: mazeWidth,
			height: mazeHeight,
			corridors,
			grid,
		};

	}

    /**
     * Generates a perfect maze.
     * Code from http://www.emanueleferonato.com/2015/06/30/pure-javascript-perfect-tile-maze-generation-with-a-bit-of-magic-thanks-to-phaser/
     * Thanks a ton!
     *
     * @param  {int} mazeWidth=21
     * @param  {int} mazeHeight=21
     *
     */
    makeMaze2(mazeWidth = 21, mazeHeight = 21) {

        let grid = [];
        let moves = [];
        let corridors = [];
        let previousDirection = "";
        let deadEnds = [];  // usefull to hide items

        // starting position
        let pos = {x: 1, y: 1};

        // populate empty cells
        for(let i = 0; i < mazeHeight; i++) {

            grid[i] = [];

            for(let j = 0; j < mazeWidth; j++) {

                grid[i][j] = 1;

            }

        }

        grid[pos.x][pos.y] = 0;

        moves.push(pos.y + pos.y * mazeWidth);

        while(moves.length > 0) {

            let check = [];
            let corridorData = [];

            if(	pos.x + 2 > 0 && pos.x + 2 < mazeHeight - 1 && grid[pos.x + 2][pos.y] === 1) {

                check.push('S');

            }

            if(	pos.x - 2 > 0 && pos.x - 2 < mazeHeight - 1 && grid[pos.x - 2][pos.y] === 1) {

                check.push('N');

            }

            if(	pos.y - 3 > 0 && pos.y - 3 < mazeWidth - 1 && grid[pos.x][pos.y - 3] === 1) {

                check.push('W');

            }

            if(	pos.y + 3 > 0 && pos.y + 3 < mazeWidth - 1 && grid[pos.x][pos.y + 3] === 1) {

                check.push('E');

            }


            if(check.length > 0) {

                let move = check[this.rnd.between(0, check.length - 1)];

                if(move !== previousDirection) {

                    corridors.push(new Corridor());
                    corridors[corridors.length - 1].data.push([pos.x, pos.y]);

                }

                previousDirection = move;

                switch(move) {

                    case 'N':
                        grid[pos.x - 2][pos.y] = 0;
                        grid[pos.x - 1][pos.y] = 0;

                        if(grid[pos.x][pos.y - 1] === 1) grid[pos.x][pos.y - 1] = 2;
                        grid[pos.x - 1][pos.y - 1] = 2;
                        grid[pos.x - 2][pos.y - 1] = 2;

                        corridors[corridors.length - 1].data.push([pos.x - 1, pos.y]);
                        corridors[corridors.length - 1].data.push([pos.x - 2, pos.y]);

                        corridors[corridors.length - 1].direction = "n";

                        pos.x -= 2;
                        break;

                    case 'S':

                        grid[pos.x + 2][pos.y] = 0;
                        grid[pos.x + 1][pos.y] = 0;

                        if(grid[pos.x][pos.y - 1] === 1) grid[pos.x][pos.y - 1] = 2;  // if this tile is not path!
                        grid[pos.x + 1][pos.y - 1] = 2;
                        grid[pos.x + 2][pos.y - 1] = 2;


                        corridors[corridors.length - 1].data.push([pos.x + 1, pos.y]);
                        corridors[corridors.length - 1].data.push([pos.x + 2, pos.y]);

                        corridors[corridors.length - 1].direction = "s";

                        pos.x += 2;
                        break;

                    case 'W':
                        grid[pos.x][pos.y - 3] = 0;
                        grid[pos.x][pos.y - 2] = 0;
                        grid[pos.x][pos.y - 1] = 0;

                        grid[pos.x][pos.y - 4] = 2;

                        corridors[corridors.length - 1].data.push([pos.x, pos.y - 1]);
                        corridors[corridors.length - 1].data.push([pos.x, pos.y - 2]);
                        corridors[corridors.length - 1].data.push([pos.x, pos.y - 3]);

                        corridors[corridors.length - 1].direction = "w";

                        pos.y -= 3;
                        break;

                    case 'E':
                        grid[pos.x][pos.y + 3] = 0;
                        grid[pos.x][pos.y + 2] = 0;
                        grid[pos.x][pos.y + 1] = 0;

                        // if this tile is not path!
                        if(grid[pos.x][pos.y - 1] === 1) {

                        	grid[pos.x][pos.y - 1] = 2;

                        }

                        corridors[corridors.length - 1].data.push([pos.x, pos.y + 1]);
                        corridors[corridors.length - 1].data.push([pos.x, pos.y + 2]);
                        corridors[corridors.length - 1].data.push([pos.x, pos.y + 3]);

                        corridors[corridors.length - 1].direction = "e";

                        pos.y += 3;
                        break;

                }

                moves.push(pos.y + pos.x * mazeWidth);


            } else {

                let back = moves.pop();

                deadEnds.push([pos.x, pos.y + 1]); // the reason I add 1 is because I'm going to add a top row
				// I'm sure there are way more elegant ways of doing this
				// but I'm tired and I just want to have the game ready
				// I'll review this all, optimize and that later when I have the time

                pos.x = Math.floor(back/mazeWidth);
                pos.y = back % mazeWidth;

            }

        }

		//console.log(corridors[11]);
        //throw "e";


        for(let i = 0; i < corridors.length; i++) {

        	corridors[i].extrapolate();
        	corridors[i].shiftData(0, 1);

        }

        for(let i = 0; i < mazeHeight; i++) {

            grid[i].unshift(1);

        }

        return {
            width: mazeWidth+1,
            height: mazeHeight,
            corridors,
			deadEnds,
            grid
        };

    }

    /**
	 *
     * @param array
     */
    findFurthestTile(array) {

    	let l = array.length;
    	let sum = 0;
    	let index = 0;


    	for( let i = 0; i < l; i++) {

    		let s = array[i][0] + array[i][1];

    		if(s > sum) {

    			sum = s;
    			index = i;

			}

		}

		return index;


	}

    /**
     * Bitmasks given tile, and returns tile number to use
     *
     * @param  {Object[][]} grid
     * @param  {Object[]} cell
     */
    bitmaskCeilings (grid, cell) {

        let gridWidth = grid.length - 1;
        let gridHeight = grid[0].length - 1;

        let cellValue = 0;

        let left, right, up, down = 0;

        if(cell[0] > 0) {

            if(grid[cell[0] - 1][cell[1]] === 1) {

                cellValue = 1;

            } else {

                cellValue = 0;

            }

            left = cellValue * 2;

        } else {

            left = 0;

        }

        if(cell[0] < gridWidth) {

            if(grid[cell[0] + 1][cell[1]] === 1) {

                cellValue = 1;

            } else {

                cellValue = 0;

            }

            right = cellValue * 4;

        } else {

            right = 0;

        }

        if(cell[1] > 0) {

            if(grid[cell[0]][cell[1] - 1] === 1) {

                cellValue = 1;

            } else {

                cellValue = 0;

            }

            up = cellValue * 1;

        } else {

            up = 0;

        }

        if(cell[1] < gridHeight) {

            if(grid[cell[0]][cell[1] + 1] === 1) {

                cellValue = 1;

            } else {

                cellValue = 0;

            }

            down = cellValue * 8;

        } else {

            down = 0;

        }

        return left + right + up + down;

    }

    getWallFrame(grid, cell) {

    	let frame = -1;

        // if the cell at the right is a ceiling
    	if(grid[cell[0] - 1][cell[1]] === 1 || grid[cell[0] + 1][cell[1]] === 1) {

    		return 21;

		} else if(grid[cell[0] - 1][cell[1]] === 0 && grid[cell[0] + 1][cell[1]] === 0) {

    		return 23;

		} else if(grid[cell[0] - 1][cell[1]] === 0) {

            return 20;

        } else if(grid[cell[0] + 1][cell[1]] === 0) {

            return 22;

        } else if(grid[cell[0] - 1][cell[1]] === 2 || grid[cell[0] + 1][cell[1]] === 2) {

            return 21;

        } else {

    		console.warn("No Wall Frame found!" + cell);
			//return frame;

		}

	}

	generateRoom(grid, y, x, h, w) {

		let maxWidth = grid[0].length;
		let maxHeight = grid.length;

		// check if x + w doesn't go out of map
		if(y + h < maxHeight && x + w < maxWidth) {

			for(let yy = y; yy < y + h; yy++) {

				for(let xx = x; xx < x + w; xx++) {

					grid[yy][xx] = 0;

				}

			}

		} else {

			console.warn(`Room not generated at x:${y}, y:${x}, w:${h}, h:${w}!`);

		}

	}
	
	/**
	 * 
	 *  A* pathfinding as seen in http://buildnewgames.com/astar/
	 * 
	 * @param  {Object[][]} grid
	 * @param  {Object[]} pathStart
	 * @param  {Object[]} pathEnd
	 */
	findPath(grid, pathStart, pathEnd) {

		// shortcuts for speed
		const abs = Math.abs;
		const max = Math.max;
		const pow = Math.pow;
		const sqrt = Math.sqrt;

		// the world data are integers:
		// anything higher than this number is considered blocked
		// this is handy is you use numbered sprites, more than one
		// of which is walkable road, grass, mud, etc
		const maxWalkableTileNum = 0;

		// keep track of the world dimensions
		// Note that this A-star implementation expects the world array to be square: 
		// it must have equal height and width. If your game world is rectangular, 
		// just fill the array with dummy values to pad the empty space.

		// makes a copy of the world
		let world = [];
		for(let i = 0; i < grid.length; i++) {

			world[i] = grid[i].slice();

		}

		// if it is vertical, add more horizontal
		if(world.length < world[0].length) {

			let h = world[0].length - world.length;

			for(let i = 0; i < h; i++) {
				
				console.log(1);

				let a = [];

				for(let j = 0; j < world[0].length; j++) {

					a.push(1);

				}

				world.push(a);

			}

		// else, if it is an horizontal world
		} else if (world[0].length < world.length) {

			let h = world.length - world[0].length;

			for(let i = 0; i < world.length; i++) {
				
				for(let j = 0; j < h; j++) {

					world[i].push(1);

				}

			}

		}

		const worldWidth = world[0].length;
		const worldHeight = world.length;
		const worldSize = worldWidth * worldHeight;

		// which heuristic should we use?
		// default: no diagonals (Manhattan)
		const distanceFunction = ManhattanDistance;
		const findNeighbours = function(){}; // empty

		/*

		// alternate heuristics, depending on your game:

		// diagonals allowed but no sqeezing through cracks:
		var distanceFunction = DiagonalDistance;
		var findNeighbours = DiagonalNeighbours;

		// diagonals and squeezing through cracks allowed:
		var distanceFunction = DiagonalDistance;
		var findNeighbours = DiagonalNeighboursFree;

		// euclidean but no squeezing through cracks:
		var distanceFunction = EuclideanDistance;
		var findNeighbours = DiagonalNeighbours;

		// euclidean and squeezing through cracks allowed:
		var distanceFunction = EuclideanDistance;
		var findNeighbours = DiagonalNeighboursFree;

		*/

		// distanceFunction functions
		// these return how far away a point is to another

		function ManhattanDistance(Point, Goal)
		{	// linear movement - no diagonals - just cardinal directions (NSEW)
			return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
		}

		function DiagonalDistance(Point, Goal)
		{	// diagonal movement - assumes diag dist is 1, same as cardinals
			return max(abs(Point.x - Goal.x), abs(Point.y - Goal.y));
		}

		function EuclideanDistance(Point, Goal)
		{	// diagonals are considered a little farther than cardinal directions
			// diagonal movement using Euclide (AC = sqrt(AB^2 + BC^2))
			// where AB = x2 - x1 and BC = y2 - y1 and AC will be [x3, y3]
			return sqrt(pow(Point.x - Goal.x, 2) + pow(Point.y - Goal.y, 2));
		}

		// Neighbours functions, used by findNeighbours function
		// to locate adjacent available cells that aren't blocked

		// Returns every available North, South, East or West
		// cell that is empty. No diagonals,
		// unless distanceFunction function is not Manhattan
		function Neighbours(x, y)
		{
			let	N = y - 1,
			S = y + 1,
			E = x + 1,
			W = x - 1,
			myN = N > -1 && canWalkHere(x, N),
			myS = S < worldHeight && canWalkHere(x, S),
			myE = E < worldWidth && canWalkHere(E, y),
			myW = W > -1 && canWalkHere(W, y),
			result = [];
			if(myN)
			result.push({x:x, y:N});
			if(myE)
			result.push({x:E, y:y});
			if(myS)
			result.push({x:x, y:S});
			if(myW)
			result.push({x:W, y:y});
			findNeighbours(myN, myS, myE, myW, N, S, E, W, result);
			return result;
		}

		// returns every available North East, South East,
		// South West or North West cell - no squeezing through
		// "cracks" between two diagonals
		function DiagonalNeighbours(myN, myS, myE, myW, N, S, E, W, result)
		{
			if(myN)
			{
				if(myE && canWalkHere(E, N))
				result.push({x:E, y:N});
				if(myW && canWalkHere(W, N))
				result.push({x:W, y:N});
			}
			if(myS)
			{
				if(myE && canWalkHere(E, S))
				result.push({x:E, y:S});
				if(myW && canWalkHere(W, S))
				result.push({x:W, y:S});
			}
		}

		// returns every available North East, South East,
		// South West or North West cell including the times that
		// you would be squeezing through a "crack"
		function DiagonalNeighboursFree(myN, myS, myE, myW, N, S, E, W, result)
		{
			myN = N > -1;
			myS = S < worldHeight;
			myE = E < worldWidth;
			myW = W > -1;
			if(myE)
			{
				if(myN && canWalkHere(E, N))
				result.push({x:E, y:N});
				if(myS && canWalkHere(E, S))
				result.push({x:E, y:S});
			}
			if(myW)
			{
				if(myN && canWalkHere(W, N))
				result.push({x:W, y:N});
				if(myS && canWalkHere(W, S))
				result.push({x:W, y:S});
			}
		}

		// returns boolean value (world cell is available and open)
		function canWalkHere(x, y)
		{
			return ((world[x] != null) &&
				(world[x][y] != null) &&
				(world[x][y] <= maxWalkableTileNum));
        }
        // Node function, returns a new object with Node properties
		// Used in the calculatePath function to store route costs, etc.
		function Node(Parent, Point)
		{
            return {  // returns a node
				// pointer to another Node object
				Parent:Parent,
				// array index of this Node in the world linear array
				value:Point.x + (Point.y * worldWidth),
				// the location coordinates of this Node
				x:Point.x,
				y:Point.y,
				// the heuristic estimated cost
				// of an entire path using this node
				f:0,
				// the distanceFunction cost to get
				// from the starting point to this node
				g:0
			};
		}

		// Path function, executes AStar algorithm operations
		function calculatePath()
		{
			// create Nodes from the Start and End x,y coordinates
			let	mypathStart = Node(null, {x:pathStart[0], y:pathStart[1]});
            let mypathEnd = Node(null, {x:pathEnd[0], y:pathEnd[1]});
			// create an array that will contain all world cells
            let AStar = new Array(worldSize);
			// list of currently open Nodes
            let Open = [mypathStart];
			// list of closed Nodes
            let Closed = [];
			// list of the final output array
            let result = [];
			// reference to a Node (that is nearby)
            let myNeighbours;
			// reference to a Node (that we are considering now)
            let myNode;
			// reference to a Node (that starts a path in question)
            let myPath;
			// temp integer variables used in the calculations
            let length, max, min, i, j;
			// iterate through the open list until none are left
			while(length = Open.length)
			{
				max = worldSize;
				min = -1;
				for(i = 0; i < length; i++)
				{
					if(Open[i].f < max)
					{
						max = Open[i].f;
						min = i;
					}
				}
				// grab the next node and remove it from Open array
				myNode = Open.splice(min, 1)[0];
				// is it the destination node?
				if(myNode.value === mypathEnd.value)
				{
					myPath = Closed[Closed.push(myNode) - 1];
					do
					{
						result.push([myPath.x, myPath.y]);
					}
					while (myPath = myPath.Parent);
					// clear the working arrays
					AStar = Closed = Open = [];
					// we want to return start to finish
					result.reverse();
				}
				else // not the destination
				{
					// find which nearby nodes are walkable
					myNeighbours = Neighbours(myNode.x, myNode.y);
					// test each one that hasn't been tried already
					for(i = 0, j = myNeighbours.length; i < j; i++)
					{
						myPath = Node(myNode, myNeighbours[i]);
						if (!AStar[myPath.value])
						{
							// estimated cost of this particular route so far
							myPath.g = myNode.g + distanceFunction(myNeighbours[i], myNode);
							// estimated cost of entire guessed route to the destination
							myPath.f = myPath.g + distanceFunction(myNeighbours[i], mypathEnd);
							// remember this new path for testing above
							Open.push(myPath);
							// mark this node in the world graph as visited
							AStar[myPath.value] = true;
						}
					}
					// remember this route as having no more untested options
					Closed.push(myNode);
				}
			} // keep iterating until the Open list is empty
			return result;
		}

		// actually calculate the a-star path!
		// this returns an array of coordinates
		// that is empty if no path is possible
		return calculatePath();

	} // end of findPath() function

	// https://github.com/kchapelier/von-neumann/blob/master/index.js
    static vonNeumannNeighborhood(range, dimensions) {

        range = range || 1;
        dimensions = dimensions || 2;

        let size = range * 2 + 1,
            iterations = Math.pow(size, dimensions),
            center = (iterations - 1) / 2,
            neighbors = [[0,0]];

        for (let i = 0; i < iterations; i++) {
            if (i !== center) {
                let neighbor = new Array(dimensions),
                    distance = 0,
                    remaining = i;

                for (let d = 0; d < dimensions; d++) {
                    let remainder = remaining % Math.pow(size, d + 1),
                        value = remainder / Math.pow(size, d) - range;

                    neighbor[d] = value;
                    distance += Math.abs(value);
                    remaining -= remainder;
                }

                if (distance <= range) {
                    neighbors.push(neighbor);
                }
            }
        }

        return neighbors;
    }

}