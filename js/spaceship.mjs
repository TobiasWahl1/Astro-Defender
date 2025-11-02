
export class Spaceship {

    constructor(x, y, ctx){
        this.x = x;
        this.y = y;
        this.ctx = ctx;

        this.angle = 0;
        this.size = 30;
        this.color = "blue";
    }

    //Fürs Movement später
    update(){}

    draw(){
        //destrcuturing
        const {ctx, x, y, size, angle, color} = this;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

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