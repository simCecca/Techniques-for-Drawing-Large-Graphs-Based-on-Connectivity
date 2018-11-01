class Controller {

    constructor() {
        this.renderer;

        // window.addEventListener("resize", () => this.onWindowSizeChange());

        this.loader = new GraphLoader();

    }

    openNav() {
        document.getElementById("sidemenu").style.width = "250px";
    }

    closeNav() {
        document.getElementById("sidemenu").style.width = "0";
    }

    showError(msg) {
        document.getElementById("errorDialog").style.top = "0";

        document.getElementById("errorMsg").innerText = msg;
    }

    closeErrorDialog() {
        document.getElementById("errorDialog").style.top = "-100%";
    }

    onWindowSizeChange() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }

    showRenderSpeed(value) {
        const speed = parseInt(value) / 1000;

        document.getElementById("renderSpeed").textContent = speed;
        this.renderer.setRenderSpeed(speed);
    }

    kindOfDraw(value) {
        this.closeNav();
        console.log(value);
        if(value.startsWith("Impl"))
            this.renderer.drawImplicit();
        else if(value.startsWith("Sc"))
            this.renderer.drawScatter();
        else
            this.renderer.drawHystogram();
    }

    onFileSelect(evt) {
        const files = evt.target.files;
        const file = files[0];
        console.log(file);
        this.loader.loadFromFile(file)
            .then(graph => this.drawGraph(graph))
            //.catch(err => this.showError(err));

    }

    onGetFromServer() {
        const numOfNodes = document.getElementById("numOfNodes").value;
        const numOfEdges = document.getElementById("numOfEdges").value;

        const requestPath = document.getElementById("serverLocation").value;
        const requestQuery = `http://${requestPath}?nodes=${numOfNodes}&edges=${numOfEdges}`;

        console.log(requestQuery);
        this.loader.loadFromServer(requestQuery)
            .then(graph => this.drawGraph(graph))
            .catch(err => this.showError(err));
    }

    drawGraph(graph) {
        this.closeNav();
        this.renderer = new Renderer(graph);


    }
}

const ctrl = new Controller();