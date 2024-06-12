export default class StopWatch{
    constructor(){
        this.startTime = 0;
        this.stopTime = 0;
    }

    start(){
        this.startTime = Date.now();
    }

    stop(){
        this.stopTime = Date.now();
    }

    getTime(inSeconds){
        let time = this.stopTime - this.startTime;
        if(inSeconds) return time / 1000;
        return time;
    }

}