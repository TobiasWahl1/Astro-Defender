export class Asteroid {

    constructor(x, y, ctx){
        this.x = x;
        this.y = y;
        this.ctx = ctx;

        this.angle = 0;
        this.size = 50;
        this.color = "gray";
    }

    //Fürs Movement später
    update(){}

    draw(){
        //destrcuturing
        const {ctx, x, y, size, angle, color} = this;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);


        //Hexagon zeichnen
        // Die Konstante h ist der horizontale Abstand zur Kante (R * cos(30°))
        const h = size * Math.sqrt(3) / 2; 
        ctx.beginPath();
        ctx.moveTo(0, -size); 
        ctx.lineTo(h, -size / 2); 
        ctx.lineTo(h, size / 2);  
        ctx.lineTo(0, size);     
        ctx.lineTo(-h, size / 2); 
        ctx.lineTo(-h, -size / 2); 
        ctx.closePath();

        ctx.fillStyle = color;
        ctx.fill();

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }
}