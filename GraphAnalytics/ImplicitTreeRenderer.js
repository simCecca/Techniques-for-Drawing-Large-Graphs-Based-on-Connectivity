class ImplicitTreeRenderer{

    constructor(json) {
        this.json = json;

    }

    render(){

        this._initVariable();
        //create  the svg space for the plotting
        this.vis = this._initSvg();
        //make a  translate for centrate the draw
        this._treemapAlgorithm(this.json,this.w,this.h - 2000);
        this.borderWidth = 0;
        //this._treemapAlgorithm(this.json,this.w,this.h - 2000,0, this.h/4);
        //console.log(this.json);
        //new Partition(this.json,this.vis,this.h);
    }

    _initVariable(){
        this.w = 1200;
        this.h = 2500;
        this.borderWidth = 15;
    }

    _initSvg(){
        return d3.select("#draw").append("div")
            .attr("class", "chart")
            .style("width", this.w + "px")
            .style("height", this.h + "px")
            .append("svg:svg")
            .attr("width", this.w)
            .attr("height", this.h);
    }

    /*this method is used to draw all the tree structures with an implicit tree representation*/
    _treemapAlgorithm(data,width,height,x=0,y=0,color = "rgb(0,0,250)",importance = 1, orientation = "v") {

        //color the triconnecrted block
        (data.name == 's') ? color = "rgb(250,250,0)" : ((data.name == 'p') ? color = "rgb(250,0,250)" : ((data.name == 'r') ? color = "rgb(0,250,250)" : color = color));

        //set the current node
        this._drawRectangle(x, y, width, height, color, data.name, importance * 100);
        data.x = x;
        data.y = y;
        data.width = width;
        data.height = height;
        data.orientation = orientation;

        //if is a leaf return because a leaf haven't childrens
        if(data.children == undefined) return;

        //if your width or height are < borderWidth you can't remove the borderWidth
        if(width > (2 * this.borderWidth) &&  height > (2 * this.borderWidth)) {
            //I must iterate to all mi childrens (connected components)
            x = x + this.borderWidth;
            y = y + this.borderWidth;
            width = width - (2 * this.borderWidth);
            height = height - (2 * this.borderWidth);
        }
        data.children.forEach((children) => {
            //calculare the importance of this node in the draw, to assign the inheritance of the father
            const importance = children.size / data.size;

            if (data.orientation == 'v') {
                const myDimensionality = width * importance;
                this._treemapAlgorithm(children,myDimensionality, height, x, y, "rgb(0,250,0)",importance, "h");
                //the width must reduce the inheritance assign to this son
                x = x + myDimensionality;
            }
            else {
                const myDimensionality = height * importance;
                this._treemapAlgorithm(children, width, myDimensionality, x, y, "rgb(250,0,0)", importance, "v");
                //the width must reduce the inheritance assign to this son
                y = y + myDimensionality;
            }
        });
    }

    _drawRectangle(x,y,width,height,color = "black", name = "", importance){
        this.vis.append('rect')
            .attr("x", x)
            .attr("y", y)
            .attr("width", width)
            .attr("height", height)
            .style("fill", color)
            .style("stroke-width", function(d){ var ret; (height > 15 && width > 15) ? ret = 3 : ret = 0; return ret;})
            //.style("double", "black");
            .style("stroke", "black");
        //visualize the text
        if(width > 50 && height > 50) {
            this.vis.append("text")
                .attr("transform", "translate(" + (x + 5) + "," + (y + 5) + ")")
                .attr("y", ".35em")
                .style("opacity", function (d) {
                    return (x > 12 || y > 12) ? 1 : 0;
                })
                .text(function (d) {
                    return name + " " + importance.toFixed(2) + "%";
                });
        }
    }

}
