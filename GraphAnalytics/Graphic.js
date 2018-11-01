class Graphic{
    constructor(data,point = 0, maxW = 0){
        this.retangles = [];
        this.deepPoint = point;
        this.data = data;
        this.maxW = maxW;
        console.log(data);
    }

    addRectangle(rectangle){
        this.retangles.push(rectangle);
    }

    getRectangles(){
        return this.retangles;
    }

    calculateRectangleValues(){
        let currentXValue = 10, currentYValue = 0;
        let currentXValueForDrawing = 0;
        let maxY = this.data.y[0], interval = [1,0];
        let maxX = this.data.x[this.data.x.length-1];
        this.data.x.forEach( (x,i) => {
            if( x === currentXValue) {
                let currLog = Math.log10(this.data.y[currentYValue]);
                let curr = currLog * this.deepPoint / Math.log10(maxY);
                interval[1] = x;
               // const w = Math.log10(x) * this.maxW / Math.log10(maxX);
                this.addRectangle(new Rectangle( this.deepPoint - curr, curr,interval,maxX, this.maxW));
                currentYValue = i + 1;
                currentXValue *= 10;
                interval[0] = (this.data.x[i+1] != undefined ) ? this.data.x[i+1] : x;
            }
            else if(x > currentXValue){
                let currLog = Math.log10(this.data.y[currentYValue]);
                let curr = currLog * this.deepPoint / Math.log10(maxY);
                interval[1] = this.data.x[i-1];
               // const w = Math.log10(interval[1]) * this.maxW / Math.log10(maxX);
                this.addRectangle(new Rectangle( this.deepPoint - curr, curr, interval,maxX, this.maxW));
                currentYValue = i;
                currentXValue *= 10;
                interval[0] = x;
                console.log(x);
            }
            if(x > currentXValue && i+1 == this.data.x.length){
                console.log("ce rivo " + x);
                let currLog = Math.log10(this.data.y[currentYValue]);
                let curr = currLog * this.deepPoint / Math.log10(maxY);
                interval[1] = x;
                this.addRectangle(new Rectangle( this.deepPoint - curr, curr,interval,maxX, this.maxW));
            }
        });
    }
}