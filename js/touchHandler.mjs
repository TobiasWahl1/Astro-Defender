export class TouchHandler{
    constructor(canvas){
        this.canvas = canvas;
        this.active = false;
        this.x = 0;
        this.y = 0;
        this.touchId = null;

        this.start = this.start.bind(this);
        this.move = this.move.bind(this);
        this.end = this.end.bind(this);

        // Use passive: false to allow preventDefault on iOS Safari
        this.canvas.addEventListener("touchstart", this.start, { passive: false });
        this.canvas.addEventListener("touchmove", this.move, { passive: false });
        this.canvas.addEventListener("touchend", this.end, { passive: false });
        this.canvas.addEventListener("touchcancel", this.end, { passive: false });
    }

    start(event){
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const touch = event.changedTouches[0];
        this.touchId = touch.identifier;
        this.x = touch.clientX - rect.left;
        this.y = touch.clientY - rect.top;
        this.active = true;
    }

    move(event){
        if(!this.active) return;
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        // Find the touch with our identifier
        let touch = null;
        for (const t of event.changedTouches) {
            if (t.identifier === this.touchId) { touch = t; break; }
        }
        if (!touch) return;
        this.x = touch.clientX - rect.left;
        this.y = touch.clientY - rect.top;
    }

    end(event){
        event.preventDefault();
        // Release only if our tracked touch ended/cancelled
        for (const t of event.changedTouches) {
            if (t.identifier === this.touchId) {
                this.active = false;
                this.touchId = null;
                break;
            }
        }
    }
}