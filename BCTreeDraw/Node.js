class Node{

    constructor(id, bNode, size, importance = -1){//todo: if I'm a node of an SPQRTree I'm not a bNode and also a cutvertex, so remove from here  the bNode
        this.x = 0;
        this.y = 0;

        this.name = id;
        //this.name = this.name.concat(size);
        this.children = [];
        this.importance = importance;

        this.isABNode = bNode;
        this.visited = 0;
        this.visitedValue = 1;
        this.root = false;
        this.size = size;
        this.subtreeNodes = 0;
        this.weightForChildren = 0;
        this.minWidth = 0;
        this.dimension = 5;
        this.isBlack = false;
        //there is another parameter that is the spqrtree graph of this biconnected component
    }

    addNeighbour(neighbour){
        this.children.push(neighbour);
    }

    getSize(){
        return this.size;
    }

    getId(){
        return this.name;
    }

    getNeighbours(){
        return this.children;
    }

    getVisited(){
        return (this.visited === this.visitedValue);
    }

    getVisitedValue(){
        return this.visitedValue;
    }

    getImportance(){
        return this.importance;
    }

    getSumOfSizes(){
        let sum = 0;
        this.children.forEach((node) => {
            node.setVisitedValue(3);
            if(node.getVisited() !== true)
                sum += node.getSize();
        });
        return sum;
    }

    /*to the question: when is it better to refine the SPQRTree? I think the answer is now, after it's assignment*/
    setSPQRTree(tree){
        this.spqrTree = tree;
        this.spqrTree.getUtilities().processinOfAnSPQRTreeFromAnUnrootedTreeToARootedTree(this.spqrTree);
    }

    getSPQRTree(){
        return this.spqrTree;
    }

    setX(x){
        this.x = x;
    }

    setY(y){
        this.y = y;
    }
    setVisited(){
        this.visited = this.visitedValue;
    }

    setVisitedValue(visitedValue){
        this.visitedValue = visitedValue;
    }

    setIsBlack(value){
        this.isBlack = value;
    }

}