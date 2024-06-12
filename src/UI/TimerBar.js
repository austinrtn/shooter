import { Rectangle } from "../../library/classes/shapes.js";

const middleground = document.getElementById('middleground');

export default class TimerBar extends Rectangle{
    constructor(gun){
        let pad = 10
        let height = 25;
        super(pad, middleground.height - height - pad, 0, height, 'red', 'TimerBar');
        
        this.opacity = .65;
        this.stroke = false;
        this.maxWidth = middleground.width - pad*2;
        this.gun = gun;
        this.startTimer = false;
        this.isVisible = false;
    }

    update(){
        let percentLoaded = this.gun.reloadTimer / this.gun.reloadDelay;

        if(this.gun.reloading) this.startTimer = true;
        if(!this.startTimer) return;

        this.selectColor(percentLoaded);
        this.width = this.maxWidth * percentLoaded;
        this.isVisible = true;

        if(percentLoaded == 1){
            this.startTimer = false;
            setTimeout(()=>{this.isVisible = false;}, 100)
        }
    }

    selectColor (percentLoaded){
        let pl = percentLoaded * 100;
        if(pl > 0 && pl <= 45) this.color = 'red';
        else if(pl > 45 && pl <= 90) this.color = 'yellow';
        else if(pl > 90 )this.color = 'green';
    }
}