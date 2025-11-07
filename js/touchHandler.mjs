export class TouchHandler{
    constructor(canvas){
        this.canvas = canvas;
        this.active = false;
        this.x = 0;
        this.y = 0;
        this.touchId = null; // Track specific touch identifier

        this.canvas.addEventListener("touchstart", this.start.bind(this), {passive: false});
        this.canvas.addEventListener("touchmove", this.move.bind(this), {passive: false});
        this.canvas.addEventListener("touchend", this.end.bind(this), {passive: false});
        this.canvas.addEventListener("touchcancel", this.end.bind(this), {passive: false});
    }

    start(event){
        event.preventDefault();
        // Only capture if we don't already have a touch
        if(this.touchId !== null) return;

        // Finde ersten Touchpunkt
        const rect = this.canvas.getBoundingClientRect();
        for(let i = 0; i < event.changedTouches.length; i++){
            const touch = event.changedTouches[i];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            // Check ob Touch im Canvas ist
            if(x >= 0 && x <= this.canvas.width && y >= 0 && y <= this.canvas.height){
                this.touchId = touch.identifier;
                this.x = x;
                this.y = y;
                this.active = true;
                break;
            }
        }
    }

    move(event){
        if(!this.active || this.touchId === null) return;
        event.preventDefault();

        // Finde Spezifischen Touchpunkt
        for(let i = 0; i < event.changedTouches.length; i++){
            const touch = event.changedTouches[i];
            if(touch.identifier === this.touchId){
                const rect = this.canvas.getBoundingClientRect();
                this.x = touch.clientX - rect.left;
                this.y = touch.clientY - rect.top;
                break;
            }
        }
    }

    end(event){
        if(this.touchId === null) return;

        // Check ob Touchpunkt beendet ist
        for(let i = 0; i < event.changedTouches.length; i++){
            const touch = event.changedTouches[i];
            if(touch.identifier === this.touchId){
                this.active = false;
                this.touchId = null;
                break;
            }
        }
    }
}