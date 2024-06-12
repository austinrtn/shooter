import { Circle } from "../library/classes/shapes.js";

export default class Cursor extends Circle{
    constructor(){
        super(null, null, 5, 'red', 'cursor');
        this.opacity = .5;

        this.renderLayer = "foreground";
        this.collidable = false;
    }

    update(pos){
        if(!pos) return;
        this.x = pos.x;
        this.y = pos.y;
    }
}