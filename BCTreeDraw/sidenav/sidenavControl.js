class Controller {

    constructor() {
       this.renderer = null;
        // window.addEventListener("resize", () => this.onWindowSizeChange());
        this.loader = new GraphLoader();

    }

    kindOfProcessor(processor) {
        if (processor === "CPU") {
            d3.select('#svgdiv').html('<svg id="svgCanvas" width="1500px" height="600px" style=" border : 1px solid gray; background-color: white" transform="translate(0,50)"></svg>');
            this.renderer = new Renderer();
        }
        else{
            this.renderer = new GpuRenderer();
       }
    }

    onFileSelect(evt) {
        const files = evt.target.files;
        const file = files[0];
        dialogueBox("Downloading of the selected graph");
            //dialogueBox("Downloading of the selected graph");
        this.loader.loadFromFile(file)
            .then(graph => {
                this.drawGraph(graph);})
            //.catch(err => this.showError(err));

    }

    onAvailableGraphs(file){
        console.log(file);
        this.loader.loadFromAvailableGraphs(file)
            .then(graph => this.drawGraph(graph))
        //.catch(err => this.showError(err));
    }

    drawGraph(graph) {
        //document.getElementById("dialogText").innerHTML = "Graph Loaded";
        //this.renderer.drawBCTree(graph);
        this.renderer.setGraph(graph);
    }




}

const ctrl = new Controller();