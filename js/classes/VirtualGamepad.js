/**
 *
 * Based on the works of Eugenio Fage and Shawn Hymel
 * It is basically the structure of Shawn's, but made not a plugin
 * and better suited for what I needed.
 * Thank you both!
 *
 * @license     {@link http://opensource.org/licenses/MIT}
 *
 * https://github.com/Gamegur-us/phaser-touch-control-plugin
 * https://github.com/ShawnHymel/phaser-plugin-virtual-gamepad/blob/master/js/phaser-plugin-virtual-gamepad.js
 *
 */
const VirtualGamepad = function (game, x, y, x1, y1, r = 100, size = 60) {

    this.game = game;

    this.basePoint = new Phaser.Point(x, y);
    this.pointer = null;
    this.maxRadius = r;

    this.properties = {

        inUse: false,
        x: 0,
        y: 0,
        deltaX: 0,
        deltaY: 0,
        distance: 0,
        angle: 0

    };

    this.fixedPad = this.game.add.image(this.basePoint.x, this.basePoint.y, "gamepad", "fixedPad");
    this.movePad = this.game.add.image(this.basePoint.x, this.basePoint.y, "gamepad", "movingPad");
    this.fixedPad.anchor.set(0.5);
    this.fixedPad.alpha = 0.4;
    this.fixedPad.fixedToCamera = true;
    this.movePad.anchor.set(0.5);
    this.movePad.alpha = 0.4;
    this.movePad.fixedToCamera = true;


    this.buttonBasePoint = new Phaser.Point(x1, y1);
    this.button = this.game.add.image(this.buttonBasePoint.x, this.buttonBasePoint.y, "gamepad", "button");
    this.button.inUse = false;
    // this.buttonFill = this.game.add.image(this.buttonBasePoint.x, this.buttonBasePoint.y, bmd2);
    this.button.fixedToCamera = true;
    this.button.alpha = 0.4;
    this.button.anchor.set(0.5);
    // this.buttonFill.fixedToCamera = true;
    // this.buttonFill.alpha = 0.8;
    // this.buttonFill.anchor.set(0.5);

};

VirtualGamepad.prototype = {

    destroy: function() {
        "use strict";

        this.fixedPad.kill();
        this.movePad.kill();
        this.button.kill();

    },

    update: function() {

        let reset = true;

        //button
        this.button.isDown = false;
        this.button.alpha = 0.4;

        this.game.input.pointers.forEach(p => {

            reset = this.testDistance(p);

        });

        reset = this.testDistance(this.game.input.mousePointer);

        if(reset) {

            if ((this.pointer === null) || (this.pointer.isUp)) {

                this.displace(this.basePoint, this);
                this.properties.inUse = false;
                this.pointer = null;

                this.fixedPad.alpha = 0.4;
                this.movePad.alpha = 0.4;


            }

        }

    },

    testDistance: function(p) {

            let reset = true;
            let distance = this.basePoint.distance(p.position);

            if(p.isDown && (p === this.pointer || distance < this.maxRadius)) {

                reset = false;
                this.inUse = true;
                this.pointer = p;

                this.displace(p.position);

            }

            // add code for buttons
            distance = this.buttonBasePoint.distance(p.position);
            if(p.isDown && distance < this.button.width) {

                this.button.isDown = true;
                this.button.alpha = 0.8;

            }

            return reset;

    },    

    displace: function(point) {

        // Calculate x/y of pointer from joystick center
        let deltaX = point.x - this.basePoint.x;
		let deltaY = point.y - this.basePoint.y;

        // Get the angle (radians) of the pointer on the joystick
        let rotation = this.basePoint.angle(point);

        // Set bounds on joystick pad
        if (this.basePoint.distance(point) > this.maxRadius) {
            
            deltaX = (deltaX === 0) ? 0 : Math.cos(rotation) * this.maxRadius;
            deltaY = (deltaY === 0) ? 0 : Math.sin(rotation) * this.maxRadius;

        }

        // Normalize x/y
        this.properties.x = parseInt((deltaX / this.maxRadius) * 100, 10);
		this.properties.y = parseInt((deltaY  / this.maxRadius) * 100, 10);

        // Store delta information
        this.properties.deltaX = deltaX / this.maxRadius;
        this.properties.deltaY = deltaY / this.maxRadius;

        // Move joystick pad images
        this.movePad.cameraOffset.x = this.basePoint.x + deltaX;
        this.movePad.cameraOffset.y = this.basePoint.y + deltaY;
        
        this.fixedPad.alpha = 0.8;
        this.movePad.alpha = 0.8;

    }

};