import { Rectangle } from "../../library/classes/shapes.js";

export default class AmmoMenu extends Rectangle{
    constructor(x,y,width,height){
        super(x, y, width, height, "grey", "menu");
        this.ammo = "";
        this.score = "";

        this.renderLayer = 'foreground';
        this.opacity = .5
    }

    update(gun, score){
        this.ammo = gun.ammo + " / " + gun.magSize;
        this.score = score;
    }
}