class Controller {

    constructor() {
        this.renderer = new Renderer();

        // window.addEventListener("resize", () => this.onWindowSizeChange());

        this.loader = new GraphLoader();

    }

    onFileSelect(evt) {
        const files = evt.target.files;
        const file = files[0];
        console.log(file);
        this.loader.loadFromFile(file)
            .then(graph => this.drawGraph(graph))
            //.catch(err => this.showError(err));

    }


    drawGraph(graph) {
        //this.renderer.drawBCTree(graph);
        this.renderer.setGraph(graph);
    }
}

const ctrl = new Controller();