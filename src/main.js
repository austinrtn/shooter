import * as App from "../library/app.js";
import Cursor from "./Cursor.js";
import Player from "./Player.js";
import Enemy from "./Enemy.js"
import {Bullet} from "./weapons/bullets.js";
import {BurstSmg, Gun, Pistol, Sniper, SubMachine } from "./weapons/guns.js";
import TimerBar from "./UI/TimerBar.js";
import { removeFromArray, getCursorPosition, rand } from "../library/utils/utils.js";
import AmmoMenu from "./UI/AmmoMenu.js";

const middleground = document.getElementById("middleground");
const cursorPos = {x: null, y: null};
const keys = [];
let mouseDown = false;
let readyToShoot = true;

let player;
let cursor;
let timerBar;
let ammoMenu;

let outOfBounds = 200;
let chanceOfSpawn = 1;

App.start("square", ()=>{
    player = new Player(middleground.width/2 - (15/2), middleground.height/2 - (15/2));
    player.setGun(new BurstSmg(player));

    cursor = new Cursor();

    timerBar = new TimerBar(player.gun);
    ammoMenu = new AmmoMenu(middleground.width - 200, 30, 80, 60)

    App.createItems([player, cursor, timerBar]);        
});

App.update(()=>{
    controller();
    spawnEnemy();
    
    if(mouseDown) App.createItems(player.gun.pullTrigger({...cursorPos}));

    player.update();
    player.gun.update();
    cursor.update(cursorPos);
    timerBar.update();

    for(let enemy of Enemy.items) enemy.update(player)
    for(let bullet of Bullet.items) bullet.update();

    for(let item of App.getAllItems()) if(item.markForDeletion) removeItem(item);
    
});

function spawnEnemy(){
    let chance = rand(0,199);
    if(chance >= chanceOfSpawn) return;
    
    let pad = 50;
    let pos = {x: 0, y: 9};
    let side = rand(0,4);

    if(side == 0) pos = {x: rand(-pad, middleground.width + pad*2), y: -pad} //topOfCanvas
    else if(side == 1) pos = {x: middleground.width + pad, y: rand(-pad, middleground.height + pad*2)} //right
    else if(side == 2) pos = {x: rand(-pad, middleground.width + pad*2), y: middleground.height + pad} //bottom
    else if(side == 3) pos = {x: -pad, y: rand(-pad, middleground.height + pad*2)} //left

    App.createItems(new Enemy(pos.x, pos.y));
}

function removeItem(item){
    App.removeItems(item);
    switch (item.type) {
        case "enemy":
            Enemy.items = Enemy.items.filter(removeItem => removeItem !== item);
            player.score++
           // console.log(player.score);
            break;
            
        case 'bullet': 
            Bullet.items = Bullet.items.filter(removeItem => removeItem !== item);
            break;
        default:
            break;
    }
}

function controller(){
    if(keys['R'] && player.gun.reloaded && player.gun.ammo < player.gun.magSize) player.gun.reloading = true;
}

document.addEventListener("keydown", (e)=>{
    let key = e.key.toUpperCase();
    
    keys[key] = true;
})

document.addEventListener("keyup", (e)=>{
    let key = e.key.toUpperCase();

    keys[key] = false;
})

document.addEventListener('mousemove', (e)=>{
    cursorPos.x = getCursorPosition(middleground, e).x;
    cursorPos.y = getCursorPosition(middleground, e).y;
});

document.addEventListener('mousedown', (e)=>{
    mouseDown = true;
    if(!player.gun.automatic) player.gun.mouseReleased = false
})

document.addEventListener('mouseup', (e)=>{
    mouseDown = false;
    if(!player.gun.automatic) player.gun.mouseReleased = true

})