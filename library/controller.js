let items = [];
let controllerItems = [];
let clickedItems = [];
let keys = [];

export function addToController(item){
    controllerItems.push(item);
}

export function removeFromController(item){
    controllerItems = controllerItems.filter(removedItem => removedItem != item);
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return {x:x, y:y};
}

export function update(){
    if(mouseDown) onMouseDrag();
    for (const item of controllerItems) {
        item.controller(keys);
    }
}

export function getKeys(){
    return keys;
}

let mouseDown = false;
let mousePos = {x:null, y:null};

function setClickedItems(){
    clickedItems = [];
    for(var item of items){
        if(mousePos.x > item.x && mousePos.x < item.x + item.width &&
            mousePos.y > item.y && mousePos.y < item.y + item.height) clickedItems.push(item);
    }
}

function onMouseDrag(){
    let item = clickedItems[0];
    if(!item || !item.dragable) return;

    item.isBeingDragged = true;
    item.onDrag(mousePos.x,mousePos.y)
}

document.body.addEventListener('mousedown', function(e) {
    setClickedItems()
    mousePos = getCursorPosition(middleground, e);
    mouseDown = true;
})

document.body.addEventListener('mouseup', function(e) {
    mouseDown = false;
    if(clickedItems[0]) clickedItems[0].isBeingDragged = false;
})

document.body.addEventListener("mousemove", function (e) {
    mousePos = getCursorPosition(middleground, e);
});

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
  
});

document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
 
  });