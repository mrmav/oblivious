const Corridor = function () {

    /*
     *  Contains the cell coordinates of this corridor
     */
    this.data = [];

    /*
     *  Specifies in which direction the corridor expands
     */
    this.direction = "";

};
/*
 * Adds a cell to the beginning and to the end of this corridor data;
 */
Corridor.prototype.extrapolate = function() {

    let deviationX = this.data[0][0] - this.data[1][0];
    let deviationY = this.data[0][1] - this.data[1][1];

    if(this.data[0][0] !== this.data[1][0]) {

        this.data.unshift([this.data[0][0] + deviationX, this.data[0][1]]);
        this.data.push([this.data[this.data.length-1][0] + deviationX * -1, this.data[this.data.length-1][1]]);

        return;

    }

    if(this.data[0][1] !== this.data[1][1]) {

        this.data.unshift([this.data[0][0], this.data[0][1] + deviationY]);
        this.data.push([this.data[this.data.length-1][0], this.data[this.data.length-1][1] + deviationY * -1]);

    }


};

Corridor.prototype.shiftData = function(x = 0, y = 0) {

    for(let i = 0; i < this.data.length; i++) {

        this.data[i][0] += x;
        this.data[i][1] += y;

    }

}