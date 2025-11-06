export class ShootButton {
    constructor(x, y, ctx){
        this.x = x;
        this.y = y;
        this.ctx = ctx;

        this.color = "red";
        this.width = 150;
        this.height = 90;
        this.radius = 20; //Für die Ecken

        this.isPressed = false;
        this.fireRate = 400; //ms per Schuss
        this.lastShot = 0;

        const canvas = ctx.canvas;

        const startPress = () => {this.isPressed = true;};
        const endPress = () => {this.isPressed = false;};

        canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            this.isPressed = true;
        });
        canvas.addEventListener("touchend", () => this.isPressed = false);
    }

    canShoot(){
        const now = performance.now();
        if(this.isPressed && now - this.lastShot > this.fireRate){
            this.lastShot = now;
            return true;
        }
        return false;
    }

    draw(){
        //destructuring
        const {ctx, x, y, width, height, radius, color} = this;

        const left = x - width / 2;
        const top = y - height / 2;
        const right = x + width / 2;
        const bottom = y + height / 2;

        //Button
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