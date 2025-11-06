export class Bullet {
    constructor(x, y, angle, ctx){
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.angle = angle;

        this.speed = 10;
        this.lenght = 12;
        this.color = "red";
        this.active = true;
    }

    update(){
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

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