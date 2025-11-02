export class TouchHandler{
    constructor(canvas){
        this.canvas = canvas;
        this.active = false;
        this.x = 0;
        this.y = 0;

        this.canvas.addEventListener("touchstart", this.start.bind(this));
        this.canvas.addEventListener("touchmove", this.move.bind(this));
        this.canvas.addEventListener("touchend", this.end.bind(this));
    }

    start(event){
        const touch = event.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.x = touch.clientX - rect.left;
        this.y = touch.clientY - rect.top;
        this.active = true;
    }

    move(event){
        if(!this.active) return;
        const touch = event.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.x = touch.clientX - rect.left;
        this.y = touch.clientY - rect.top;
    }

    end(){
        this.active = false;
    }
}