import Block from "./Block.js";

export default class Platform extends Block{
    constructor(x,y,width,height,color){
        super(x,y,width,height,color,"platform");

        this.collidable = true;
        this.isPlatform = true;
    }
}