import { Rectangle } from "../../library/classes/shapes.js";
import { rand, randNeg, getDiagnalVelocity, getDistance } from "../../library/utils/utils.js";

const middleground = document.getElementById('middleground');

export class Bullet extends Rectangle{
    static items = [];

    constructor(player, target, data){
        super(player.getCenter().x, player.getCenter().y, data.size, data.size, "black", "bullet");
        this.target = target;
        this.data = data;

        for (const key in data) this[key] = data[key];
        
        this.pierceAmt = rand(0, data.pierceAmt);
        this.enemiesHit = 0;
        this.calcTarget();
        
        this.pullDir;
        this.dragOffset = ((rand(0, (100 - this.range)) / 100) * 2) * randNeg(1);
        if(Math.abs(this.vX) < Math.abs(this.vY)) this.pullDir = 'vert'
        else this.pullDir = 'horz'

        Bullet.items.push(this);

        this.active = false;
        this.isVisible = false;
        this.collidable = false;
    }

    update(){
        if(!this.active) return;
        console.log(this.renderLayer);
        this.move();
        this.addDrag();
        if(this.x < 0 || this.y < 0 || this.x > middleground.width || this.y > middleground.height) this.markForDeletion = true;
    }

    activate(){
        this.active = true;
        this.isVisible = true;
        this.collidable = true;
    }
    
    addDrag(){
        if(this.pullDir == 'vert') this.x += this.dragOffset;
        else this.y += this.dragOffset;
    }

    onCollision(item){
        if(item.type == 'player') return;

        if(item.type == 'enemy'){
            this.enemiesHit++;

            item.hit(this.damage);
            if(this.enemiesHit > this.pierceAmt) this.markForDeletion = true;
        }
    }

    calcTarget(){
        let vel;
        let int = (100 - this.accuracy);
        let offset = randNeg(rand(0, int));

        this.target.x += offset;
        this.target.y += offset;

        vel = getDiagnalVelocity(this.getCenter(), this.target, this.maxVel);
        this.vX = vel.x;
        this.vY = vel.y;
    }
}

export class PistolBullet extends Bullet{   
    constructor(player, cursorPos, gun){
        super(player, cursorPos, {
            size: 3,
            damage: 1,
            maxVel: 12,
            accuracy: gun.accuracy,
            range: gun.range,
            pierceAmt: 0
        });
    }
}

export class SniperBullet extends Bullet{   
    constructor(player, cursorPos, gun){
        super(player, cursorPos, {
            size: 4,
            damage: 10,
            maxVel: 15,
            accuracy: gun.accuracy,
            range: gun.range,
            pierceAmt: 3
        });
    }
}