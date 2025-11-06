import { TouchHandler } from "./touchHandler.mjs";

export class Joystick {
    constructor(x, y, ctx){
        this.x = x;
        this.y = y;
        this.ctx = ctx;

        this.outerRadius = 75;
        this.innerRadius = 25;
        this.color = "gray";

        this.touch = new TouchHandler(this.ctx.canvas);

        // Inner knob position
        this.innerX = this.x;
        this.innerY = this.y;

        // Movement vector for ship
        this.dx = 0;
        this.dy = 0;
    }
    
    update(){
        const {x, y, outerRadius, innerRadius} = this;
        const t = this.touch;

        if(t.active){
            const touchX = t.x;
            const touchY = t.y;

            const dx = touchX - x;
            const dy = touchY - y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const maxDist = outerRadius - innerRadius;
            if(dist > maxDist){
                const ratio = maxDist / dist;
                this.innerX = x + dx * ratio;
                this.innerY = y + dy * ratio;
            } else {
                this.innerX = touchX;
                this.innerY = touchY;
            }

            // Normalized vector (cap to [-1,1] range approximately)
            this.dx = dx / outerRadius;
            this.dy = dy / outerRadius;
        } else {
            this.innerX = x;
            this.innerY = y;
            this.dx = 0;
            this.dy = 0;
        }
    }

    draw(){
        const {ctx, x, y, outerRadius, innerRadius, color} = this;
        const c = this.ctx.canvas;
        const TWO_PI = Math.PI * 2;

        ctx.clearRect(0, 0, c.width, c.height);

        // Outer circle
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(x, y, outerRadius, 0, TWO_PI, true);
        ctx.fill();

        // Inner knob
        ctx.fillStyle = "dimgray";
        ctx.beginPath();
        ctx.arc(this.innerX, this.innerY, innerRadius, 0, TWO_PI, true);
        ctx.fill();

        ctx.globalAlpha = 1;
    }
}