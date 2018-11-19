class GraphLoader{

    constructor(){}


    async loadFromFile(file) {
        let json = await this._load(file);
        dialogueBox("loading of the graph");
        await sleep(50);
        let cc = this.loadGraph(json);
        return cc;
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

    async loadFromAvailableGraphs(path){
        dialogueBox("Downloading of the selected graph");
        const response = await fetch(path);
        const jsonGraph = await response.json();
        dialogueBox("Graph Loading");
        await sleep(50);
        return this.loadGraph(jsonGraph);
    }

    /*for creating the graph structure*/
    loadGraph(jsonGraph){

        //the first thing to do is to create the connected components graph in witch we insert each connected components (subgraph)
        const connectedComponentsGraph = new ConnectedComponentsGraph();

        //for each connected components i create a graph and insert it into the total graph
        jsonGraph.children.forEach((connected, i) => {
            const graph = new Graph();

            const id2connectedComponents = new Map();
            const id2BiconnectedBlocks = new Map();

            let currentCC = "a".concat(i);
            //the importance of a connected components depends on their number of edges
            graph.setImportace(connected.size / jsonGraph.size);

            connected.children.forEach((node) => { //now node is a node of the current connected component
                const currentNode = new Node(currentCC.concat(node.name), true, node.size, (node.size / connected.size));
                node.children.forEach((neighbour) => {

                    //if I have not created this cut vertex I create it and then set the currentNode as neighbour
                    if(id2connectedComponents.get(currentCC.concat(neighbour.name)) == undefined){
                        const currentCutV = new Node(currentCC.concat(neighbour.name) , false, 1);
                        currentCutV.addNeighbour(currentNode);
                        id2connectedComponents.set(currentCutV.getId(),currentCutV);
                        //currentNode.addNeighbour(currentCutV);
                    }
                    else{id2connectedComponents.get(currentCC.concat(neighbour.name)).addNeighbour(currentNode);
                       // currentNode.addNeighbour(id2connectedComponents.get(neighbour.name));
                    }
                    //adding the current cutvertex tho this Biconnected block
                    currentNode.addNeighbour(id2connectedComponents.get(currentCC.concat(neighbour.name)));

                });
                graph.addNode(currentNode);
                id2BiconnectedBlocks.set(currentNode.getId(),currentNode);

                //creating the tree structure for this biconnected component (if it exist)
                if(node.tree !== undefined){
                    const newTree = new Graph();
                    const idTreeNode2sons = new Map();
                    node.tree.forEach((treeNode) => {
                        const idRoot = currentNode.getId().concat(treeNode.name);
                        //in this case I use the type Graph for representing a tree because the tree is unrooted and for not replicating the method (ultilities)
                        let currentTreeNode = idTreeNode2sons.get(idRoot);
                        if(currentTreeNode === undefined){
                            currentTreeNode = new Node(idRoot, false, node.size, 0);
                            idTreeNode2sons.set(idRoot, currentTreeNode);
                        }
                        treeNode.children.forEach((treeNodeSons) => {
                            const id = currentNode.getId().concat(treeNodeSons.name);
                            let currentSon = idTreeNode2sons.get(id);
                            if(currentSon === undefined) {
                                currentSon = new Node(id, false, node.size, 0);
                                idTreeNode2sons.set(id, currentSon);
                            }
                            currentTreeNode.addNeighbour(currentSon); //add this son to the neighbour of the current root
                            newTree.addEdge(new Edge(currentTreeNode,currentSon));//insert this edge in the SPQRTree
                        });
                        newTree.addNode(currentTreeNode);//insert the current node in the SPQRTree

                    });
                    currentNode.setSPQRTree(newTree);
                }
                //--------------------------------end of the SPQRTree creating------------------------------------------
            });

            id2connectedComponents.forEach((value, key, map) => {
                graph.addNode(value);
                //for the edges
                value.getNeighbours().forEach((neighbour) => {
                    const currentEdge = new Edge(neighbour, value);
                    graph.addEdge(currentEdge);
                })
            });
            connectedComponentsGraph.addConnecredComponent(graph);
        });

        // for the calculation of the root for each cc, as the node that has the greatest number of childrens
        connectedComponentsGraph.calculateRootForAllCC();

        return connectedComponentsGraph;
    }


}