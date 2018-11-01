class Rectangle{
    constructor(y = 0, h = 0, interval, maxX, maxW){
        this.y = y;
        this.h = (h == 0) ? 10 : h;
        //for creating a new object
        this.interval = JSON.parse(JSON.stringify(interval));
        this.x = Math.log10(this.interval[0]) * maxW / Math.log10(maxX);
        this.w = Math.log10(this.interval[1] / this.interval[0]) * maxW / Math.log10(maxX);
        if(this.w < 10) this.w = 10;
    }

    setX(x){
        this.x = x;
    }

    setY(y){
        this.y = y;
    }
}