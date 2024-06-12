import { Rectangle } from "../library/classes/shapes.js";
import { getDistance, getDiagnalVelocity } from "../library/utils/utils.js";

export default class Enemy extends Rectangle{
    static items = [];

    constructor(x,y){
        super(x,y,12,12,"red", "enemy");
        this.hp = 1;
        this.maxVel = 0.25;

        Enemy.items .push(this);
    }

    update(player){
        if(player) this.findPlayer(player);
        this.move();
    }

    onCollision(item){
        if(item.type == 'enemy'){
            this.pushOutOfBoundary(item, null, null)
        }
    }

    hit(damage){
        this.hp -= damage;
        if(this.hp <= 0) this.markForDeletion = true;
    }

    findPlayer(player){
        let vel = getDiagnalVelocity(this.getCenter(), player.getCenter(), this.maxVel)

        this.vX = vel.x;
        this.vY = vel.y;
    }
}