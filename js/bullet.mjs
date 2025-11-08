export class Bullet {
    constructor(x, y, angle, ctx){
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.angle = angle;

        this.speed = 600; // pixels per second (was 10 px/frame * 60fps)
        this.lenght = 12;
        this.color = "red";
        this.active = true;
    }

    update(dt = 1/60){
        this.x += Math.cos(this.angle) * this.speed * dt;
        this.y += Math.sin(this.angle) * this.speed * dt;

        //Wenn out of Bounds
        if(this.x < 0 || this.x > this.ctx.canvas.width || this.y < 0 || this.y > this.ctx.canvas.height){
            this.active = false;
        }
    }

    draw(){
        //destructuring
        const {ctx, x, y, angle, lenght, color} = this;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * lenght, y + Math.sin(angle) * lenght);
        ctx.stroke();
        ctx.restore();
    }

    get radius(){
        return this.lenght / 2;
    }
}