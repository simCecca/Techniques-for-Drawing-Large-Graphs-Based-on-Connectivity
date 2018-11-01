

class GraphLoader{

    constructor(){
        this.implicit = undefined;
        this.scatter = undefined;
    }
////////////////////////SERVER///////////////////////////////////////////////////////////////////////////
    async _fetchJSON(path) {
        const fetchJson = await fetch(path, {method: 'GET', timeout: 500000000});

        const jsonText = await fetchJson.text();

        return new Promise(resolve => resolve(jsonText));
    }

    async loadFromServer(path){

        let graph = await this._fetchJSON(path);
        let data = JSON.parse(graph);
        var render = new ImplicitTreeRenderer(data);
    }

//////////////////////FILE////////////////////////////////////////////////////////////////////////////////
    async loadFromFile(file) {
        let json = await this._load(file);
        return json;
        //now that the file is loaded, call the renderer to plot every kind of plotting
       // let renderer = new Renderer(json);
    }

    _load(file) {
        const reader = new FileReader();
        const resultPromise = new Promise((resolve, reject) => {
            reader.onload = (event) => {
                try {
                    resolve(JSON.parse(event.target.result));
                }catch (e) {
                    reject(Error("The selected file is not a valid json encoded graph"));
                }
            }
        });
        reader.readAsText(file);

        return resultPromise;
    }

}