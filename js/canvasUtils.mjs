export function wrapPosition(obj, canvas, margin = 0){
    if (obj.x > canvas.width + margin) obj.x = -margin;
    if (obj.x < -margin) obj.x = canvas.width + margin;
    if (obj.y > canvas.height + margin) obj.y = -margin;
    if (obj.y < -margin) obj.y = canvas.height + margin;
}