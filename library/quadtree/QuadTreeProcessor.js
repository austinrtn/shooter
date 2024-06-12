import QuadTree  from "./QuadTree.js";

import StopWatch from "../utils/StopWatch.js";
import {Rectangle} from "../classes/shapes.js";
import { addToLayer, removeFromLayer } from "../render.js";
import { squareIntersects, circleIntersects } from "../utils/utils.js";
import { RectRange } from "./range.js";


export default class QuadTreeProcessor {
    constructor(width, height, capacity, shape) {
        this.width = width;
        this.height = height;
        this.capacity = capacity;
        this.shape = shape;

        this.showBoxes = false;
        this.boxColor = "red";
        this.boundingBoxes = [];

        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
    }

    removeItem(item) {
        this.items = this.items.filter(removeItem => removeItem != item);
    }

    update() {
        let qt = new QuadTree(new RectRange(0, 0, this.width, this.height), this.capacity);
        if (this.boundingBoxes.length > 0) this.resetBoundingBoxes();
        for (let item of this.items) qt.insert(item);

        for (let item of this.items) {
            if (this.shape == "square") this.squareCollision(qt, item);
            else if (this.shape == "circle") this.circleCollision(qt, item);
            if(!item.collisions) continue;
            for (let otherItem of item.collisions) {
                if (this.shape == "square" && !squareIntersects(item, otherItem)) item.collisions = item.collisions.filter(removeItem => removeItem != otherItem);
                if (this.shape == "circle" && !circleIntersects(item, otherItem)) item.collisions = item.collisions.filter(removeItem => removeItem != otherItem);

            }
        }

        if (this.showBoxes) this.drawBoundingBoxes();
    }

    squareCollision(qt, item) {
        let paddingWidth = (item.width * 0.25);
        let paddingHeight = (item.height * 0.25);
        let range = new RectRange(item.x - paddingWidth, item.y - paddingHeight, item.width + paddingWidth * 2, item.height + paddingHeight * 2);

        if (this.showBoxes) this.rangeToRect(range);
        let points = qt.query(range, null);
        for (let point of points) {
            let otherItem = point.userData;
            let colliding = (item !== otherItem && squareIntersects(item, otherItem));
            let foundItem = item.collisions.find(i => i == otherItem);


            if (colliding && item.onCollision) item.onCollision(otherItem);
            if (!foundItem && colliding && item.collisions) item.collisions.push(otherItem);

        }
    }

    circleCollision(qt, item) {
        let padding = item.r * 1.2;
        let range = new RectRange(item.x - padding, item.y - padding, padding * 2, padding * 2);
        if (this.showBoxes) this.rangeToRect(range, "white");

        if (this.showBoxes) this.rangeToRect(range);
        let points = qt.query(range, null);

        for (let point of points) {
            let otherItem = point.userData;
            let colliding = (item !== otherItem && circleIntersects(item, otherItem));
            let foundItem = item.collisions.find(i => i == otherItem);

            if (colliding && item.onCollision) item.onCollision(otherItem);
            if (!foundItem && colliding && item.collisions) item.collisions.push(otherItem);

        }
    }

    rangeToRect(range) {
        let rect = new Rectangle(range.x, range.y, range.width, range.height, "black");
        rect.fill = false;
        rect.strokeColor = this.boxColor;
        this.boundingBoxes.push(rect);
 
    }

    drawBoundingBoxes() {
        for (let box of this.boundingBoxes) {
            addToLayer("background", box);
        }
    }

    resetBoundingBoxes() {
        for (let box of this.boundingBoxes) {
            removeFromLayer(box);
        }
        this.boundingBoxes = [];
    }
}
