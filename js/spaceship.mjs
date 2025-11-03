
export class Spaceship {

    constructor(x, y, ctx){
        this.x = x;
        this.y = y;
        this.ctx = ctx;

        this.angle = 0;
        this.size = 30;
        this.color = "blue";

        this.speed = 0; //jetzige Geschwindigkeit
        this.maxSpeed = 5; //Maximal Geschwindigkeit
        this.accel = 0.3; //Speed up
        this.decel = 0.15; //Speed down
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

            //Wie weit der Joystick bewegt ist
            const distance = Math.sqrt(joystick.dx * joystick.dx + joystick.dy * joystick.dy);
            const normalizedDistance = Math.min(distance, 1);
            const targetSpeed = normalizedDistance * this.maxSpeed;

            if(this.speed < targetSpeed) this.speed += this.accel;
            else if(this.speed > targetSpeed) this.speed -= this.decel;
            
        } else {
            //Langsames Abbremsen wenn Joystick nicht bewegt
            this.speed *= 0,95;
        }
        //Bewegt Schiff
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
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
}