class Controller {

    constructor() {
       this.renderer = null;
        // window.addEventListener("resize", () => this.onWindowSizeChange());
        this.loader = new GraphLoader();
        this.fileSelected = null;
        this.fileOnAvailableGraph = null;
        this.processorKind = "CPU";
        this.width = window.screen.availWidth * 0.7;
        this.height = window.screen.availHeight;
    }

    setFileSelected(evt){
        const files = evt.target.files;
        this.fileSelected = files[0];
        console.log(this.fileSelected);
    }

    setFileOnAvailableGraph(file){
        this.fileOnAvailableGraph = file;
        console.log(this.fileOnAvailableGraph);
    }

    setProcessorKind(processor){
        this.processorKind = processor;
    }

    drawingFlowHandle(){
        this.kindOfProcessor();
        (this.fileSelected === null) ? this.onAvailableGraphs() : this.onFileSelect();
    }

    kindOfProcessor() {
        if (this.processorKind === "CPU") {
            d3.select('#svgdiv').html('<svg id="svgCanvas" width="100%" height=' + this.height*0.8 + ' style=" border : 1px solid gray; background-color: white" transform="translate(0,50)"></svg>');
            this.renderer = new Renderer();
        }
        else{
            this.renderer = new GpuRenderer();
       }
    }

    onFileSelect() {
        dialogueBox("Downloading of the selected graph");
        console.log(this.fileSelected);
        this.loader.loadFromFile(this.fileSelected)
            .then(graph => {
                this.drawGraph(graph);})
            //.catch(err => this.showError(err));

    }

    onAvailableGraphs(){
        this.loader.loadFromAvailableGraphs(this.fileOnAvailableGraph)
            .then(graph => this.drawGraph(graph))
        //.catch(err => this.showError(err));
    }

    drawGraph(graph) {
        //document.getElementById("dialogText").innerHTML = "Graph Loaded";
        //this.renderer.drawBCTree(graph);
        this.renderer.setGraph(graph);
    }

    stopZoom(){
        this.renderer.stopZoom();
    }



}

const ctrl = new Controller();