
_merge(){
    const biconnectedArray = this.biconnectedPlot.x;
    const triconnectedArray = this.triconnectedPlot.x;
    //const maxX = biconnectedArray[biconnectedArray.length - 1];
    let biconnectedIterator = 0, triconnectedIterator = 0;
    while(biconnectedArray.length > biconnectedIterator && triconnectedArray.length > triconnectedIterator){
        if(biconnectedArray[biconnectedIterator] > triconnectedArray[triconnectedIterator]){
            this.bitriconnectedPlot.x.push(triconnectedArray[triconnectedIterator]);
            this.bitriconnectedPlot.y.push(this.triconnectedPlot.y[triconnectedIterator]);
            triconnectedIterator++;
        }
        else if(biconnectedArray[biconnectedIterator] < triconnectedArray[triconnectedIterator]){
            this.bitriconnectedPlot.x.push(biconnectedArray[biconnectedIterator]);
            this.bitriconnectedPlot.y.push(this.biconnectedPlot.y[biconnectedIterator]);
            biconnectedIterator++;
        }
        else{ // are equal, so I have to sum the biconnected y with the triconnected y to have the real value of the components with a certain # edges
            this.bitriconnectedPlot.x.push(biconnectedArray[biconnectedIterator]);
            this.bitriconnectedPlot.y.push(this.biconnectedPlot.y[biconnectedIterator] + this.triconnectedPlot.y[triconnectedIterator]);
            triconnectedIterator ++;
            biconnectedIterator ++;
        }
    }
    if(biconnectedArray.length === biconnectedIterator) {
        triconnectedArray.slice(triconnectedIterator).forEach((elem) => { this.bitriconnectedPlot.x.push(elem)});
        this.triconnectedPlot.y.slice(triconnectedIterator).forEach((elem) => { this.bitriconnectedPlot.y.push(elem) });
    }
    else{
        biconnectedArray.slice(biconnectedIterator).forEach((elem) => { this.bitriconnectedPlot.x.push(elem)});
        this.biconnectedPlot.y.slice(biconnectedIterator).forEach((elem) => { this.bitriconnectedPlot.y.push(elem) });
    }
}

_mergeBiAndTriConnectedComponents(){

    this._merge();
    //calculate the real drawing
    let sum = 0;
    for(let i = (this.bitriconnectedPlot.y.length - 1); i >= 0 ; i--){
        sum += this.bitriconnectedPlot.y[i];
        this.bitriconnectedPlot.y[i] = sum;
    }
}