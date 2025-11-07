import { wrapPosition } from "./canvasUtils.mjs";

export class Spaceship {

    constructor(x, y, ctx){
        this.x = x;
        this.y = y;
        this.ctx = ctx;

        this.angle = 0;
        this.size = 30;
        this.color = "blue";

        this.vx = 0; // Velocity X component
        this.vy = 0; // Velocity Y component
        this.maxSpeed = 2; //Maximal Geschwindigkeit
        this.thrustPower = 0.15; //Acceleration per frame
        this.friction = 0.99; //Friction to slow down


        this.shields = 3;
    }

    //Fürs Movement später
    update(joystick) {
        //Joystick ist Touched
        if(joystick.dx !== 0 || joystick.dy !== 0){
            
            //berechnung des Joystick Winkels
            const targetAngle = Math.atan2(joystick.dy, joystick.dx);

            //Funktion für kürzesten Winkel
            function shortestAngleDiff(target, current) {
                let diff = target - current;
                while (diff < -Math.PI) diff += Math.PI * 2;
                while (diff > Math.PI) diff-= Math.PI * 2;
                return diff;
            }

            //Smoothe Rotation zum Zielwinkel
            const diff = shortestAngleDiff(targetAngle, this.angle);
            this.angle += diff * 0.15; // Kleiner ist smoother

            // Apply thrust in the direction ship is facing
            this.vx += Math.cos(this.angle) * this.thrustPower;
            this.vy += Math.sin(this.angle) * this.thrustPower;
        }
        
        // Apply friction
        this.vx *= this.friction;
        this.vy *= this.friction;
        
        // Limit speed
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if(speed > this.maxSpeed){
            this.vx = (this.vx / speed) * this.maxSpeed;
            this.vy = (this.vy / speed) * this.maxSpeed;
        }
        
        // Update position based on velocity
        this.x += this.vx;
        this.y += this.vy;

        wrapPosition(this, this.ctx.canvas);
    }

    draw() {
        //destrcuturing
        const {ctx, x, y, size, angle, color} = this;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI / 2); //Math.PI / 2 damit Spitze navh oben zeigt

        //Dreieck fürs Raumschiff
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size / 2, size / 2);
        ctx.lineTo(-size / 2, size / 2);
        ctx.closePath();
        
        ctx.fillStyle = color;
        ctx.fill();

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    get radius(){
        return this.size / 1.5;
    }

    // Return triangle vertices in world space for collision detection
    getVertices(){
        const {x, y, size, angle} = this;
        
        // Triangle points in local space (same as draw method)
        // Rotated by angle + Math.PI / 2 to match drawing
        const a = angle + Math.PI / 2;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        
        // Top vertex (nose)
        const v1 = {
            x: x + (0 * cos - (-size) * sin),
            y: y + (0 * sin + (-size) * cos)
        };
        
        // Bottom right vertex
        const v2 = {
            x: x + ((size / 2) * cos - (size / 2) * sin),
            y: y + ((size / 2) * sin + (size / 2) * cos)
        };
        
        // Bottom left vertex
        const v3 = {
            x: x + ((-size / 2) * cos - (size / 2) * sin),
            y: y + ((-size / 2) * sin + (size / 2) * cos)
        };
        
        return [v1, v2, v3];
    }
}