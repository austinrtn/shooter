export function getDistance(point1,point2){
    let a = (point1.x - point2.x);
    let b = (point1.y - point2.y);
    let c = Math.sqrt(a*a + b*b);

    return {
        x: a,
        y: b, 
        total: c
    };
}

export function getDiagnalVelocity(point1, point2, velocity){
    let dist = getDistance(point1, point2);
    let xForce = dist.x / dist.total;
    let yForce = dist.y / dist.total;

    return {
        x: -(velocity * xForce), 
        y: -(velocity * yForce)
    }
}

export function removeFromArray(item, arrObj){
    arrObj.arr = arrObj.arr.filter(removeItem => removeItem !== item);
    return arrObj.arr;
}

export function rand(int1, int2){
    return Math.floor(int1 + Math.random() * int2);
}

export function randNeg(int, chance){
    if(!chance) chance = 50;
    if(rand(0,99) < chance) int *= -1;
    return int;
} 

export function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return {x:x, y:y};
}

export function containsPointInSquare(obj, point){
    return (
        point.x >= obj.x &&
        point.x < obj.x + obj.width &&
        point.y >= obj.y &&
        point.y < obj.y + obj.height
    );
}

export function squareIntersects(obj1, obj2){
    return !(
        obj1.x > obj2.x + obj2.width ||
        obj1.x + obj1.width < obj2.x ||
        obj1.y > obj2.y + obj2.height || 
        obj1.y + obj1.height < obj2.y
    );
}

export function containsPointInCircle(obj, point){
    let d = Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2);
    return d <= (this.r * this.r);
}

export function circleIntersects(obj1, obj2){
    let dist = getDistance(obj1, obj2);
    let radii = obj1.r + obj2.r;
    return Math.pow(radii,2) >= dist;
}