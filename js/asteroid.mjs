import { wrapPosition } from "./canvasUtils.mjs";

export class Asteroid {

    constructor(canvasWidth, canvasHeight, ctx){
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.ctx = ctx;


        //Random Größen
        this.size = Math.random() * 40 +20; //Zwischen 20 und 60
        
        this.color = "gray";

        const side = Math.floor(Math.random()*4); // 0-3 für 4 Seiten
        switch(side){
            case 0: //top
                this.x = Math.random() * canvasWidth;
                this.y = -this.size;
                break;
            case 1: //bottom
                this.x = Math.random() * canvasWidth;
                this.y = canvasHeight + this.size;
                break;
            case 2: //left
                this.x = -this.size;
                this.y = Math.random() * canvasHeight;
                break;
            case 3: //right
                this.x = canvasWidth + this.size;
                this.y = Math.random() * canvasHeight;
                break;
        }

        //Richtung Zentrum mit etwas Variation
        const angleToCenter = Math.atan2(canvasHeight / 2 - this.y, canvasWidth / 2 - this.x);
        const randomOffset = (Math.random() - 0.5) * 0.5;
        const moveAngle = angleToCenter + randomOffset;
        const speed = Math.random() * 1.5 + 0.5;
        this.vx = Math.cos(moveAngle) * speed;
        this.vy = Math.sin(moveAngle) * speed;

        this.angle = Math.random() * Math.PI * 2; //Random Start Rotation
        this.rotationSpeed = (Math.random() - 0.5) * 0.02; //Kleine Rotation

    }

    //Fürs Movement später
    update(){
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.rotationSpeed;

        //Wrap Position auf dem Canvas
        wrapPosition(this, this.ctx.canvas, this.size);
    }

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

    get radius(){
        return this.size / 1.5;
    }

    //Für bessere Kollisionserkennung
    getVertices(){
        const verts = [];
        const h = this.size * Math.sqrt(3) / 2; 
        const local = [
            { x: 0, y: -this.size },
            { x: h, y: -this.size / 2 },
            { x: h, y: this.size / 2 },
            { x: 0, y: this.size },
            { x: -h, y: this.size / 2 },
            { x: -h, y: -this.size / 2 },
        ];

        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        for (const v of local) {
            const rx = v.x * cos - v.y * sin;
            const ry = v.x * sin + v.y * cos;
            verts.push({ x: this.x + rx, y: this.y + ry });
        }
        return verts;
    }
}