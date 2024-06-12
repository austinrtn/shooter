import { Rectangle } from "../library/classes/shapes.js";

export default class Player extends Rectangle{
    constructor(x,y, gun){
        super(x,y,15,15,"green", "player");
        this.score = 0;

        this.gun = gun;
        this.gunActive = true;
        

        this.reloadTime = 500;
        this.reload = ()=>{this.gunActive = true;}
        
    }

    setGun(gun){
        this.gun = gun;
    }

    update(){
       if(this.gun.reloading) this.color = 'yellow';
       else this.color = 'green'
    }
}