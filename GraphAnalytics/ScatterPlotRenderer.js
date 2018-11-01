class ScatterPlotRenderer{

    constructor(json){
        this.data = json;
        //data building
        /*I process the data in the constructor so then with each visualization they will not be reprocessed*/
        //these are two map witch have as key the number of edges and as value the # of biconnected/triconnected blcok that have that number of edges
        this.biconnectedMap =  new Map();
        this.triconnectedSMap = new Map();
        this.triconnectedPMap = new Map();
        this.triconnectedRMap = new Map();

        this.biconnectedPlot = { x:[] , y:[]};
        this.triconnectedSPlot = { x:[] , y:[]};
        this.triconnectedPPlot = { x:[] , y:[]};
        this.triconnectedRPlot = { x:[] , y:[]};

        //percorro l'albero e salvo tutte le informazioni in merito ai blocchi e alla loro dimensione
        this._coordinateAssignment(this.data);

        //creo due variabili per il plotting le quali avranno tutte le informazioni necessarie alla libreria Plotly per fare il primo rendering
        //i primi due metodi reperiscono le coordinate x e y dei blocchi biconnessi e triconnessi, i secondi due assegnano il resto dei parametri
        //per il primo plotting
        this._createFormatForPlotting(this.biconnectedMap, this.biconnectedPlot);
        this._createFormatForPlotting(this.triconnectedSMap, this.triconnectedSPlot);
        this._createFormatForPlotting(this.triconnectedPMap, this.triconnectedPPlot);
        this._createFormatForPlotting(this.triconnectedRMap, this.triconnectedRPlot);

        this._edgeDistribution(this.biconnectedPlot,"biconnected");
        this._edgeDistribution(this.triconnectedSPlot,"S");
        this._edgeDistribution(this.triconnectedPPlot,"P");
        this._edgeDistribution(this.triconnectedRPlot,"R");


        //for an unique plotting that represent the real distribution of edges we need to merge the biconnected coordinates with the triconnected
        //this._mergeBiAndTriConnectedComponents();

        this.hystogramBiconnected = JSON.parse(JSON.stringify(this.biconnectedPlot));
        this._realDistribution(this.hystogramBiconnected);

    }

    async _hystogram(){
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        new LogLogRenderer({x:this.hystogramBiconnected.x, y:this.hystogramBiconnected.y});
        console.log([this.triconnectedSPlot, this.triconnectedPPlot, this.triconnectedRPlot]);
       await this._addLybrary();
        await sleep(150);
    }


    async _rendering(){
        //biconnected
        await this._hystogram();
        //first plotting
        //await this._edgeDistributionRendering([ this.biconnectedPlot], this.biconnectedPlot.x[this.biconnectedPlot.x.length - 1], this.biconnectedPlot.y[0], "step", "biconnected");
        //second plotting
        await this._edgeDistributionRendering([this.biconnectedPlot], 0, 0, "log-first", "Logaritmic - Logaritmic biconnected", 1);


        //triconnected

        //4-t plotting
        //await this._edgeDistributionRendering([ this.triconnectedSPlot, this.triconnectedPPlot, this.triconnectedRPlot ], 0, 0, "simple", "triconnected");

        //5-t data building and plotting
        await this._edgeDistributionRendering([ this.triconnectedSPlot, this.triconnectedPPlot, this.triconnectedRPlot ], 0, 0, "log2log-first", "Logaritmic - Logaritmic triconnected", 1);
    }

    _realDistribution(component){
        let sum = 0;
        for(let i = (component.y.length - 1); i >= 0 ; i--){
            sum += component.y[i];
            component.y[i] = sum;
        }
    }

    _edgeDistribution(component, name = "", mode = 'markers', line = "",type = 'scatter'){
        component.mode = mode;
        component.type = type;
        //this.biconnectedPlot.mode = 'lines';
        component.name = name;
        //component.text = text;
        if(line != "") component.line = line;

        component.marker = { size: 12 };
    }

    //ordering of the bi or tri - connected components and push in the map used for the plotting
    _createFormatForPlotting(component,plot) {
        Array.from(component.keys()).sort((a, b) => {
            return a - b;
        }).forEach((key) => {
            if (key != 0) {
                plot.x.push(key);
                plot.y.push(component.get(key));
            }
        })
    }

    /*quando passi da un padre ad un figlio sai per certo che ogni blocco avrà un numero di archi minori o uguali a quelli del padre, quindi
    * ogni figlio avrà i blocchi del padre*/
    _coordinateAssignment(data){

        //add or update a number in the biconnected components map
        if(data.name.startsWith("bc")){
            const oldSize = this.biconnectedMap.get(data.size);
            this.biconnectedMap.set(data.size, (oldSize != undefined) ? 1 + oldSize : 1);
            (data.children != undefined) ? data.children.forEach((children) => { return this._coordinateAssignment(children);}) : undefined;
        }
        else if(data.name.startsWith("s")){
            const oldSize = this.triconnectedSMap.get(data.size);
            this.triconnectedSMap.set(data.size, (oldSize != undefined) ? 1 + oldSize : 1);
        }
        else if(data.name.startsWith("p")){
            const oldSize = this.triconnectedPMap.get(data.size);
            this.triconnectedPMap.set(data.size, (oldSize != undefined) ? 1 + oldSize : 1);
        }
        else if(data.name.startsWith("r")){
            const oldSize = this.triconnectedRMap.get(data.size);
            this.triconnectedRMap.set(data.size, (oldSize != undefined) ? 1 + oldSize : 1);
        }
        else{//I'm a root or a conncted components so I'll call to all my childrens
            (data.children != undefined) ? data.children.forEach((children) => { return this._coordinateAssignment(children);}) : undefined;
        }
    }

    async _edgeDistributionRendering(data, maxX, maxY, name, title = "titolo",log = 0){

        this._addBody(name);
        let layout = {};
        if(log == 1){
            layout = {
                xaxis: {
                    type: 'log',
                    autorange: true
                },
                yaxis: {
                    type: 'log',
                    autorange: true
                },
                title: title
            };
        }
        else {
            layout = {
                xaxis: {
                   // range: [-(maxX / 5), maxX + (maxX / 5)]
                    autorange: true
                },
                yaxis: {
                   // range: [-(maxY / 5), maxY + (maxY / 5)]
                    autorange: true
                },
                title: title
            };
        }

        Plotly.newPlot(name, data, layout);
    }

    _addBody(name){
        d3.select("#draw")
            .append("div")
            .attr("id", name);
    }
    _addLybrary(){
        d3.select("head")
            .append("script")
            .attr("src", "https://cdn.plot.ly/plotly-1.2.0.min.js");
    }
}