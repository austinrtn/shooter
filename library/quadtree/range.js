import { containsPointInSquare, squareIntersects, containsPointInCircle, circleIntersects } from "../utils/utils.js";

export class Point{
    constructor(x,y, userData){
        this.x = x;
        this.y = y;
        this.userData = userData;
    }
}

export class RectRange {
    constructor(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    contains(point) {
        return containsPointInSquare(this,point);
      }

      intersects(range){
        return squareIntersects(range,this);
      }
}

export class CircleRange {
    static setRangeSize(items){
        let radius = -Infinity;
        for(let i of items){
            if(i.r > radius) radius = i.r*2;
        }
        return radius;
    }

    constructor(x,y,r){
        this.x = x;
        this.y = y;
        this.r = r;
    }

    contains(point){
        return containsPointInCircle(this, point);
    }

    intersects(range){
        circleIntersects(range,this);
    }
}