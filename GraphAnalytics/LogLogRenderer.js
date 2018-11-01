class LogLogRenderer{

    constructor(rectangles = 0){
        //this.rectangles ={x:[1,10,20,100,500,600,1001,2000,100000,150000], y:[2000000000,420000000,432000000,12330000,4230000,420000, 12000, 2100, 120,23]};
        this.rectangles = rectangles;
        this.width = 1000;
        this.height = 600;
        this.graphic = new Graphic(this.rectangles, this.height, this.width);

        this.graphic.calculateRectangleValues();
        console.log(this.graphic);

        var svg = d3.select("body").append("svg")
            .attr("id", "log-log")
            .attr("width", this.width + 500)
            .attr("height", this.height + 200);

        var codomain = [this.rectangles.y[0], 1];
        var rangeY = [0, this.height];

        let domain = [1, this.rectangles.x[this.rectangles.x.length-1]];
        let rangeX = [1, this.width];


        let g = svg.append("g")
            .attr("transform","translate(250,100)");

        var logScale =  d3.scaleLog().domain(domain).range(rangeX);
        var logScale2 = d3.scaleLog().domain(codomain).range(rangeY);

        let data = this.graphic.getRectangles();

        g.selectAll("rect").data(data).enter()
            .append("rect")
            .attr("id", d => "A".concat(d.x.toString().concat(d.y.toString())))
            .attr("x", function(d) {return d.x})
            .attr("y", function(d) {return d.y})
            .attr("height", function(d) {return d.h})
            .attr("width", function(d) {return d.w})
            .attr("fill", "blue")
            .style("stroke", "#fff");

        //visualizing the interval and y coordinate
        const svgTexts = g.selectAll("text").data(data);
        svgTexts.enter()
            .append("text")
            //.style("visibility", "hidden")
            .on("mouseover",  (_, i, nodes) => d3.select(nodes[i]).style("visibility", "visible"))
            .on("mouseover", (_, i, nodes) => d3.select(nodes[i]).transition().duration(100).style("font-size", "10px"))
            .on("mouseout", (_, i, nodes) => d3.select(nodes[i]).transition().duration(100).style("font-size", "0px"))
            .merge(svgTexts)
            // .style("visibility", "visible")
            .attr("x", (d) => d.x)
            .attr("y", (d) => d.y)
            .text((d) => "( " + d.interval[0].toString() + " , " + d.interval[1].toString() + " )");

        /*

        svgTexts.enter()
            .append(`text`)
            .classed(kind, true)
            .on("mouseover", (_, i, nodes) => d3.select(nodes[i]).transition().duration(100).style("font-size", "18px"))
            .on("mouseout", (_, i, nodes) => d3.select(nodes[i]).transition().duration(100).style("font-size", "10px"))
            .merge(svgTexts)
            .attr("x", d => position(d)[0])
            .attr("y", d => position(d)[1])
            .text(d => d.label);
        */
        //What number in the domain is half way along the logscale?

        var xaxis = d3.axisBottom(logScale).tickFormat(d3.format(",.1f"));
        var yaxis = d3.axisLeft(logScale2).tickFormat(d3.format(",.1f"));

        svg.append("g").attr("transform","translate(250,712)").attr("class", "x axis").call(xaxis);

        svg.append("g").attr("transform","translate(150,100)").attr("class", "y axis").call(yaxis);

    }

    setRectangles(rects){
        this.rectangles = rects;
    }



}