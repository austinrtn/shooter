import * as Controller from "./controller.js";
import * as Collision from "./quadtree/classicCollisionDetection.js"
import * as Util from "./utils/utils.js";
import * as Render from "./render.js";
import QuadTreeProcessor from "./quadtree/QuadTreeProcessor.js";
const middleground = document.getElementById("middleground");

let isLooping = true;
let loggingFps = false;
let timePassed = 0;
let totalElapsed = 0;
let lastTimestamp = 0;
let fps = 0;
let updateFunc = null;

let allItems = [];

const COLLISION_TYPES = Object.freeze({
    CLASSIC: Symbol("classic"),
    QUADTREE: Symbol("quadtree"),
});
let collisionType = COLLISION_TYPES.CLASSIC; //quadtree, classic
let qtp = null;
let showBoxes = false;
let autoDelete = false;

export function start(collisionShape, init){
    if(collisionShape == COLLISION_TYPES.CLASSIC){
        qtp =  new QuadTreeProcessor(middleground.width, middleground.height, 4, collisionShape);
        qtp.showBoxes = showBoxes;
    }

    if(init) init();
    window.requestAnimationFrame(gameLoop);
}

export function getTimeElasped(){
    return timePassed;
}

export function getAllItems(){
    return allItems;
}

export function update(func){
    updateFunc = func
}

function gameLoop(timeStamp){
    if(isLooping){  
        totalElapsed += timeStamp
        timePassed = (timeStamp - lastTimestamp);
        fps = Math.round(1/timePassed);
        if(loggingFps) console.log(fps);

        if(updateFunc) updateFunc();
        if(autoDelete) for(let i = 0; i < allItems.length; i++) if(allItems[i].markForDeletion) removeItems(allItems[i])

        Controller.update();
        if(collisionType == COLLISION_TYPES.QUADTREE) qtp.update();
        else if(collisionType == COLLISION_TYPES.CLASSIC) Collision.update();
        
        Render.update();

        lastTimestamp = timeStamp;
        document.getElementById("framerate").innerHTML = "Framerate: " + fps;
    }
    window.requestAnimationFrame(gameLoop);
}

export function createItems(...items){
    if(!items || !items[0]) return;
    if(items[0].length > 1) items = items[0];
    
    for(var item of items){
        let renderLayer;
        if(item.renderLayer) renderLayer = item.renderLayer;
        else renderLayer = "middleground";

        allItems.push(item)
        Render.addToLayer(renderLayer, item);
        if(collisionType == COLLISION_TYPES.QUADTREE) qtp.addItem(item);
        else if(collisionType == COLLISION_TYPES.CLASSIC && item.collidable) Collision.addItem(item);

        if(item.controllable) Controller.addToController(item);
    }
}

export function removeItems(...items) {
    for(var item of items){
        allItems = allItems.filter(removeItem => removeItem != item);
        Render.removeFromLayer(item)
        if(collisionType == COLLISION_TYPES.QUADTREE) qtp.removeItem(item);
        else if(collisionType == COLLISION_TYPES.CLASSIC) Collision.removeItem(item);

        if(item.controllable) Controller.removeFromController(item);
    }
}

window.loop = ()=> {
    if(isLooping){
        isLooping = false;
        console.log("paused");
    }
    else{
        isLooping = true;
        console.log("Resuming");
    }
}

window.logFps = ()=> {
    if(loggingFps) loggingFps = false;
    else loggingFps = true;
}

let mousedown = false;
let selectedItem = null;

function getItemByPos(pos){
    for(let item of allItems){
        let found = Util.containsPointInSquare(item, pos);
        if(found) {
            selectedItem = item;
            break; 
        }
    }
}

document.body.addEventListener('mouseup', function(e) {
    let pos = Util.getCursorPosition(middleground, e);

    mousedown = false;
    selectedItem = null;
});

document.body.addEventListener('mousemove', function(e) {
    let pos = Util.getCursorPosition(middleground, e);

    if(selectedItem && mousedown == true && selectedItem.mousedown) selectedItem.mousedown(pos);
});

document.body.addEventListener('mousedown', (e)=>{
    let pos = Util.getCursorPosition(middleground, e);

    getItemByPos(pos);
    mousedown = true;
});

document.body.addEventListener("keyup", function (e) {  
    if(e.keyCode == 80) loop();
    if(e.keyCode == 70) logFps();
    
});

start();