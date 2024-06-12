import * as App from "./app.js";
import { addToLayer, removeFromLayer } from "./render.js";
import { getCenterOfSquare } from "./utils/utils.js";
import { Line } from "./classes/shapes.js";

export default class Grid{
    constructor(width, height, scale){
        this.width = width;
        this.height = height;
        this.scale = scale;

        this.tiles = [];
        this.generate();
    }

    generate(){
        for(let i = 0; i < this.scale; i++){
            this.tiles[i] = [];
            for(let k = 0; k < this.scale; k++){
                this.tiles[i].push(new Tile(i,k));
            }
        }
    }

    snap(item){
        let tilePos = this.getTileByPos(item);
        let pos = this.getPosByTile(tilePos);
        let centerPos = getCenterOfSquare(pos);

        item.x = centerPos.x - item.width/2;
        item.y = centerPos.y - item.height/2;
    }

    getTileSize(){
        return this.width / this.scale;
    }

    getTileByXY(pos){
        for(let i = 0; i < this.tiles.length; i++){
            for(let k = 0; k < this.tiles[i].length; k++){
                if(i == pos.x && k == pos.y) return this.tiles[i][k];
            }
        }
    }

    getTileByPos(pos){
        let x = Math.floor(pos.x / this.getTileSize());
        let y = Math.floor(pos.y / this.getTileSize());
        
        return this.getTileByXY(x,y);
    }

    getPosByTile(tile){
        return {
            x: tile.x * this.getTileSize(), 
            y: tile.y * this.getTileSize(),
            width: tile.x * this.getTileSize() + this.getTileSize(), 
            height: tile.y * this.getTileSize() + this.getTileSize(), 
        }
    }

    getBorder(){
        let borderTiles = [];
        for(let i = 0; i < this.tiles.length; i++){
            for(let k = 0; k < this.tiles[i].length; k++){
                if(i == 0 || k == 0 || i == (this.tiles.length - 1) || k == (this.tiles[i].length - 1)){
                    borderTiles.push(this.tiles[i][k]);
                }
            }
        }
        return borderTiles;
    }

    getCorners(){
        return{
            topLeft: this.tiles[0][0],
            topRight: this.tiles[this.tiles.length-1][0],
            bottomLeft: this.tiles[0][this.tiles.length-1],
            bottomRight: this.tiles[this.tiles.length-1][this.tiles.length-1],
        }
    }

    show(){
        let lines = [];
        for(let i = 0; i < this.tiles.length; i++){
            let spaceHorizontal = i * this.getTileSize();
            lines.push(new Line(0,this.width, spaceHorizontal, spaceHorizontal, null, null))
            for(let k = 0; k < this.tiles[i].length; k++){
                let spaceVerticle = k * this.getTileSize();
                lines.push(new Line(spaceVerticle,spaceVerticle, 0, this.height, null, null))  
            }

        }
        for(let line of lines) addToLayer("background", line);
        return lines;
    }

    onClick(pos){
        return this.getTileByPos(pos);
    }
}

class Tile{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.userData = null;
    }
}