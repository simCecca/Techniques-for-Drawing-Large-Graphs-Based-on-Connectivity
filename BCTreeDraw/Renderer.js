class Renderer {

    //todo: creare una classe unica che definisca il flusso di esecuzione
    constructor() {
        this.svg = d3.select("#svgCanvas");
        this.svgElement = this.svg.append("g");
        this.graph = null;
        this.width = 1500;
        this.height = 600;
        this.algorithm = new DrawAlgorithm(this.width, this.height); // Dummy graph
        this.isJustCreatedTheRectForTheZoom = false;
    }

   async setGraph(graph) {
        //dialogueBox("Coordinate Assignment");
        this.graph = graph;
        await this.algorithm.drawBCTree(graph);
        console.log("renderer");
        this.render();
        const renderFunction = () => {
            console.log("renderer");
            this.render();
            //requestAnimationFrame(renderFunction);
        };

        //requestAnimationFrame(renderFunction);
    }

    renderNodes(nodes, cc) {
        let gForNodes = this.svg.append("g");
        const svgNodes = this.svgElement.selectAll("circle")
            .data(nodes, node => node.getId());

        svgNodes.enter()
            .append("circle")
            .attr("id", node => node.getId())
            .attr("r", node => { node.dimension = (Math.log10(node.getSize()) / Math.log10(this.graph.getConnectedComponent(cc).getMaxSize())) * 20; if(node.hide) node.dimension = 0; if(!node.isABNode || node.isBlack || (node.dimension < 2 && !node.hide)){node.dimension = 2;} return node.dimension})

            .on("mouseover", (_, i, nodes) => {d3.select(nodes[i]).transition().duration(100).attr("r", node => node.dimension * 2)})
            .on("mouseout", (_, i, nodes) => {d3.select(nodes[i]).transition().duration(100).attr("r", node => node.dimension)})
            .call(d3.drag()
                .on("drag", node => {node.x = d3.event.x; node.y = d3.event.y; this.render()}))
            .on("click", (nodeObject, i, nodes) => { d3.select(nodes[i]).attr("r", node => node.dimension * 3); const name = (nodeObject.getSPQRTree() != undefined) ? nodeObject.getSPQRTree().root.getId() : "ciao"; console.log((name.includes("p") ? "P" : name.includes("s") ? "S" : name.includes("r") ? "R" : "noValue"));})
            .merge(svgNodes)
            .attr("cx", node => node.x)
            .attr("cy", node => node.y)
            .attr('fill', node => { let color = 'orange'; (node.getId().includes("cut")) ?  color = 'green' : (node.isBlack) ? color = 'dark' : color = 'orangered'; return color;});
    }

    renderEdges(edges) {
        const svgEdges = this.svgElement.selectAll("line")
            .data(edges, edge => { edge.id = edge.source.getId().concat(edge.target.getId()); return edge.id;}); // edges aren't going to change...

        svgEdges.enter()
            .append("line")
            .merge(svgEdges)
            .attr("id", edge => edge.id)
            .attr("x1", edge => edge.source.x)
            .attr("y1", edge => edge.source.y)
            .attr("x2", edge => edge.target.x)
            .attr("y2", edge => edge.target.y)
    }

    //for the zooming
    rendererRectForZooming(){
        if(!this.isJustCreatedTheRectForTheZoom) {
            this.isJustCreatedTheRectForTheZoom = true;
            var zoom = d3.zoom().on("zoom", () => {
                this.zoom();
            });


            var gElem = this.svg.call(zoom);

            gElem//.append("rect")
                .attr("width", this.width)
                .attr("height", this.height)
                //.style("fill", "none")
                .style("pointer-events", "all")
                .on("contextmenu", () => {
                    d3.event.preventDefault();
                    gElem.transition()
                        .duration(750)
                        .call(zoom.transform, d3.zoomIdentity);
                });
        }
    }

    zoom(){
        //todo: d3.event.transform is a string like this: "translate(30,40) scale(2)" so if the scale is changed from the last update ricalculate the coordinate with the algorithm
        this.svgElement.attr("transform", d3.event.transform);
    }

    _singleNodeRendering(node){
        this.renderEdges(this.graph.getConnectedComponent(0).getEdges());
        d3.select(nodes).attr("cx", node.x).attr("cy", node.y);
    }

    render() {
        this.graph.getAllComponents().forEach((connectedComponent, i) => {
            this.renderEdges(connectedComponent.getEdges());

            this.renderNodes(connectedComponent.getNodes(),i);
            this.rendererRectForZooming();
        });
    }


}