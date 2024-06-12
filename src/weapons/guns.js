import * as App from "../../library/app.js";
import { Bullet, PistolBullet, SniperBullet } from "./bullets.js";

export class Gun {
    constructor(player, BulletType, data) {
        this.player = player;

        for (const key in data) this[key] = data[key];
     
        this.type = "gun";

        this.startTimer = true;
        this.reloadTimer = 0;

        this.BulletType = BulletType;
        this.ammo = this.magSize;
        this.active = true;
        this.mouseReleased = true;
        this.loaded = true;
        this.reloaded = true;
        this.reloading = false;
    }

    update(){
        let reloadId;

        if(this.reloading && this.startTimer){
            this.startTimer = false;
            this.reloadTimer = 0;

            if(this.reloadTimer == 0){
                let func = ()=>{
                    if(this.reloadTimer < this.reloadDelay) this.reloadTimer += 100
                    if(this.startTimer)  clearInterval(reloadId)
                }
                reloadId = setInterval(func, 100)
            }
        }

        if(this.loaded && this.reloaded && this.mouseReleased) this.active = true;
        else this.active = false;

        if(this.reloadTimer >= this.reloadDelay && this.reloading) this.reload();
    }

    pullTrigger(cursorPos) {
        if (this.ammo < 1) {
            this.reloaded = false;
            this.reloading = true;
        }
        this.shoot(cursorPos);
    }

    shoot(cursorPos) {
        if(!this.active) return false;

        this.loaded = false;
        setTimeout(() => { this.loaded = true;}, this.rateOfFire);

        if(this.burstCount && this.burstRate && this.burstCount > 0){
            let bullets = this.burst(cursorPos);
            return bullets;
        }

        let bullet = new this.BulletType(this.player, cursorPos, this);
        App.createItems(bullet);
        this.ammo--;

        return bullet;
    }

    burst(cursorPos){
        let mainBullet = new this.BulletType(this.player, cursorPos, this);
        let bullets = [];
        let timeout = 0;

        for(let i = 0; i < this.burstCount; i++){
            let bullet = new Bullet(this.player, cursorPos, mainBullet.data);
            console.log(bullet);
            bullets.push(bullet);

            App.createItems(bullet);
            setTimeout(() => {bullet.activate()}, timeout);

            this.ammo;
            timeout += this.burstRate;
        }
        return bullets;
    }

    reload() {
        this.ammo = this.magSize;
        this.reloading = false;
        this.reloaded = true;1
        this.startTimer = true; 
    }
}

export class Pistol extends Gun {
    constructor(player) {
        super(player, PistolBullet, {
            accuracy: 90,
            range:80,
            magSize:9,
            rateOfFire:250,
            reloadDelay:1000,
            automatic: false,
            spread: 1
        })
    }
}

export class SubMachine extends Gun {
    constructor(player) {
        super(player, PistolBullet, {
            accuracy: 85,
            range:60,
            magSize:25,
            rateOfFire:90,
            reloadDelay:2500,
            automatic: true,
            spread: 1
        })
    }
}

export class BurstSmg extends Gun {
    constructor(player) {
        super(player, PistolBullet, {
            accuracy: 85,
            range:60,
            magSize:25,
            rateOfFire:90,
            reloadDelay:2500,
            burstCount: 2,
            burstRate: 40,
            automatic: false,
            spread: 1
        })
    }
}

export class Sniper extends Gun {
    constructor(player) {
        super(player, SniperBullet, {
            accuracy: 95,
            range:95,
            magSize:7,
            rateOfFire:120,
            reloadDelay:3000,
            automatic: false,
            spread: 1
        })
    }
}

