import { createId } from "../uid.js";

export default class Item {
    constructor(type){
        this.type = type
        this.id = createId();

        this.markForDeletion = false;
    }

    update(){
        this.move();
        this.updateCollision();
    }

   

    onCollision(collisionItem){
        return collisionItem;
    }


    onDrag(x,y){
        this.x = x 
        this.y = y
    }

    move(){
        this.x += this.vX;
        this.y += this.vY;
    }

    controller(keys){
        
    }
}