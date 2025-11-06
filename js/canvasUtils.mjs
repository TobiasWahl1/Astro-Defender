export function wrapPosition(obj, canvas, margin = 0){
    if (obj.x > canvas.width + margin) obj.x = -margin;
    if (obj.x < -margin) obj.x = canvas.width + margin;
    if (obj.y > canvas.height + margin) obj.y = -margin;
    if (obj.y < -margin) obj.y = canvas.height + margin;
}

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