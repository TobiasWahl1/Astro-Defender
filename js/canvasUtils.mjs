export function wrapPosition(obj, canvas, margin = 0){
    if (obj.x > canvas.width + margin) obj.x = -margin;
    if (obj.x < -margin) obj.x = canvas.width + margin;
    if (obj.y > canvas.height + margin) obj.y = -margin;
    if (obj.y < -margin) obj.y = canvas.height + margin;
}

// Responsive utilities for proper display on all devices
export const Responsive = {
    getScreenDimensions() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    },

    isDesktop() {
        const { width } = this.getScreenDimensions();
        return width >= 1440;
    },

    isMobile() {
        const { width } = this.getScreenDimensions();
        return width < 768;
    },

    isTablet() {
        const { width } = this.getScreenDimensions();
        return width >= 768 && width < 1440;
    },

    calculateCanvasDimensions() {
        const { width, height } = this.getScreenDimensions();
        
        if (this.isMobile()) {
            // Mobile: smaller canvas, portrait-friendly
            return {
                width: Math.min(width * 0.9, 600),
                height: Math.min(height * 0.5, 400)
            };
        } else if (this.isTablet()) {
            // Tablet: medium size
            return {
                width: Math.min(width * 0.7, 800),
                height: Math.min(height * 0.6, 600)
            };
        } else {
            // Desktop: full size
            return {
                width: 800,
                height: 600
            };
        }
    },

    calculateObjectSize(baseSize = 30) {
        const { width, height } = this.getScreenDimensions();
        const smallestDimension = Math.min(width, height);
        
        // Scale object size based on screen (but keep it reasonable)
        const sizeFactor = smallestDimension / 800;
        return Math.max(baseSize * sizeFactor, baseSize * 0.6); // Min 60%
    },

    calculateControlSize() {
        if (this.isMobile()) {
            return {
                joystickSize: 120,
                fireButtonWidth: 120,
                fireButtonHeight: 80
            };
        } else if (this.isTablet()) {
            return {
                joystickSize: 140,
                fireButtonWidth: 140,
                fireButtonHeight: 90
            };
        } else {
            return {
                joystickSize: 150,
                fireButtonWidth: 150,
                fireButtonHeight: 100
            };
        }
    },

    calculateMaxAsteroids() {
        const { width } = this.getScreenDimensions();
        if (width < 768) return 5;        // mobile - fewer asteroids
        if (width < 1440) return 6;       // tablet
        return 8;                         // desktop
    }
};

//Check ob bullet asteroid trifft
export function polygonCircleCollision(polygon, cx, cy, cr) {
    // Check distance from circle center to each edge
    for (let i = 0; i < polygon.length; i++) {
        const v1 = polygon[i];
        const v2 = polygon[(i + 1) % polygon.length];
        const dx = v2.x - v1.x;
        const dy = v2.y - v1.y;
        const lengthSq = dx * dx + dy * dy;
        const t = Math.max(0, Math.min(1, ((cx - v1.x) * dx + (cy - v1.y) * dy) / lengthSq));
        const nearestX = v1.x + t * dx;
        const nearestY = v1.y + t * dy;
        const distX = cx - nearestX;
        const distY = cy - nearestY;
        if (distX * distX + distY * distY < cr * cr) return true;
    }

    // Optional: check if circle center is inside polygon
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;
        const intersect = ((yi > cy) !== (yj > cy)) &&
            (cx < (xj - xi) * (cy - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}