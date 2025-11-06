import { TouchHandler } from "./touchHandler.mjs";

export class ShootButton {
    constructor(x, y, ctx){
        this.x = x;
        this.y = y;
        this.ctx = ctx;

        this.color = "red";
        this.width = 150;
        this.height = 100;
        this.radius = 20;

        this.isPressed = false;
        this.fireRate = 400; // ms per shot
        this.lastShot = 0;

        this.touch = new TouchHandler(this.ctx.canvas);
    }

    canShoot(){
        // Treat any touch on the fire canvas as a press
        this.isPressed = this.touch.active;
        const now = performance.now();
        if(this.isPressed && now - this.lastShot > this.fireRate){
            this.lastShot = now;
            return true;
        }
        return false;
    }

    draw(){
        const {ctx, x, y, width, height, radius, color} = this;

        const left = x - width / 2;
        const top = y - height / 2;
        const right = x + width / 2;
        const bottom = y + height / 2;

        // Clear the control canvas before drawing (full clear)
        const c = ctx.canvas;
        ctx.clearRect(0, 0, c.width, c.height);

        // Button
        ctx.beginPath();
        ctx.fillStyle = this.isPressed ? "darkred" : color;
        ctx.moveTo(left + radius, top);
        ctx.lineTo(right - radius, top);
        ctx.arcTo(right, top, right, top + radius, radius);
        ctx.lineTo(right, bottom - radius);
        ctx.arcTo(right, bottom, right - radius, bottom, radius);
        ctx.lineTo(left + radius, bottom);
        ctx.arcTo(left, bottom, left, bottom - radius, radius);
        ctx.lineTo(left, top + radius);
        ctx.arcTo(left, top, left + radius, top, radius);
        ctx.closePath();
        ctx.fill();
    }
}