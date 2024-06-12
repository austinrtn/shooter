import Block from "./Block.js";
import * as Physics from "../physics.js";
let ii = 0;
export default class PhysicsObject extends Block{
    constructor(x,y,width,height,color,type){
        super(x,y,width,height,color,type);

        this.vY = 0;
        this.vyMax = 1;
        this.mass = 20;

        this.hasGravity = false
        this.isFalling = false;
        this.isTouchingPlatform = false;

        this.clips = false;
       // this.static = true;
        this.bounces = false;
        this.energyLostOnBounce = .3; //From .1 - .9 for energy loss
        this.isVerticleBouncing = false;

        this.momentum = function(){
            return this.vX * this.mass;
        }
    }

    update(){
        this.checkDrag();
        this.updateCollision();
        this.move();
        if(this.hasGravity && !this.isTouchingPlatform) this.isFalling = true; // check if is supposed to fall
        if(this.hasGravity && this.isFalling) this.fall();
        //if(this.isVerticleBouncing) this.verticleBounce
    }

    updateCollision(){
        this.isTouchingPlatform = false;

        for(var i = 0; i < this.collisions.length; i++){
          let collisionObj = this.collisions[i];
            this.onCollision(collisionObj);
          }
        
        return null;
    }

    onCollision(collisionObj){
        if(collisionObj.isPlatform){
            this.isTouchingPlatform = true;
            this.stopFalling(collisionObj);
        }
    }

    fall(){
        this.vY += Physics.getConfig().rateOfGravity - Physics.getConfig().airResistance;
    }

    stopFalling(platform){
        if(this.isFalling) this.y = platform.y - this.height +.001;
        if(this.bounces && this.vY > 2.5) {
            if(this.vY > 0) this.vY = -this.vY * (1 - this.energyLostOnBounce);
        }
        else {
            this.isFalling = false;
            this.vY = 0;
        }
    }

    onDrag(x,y){
        this.x = x 
        this.y = y
    }

    checkDrag(){
        if(this.isBeingDragged){
            this.isFalling = false;
        }
        else if(!this.hasGravity && !this.isBeingDragged) this.isFalling = true;
    }
}