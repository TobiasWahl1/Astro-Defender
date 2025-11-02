export class Joystick {
    
    constructor(x, y, cxt){
        this.x = x;
        this.y = y;
        this.ctx = cxt;

        this.outerRadius = 75;
        this.innerRadius = 25;
        this.color = "gray"
    }
    
    draw(){
        //destrcuturing
        const {ctx, x, y, outerRadius, innerRadius, color} = this;

        const c = this.ctx.canvas;
        const End_Angle = Math.PI * 2;

        this.ctx.clearRect(0, 0, c.width, c.height);

        //Äußere Kreis
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, outerRadius, 0, End_Angle, true);
        ctx.fill();

        //Innerer Kreis
        ctx.fillStyle = "dark" + color;
        ctx.beginPath();
        ctx.arc(x, y, innerRadius, 0, End_Angle, true);
        ctx.fill();


    }

}