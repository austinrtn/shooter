import {Point, RectRange, CircleRange } from "./range.js";

export default class QuadTree{
    static idNum = 0;

    constructor(boundary, capacity){
        this.boundary = boundary;
        this.capacity = capacity;

        this.points = [];
        this.quads = [];
        this.divided = false;
        this.id = QuadTree.idNum++
    }
    
    insert(obj){        
        let point = new Point(obj.x, obj.y, obj);
        if(!this.boundary.contains(point)) return;

        if(this.points.length < this.capacity){
            this.points.push(point);
            return;
        }
        else if(!this.divided) this.subdivide();
        
        this.northwest.insert(obj);
        this.northeast.insert(obj);
        this.southwest.insert(obj);
        this.southeast.insert(obj);
    }

    subdivide(){
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.width;
        let h = this.boundary.height;

        let nw = new RectRange(x, y , w/2, h/2)
        let ne = new RectRange(x + w/2, y , w/2, h/2)
        let sw = new RectRange(x, y + h/2, w/2, h/2)
        let se = new RectRange(x + w/2, y + h/2, w/2, h/2)

        this.northwest = new QuadTree(nw, this.capacity);
        this.northeast = new QuadTree(ne, this.capacity);
        this.southwest = new QuadTree(se, this.capacity);
        this.southeast = new QuadTree(sw, this.capacity);

        this.quads = [this.northwest, this.northeast, this.southwest, this.southeast];

        this.divided = true;
    }
   
    query(range, found){
        if(!found) found = [];
        if(!range.intersects(this.boundary)) return found;

        for(let point of this.points){
            if(range.contains(point)) {
                found.push(point);   
            }         
        }

        if(this.divided){
            for(let quad of this.quads) quad.query(range, found);
        }
        return found;
    }
}