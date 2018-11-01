
/*this class has the task of managing all the various plotting by keeping the generation of their data appropriately separated with their rendering*/
class Renderer{

    constructor(json){
        /*calculation of the data for the various renderings*/
        this.json = json;
        this._init();

    }

    async _init(){
        this.scatter =await new ScatterPlotRenderer(this.json);
        this.implicit =await new ImplicitTreeRenderer(this.json);
        this._addPlots();
    }
    _removeOldPlotting(){
        //d3.selectAll("*").remove();
        d3.selectAll('.chart').remove();
        d3.selectAll('.js-plotly-plot').remove();
        d3.selectAll('#js-plotly-plot').remove();
        d3.selectAll('.js-reference-point').remove();
        d3.selectAll('#js-plotly-tester').remove();
        d3.selectAll('#js-notifier').remove();
    }

    _addPlots(){

        d3.select(".sidenavContent")
            .html('<p>-Plots</p>\n' +
                '        <select onchange="ctrl.kindOfDraw(this.value)">\n' +
                '            <option value="" selected disabled>Choose a Plot</option>\n' +
                '        <option value="Implicit">Implicit Representation</option>\n' +
                '        <option value="Scatter">Log - Log</option>\n' +
                '            </select>');

    }

    //drawImplicit
    drawImplicit(){
        this._removeOldPlotting();
        this.implicit.render();
    }

    //drawScatter
    drawScatter(){
        this._removeOldPlotting();
        this.scatter._rendering();
    }
    drawHystogram(){

    }
}