import { TouchHandler } from "./touchHandler.mjs";

export class Joystick {
    
    constructor(x, y, cxt, cnv){
        this.x = x;
        this.y = y;
        this.ctx = cxt;
        this.cnv = cnv;

        this.outerRadius = 75;
        this.innerRadius = 25;
        this.color = "gray"

        this.touch = new TouchHandler(this.cnv);

        //Innerer Kreis Position
        this.innerX = this.x;
        this.innerY = this.y;

        //Movement Vektor (Fürs Schiff)
        this.dx = 0;
        this.dy = 0;
    }
    
    update(){
        const {x, y, outerRadius, innerRadius} = this;
        const t = this.touch;

        if(t.active){
            const touchX = t.x;
            const touchY = t.y;

            //Vector vom Zentrum zum Touchpunkt
            const dx = touchX - x;
            const dy = touchY - y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            //Limit für inneren Kreis
            const maxDist = outerRadius - innerRadius;
            if(dist > maxDist){
                const ratio = maxDist / dist;
                this.innerX = x + dx * ratio;
                this.innerY = y + dy * ratio;
            } else {
                this.innerX = touchX;
                this.innerY = touchY;
            }

            //Normalisierter Bewegungsvektor
            this.dx = dx / outerRadius;
            this.dy = dy / outerRadius;
        } else {
            //Zurücksetzen wenn nicht berührt
            this.innerX = x;
            this.innerY = y;
            this.dx = 0;
            this.dy = 0;
        }
    }

    draw(){
        //destrcuturing
        const {ctx, x, y, outerRadius, innerRadius, color} = this;

        const c = this.ctx.canvas;
        const End_Angle = Math.PI * 2;

        ctx.clearRect(0, 0, c.width, c.height);

        //Äußere Kreis
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, outerRadius, 0, End_Angle, true);
        ctx.fill();

        //Innerer Kreis
        ctx.fillStyle = "dimgray";
        ctx.beginPath();
        ctx.arc(this.innerX, this.innerY, innerRadius, 0, End_Angle, true);
        ctx.fill();
    }

}