import { squareIntersects } from "../utils/utils.js";
let collisionType = "rectangle";
let collisionObjs = [];

export function addItem(item){
    if(item.shape == "line") return;
    collisionObjs.push(item);
}

export function removeItem(item){
    collisionObjs = collisionObjs.filter(removeObj => removeObj != item);
}

export function update(){
    if(!collisionType) throw "Set propper render type in 'collision_detection.js'";
    for(var i = 0; i < collisionObjs.length; i++){
            for(var j = 0; j < collisionObjs.length; j++){
            if(i == j) continue;
            
            let obj1 = collisionObjs[i];
            let obj2 = collisionObjs[j];
            
            let colCheck;
            if(collisionType == "rectangle") colCheck = squareIntersects(obj1, obj2);
            else if(collisionType == "circle") colCheck = circleCollisionCheck(obj1,obj2);
            
            if(colCheck) obj1.onCollision(obj2);
          
            if(obj1.collisions){
                let foundItem = obj1.collisions.find(item => item == obj2)
                if(colCheck && !foundItem) obj1.collisions.push(obj2);
                else if(!colCheck && foundItem) obj1.collisions = obj1.collisions.filter(item => item != obj2);
            }
        }
    }
}

function rectangleCollisionCheck(obj1, obj2){
    if(obj1.x + obj1.width > obj2.x &&
        obj1.x < obj2.x + obj2.width && 
        obj1.y + obj1.height > obj2.y &&
        obj1.y < obj2.y + obj2.height) return true;

    else return false;
}

function circleCollisionCheck(obj1,obj2){
    let a = obj1.x - obj2.x;
    let b = obj1.y - obj2.y;
    let c = Math.sqrt(a * a + b *b)

    let radii = obj1.r + obj2.r;
    return radii >= c;
}