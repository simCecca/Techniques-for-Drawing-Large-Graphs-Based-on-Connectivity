class DrawAlgorithm{

    constructor(weight, height){
        this.weight = weight;
        this.height = height;
    }


    //------------------------------------------------------------------------------------------------------------------

    _calculateSetsOfChildren(root){
        let set = new Map(), currArray = [], max = 0, min = 500;
        root.getNeighbours().forEach((child) => {
            currArray = set.get(child.deep);
            (currArray === undefined) ? currArray = [child] : currArray.push(child);
            set.set(child.deep,currArray);
            currArray = [];
            if(max < child.deep) max = child.deep;
            if(min > child.deep) min = child.deep;
        });
        return [set,min,max];
    }


    //------------------------------------------------------------------------------------------------------------------
    _sumOfTheSubNodes(nodes){
        let s = 0;
        nodes.forEach(node => {
            s += node.subtreeNodes + 1;
        });
        return s;
    }

    _sumOfLogaritmicValues(map){
        console.log(map);
        let sum = 0;
        for(let value of map.values()) {
            const current = this._sumOfTheSubNodes(value);
            sum += Math.log10(current);
        }
        return sum;
    }

    //------------------------------------------------------------------------------------------------------------------
    //---------------------------------------sunbursteye with cutvertex, removing the elemtary biconnected blocks-------

    _orderTheChildrenMultipleBlackSingleBlackSingleRedMultipleRedCutVertex(childrens){
        let mapOfElements = new Map();
        childrens.forEach((node) => {
            let sons = node.getNeighbours();
            let currValue = [], currentNode = [node];
            //if have a single son, this node is classifying as single red or single black
            if(sons.length === 1){
                let kindOfSet = "";
                (sons[0].isBlack) ? kindOfSet = "singleBlack" : (sons[0].isABNode) ? kindOfSet = "singleRed" : kindOfSet = "singleCutV";
                currValue = mapOfElements.get(kindOfSet);
                mapOfElements.set(kindOfSet, (currValue != undefined) ? currValue.concat(currentNode) : currentNode);
            }
            else { //have multiple son
                let currentKey = "multipleBlack";
                let otherSon = [], cutV = [];
                node.getNeighbours().forEach((n) => {
                    if(!n.isBlack && n.isABNode)
                        currentKey = "multipleRed";
                    (!n.isABNode) ? cutV.push(n) : otherSon.push(n);
                });

                node.children = otherSon.concat(cutV);
                currValue = mapOfElements.get(currentKey);
                mapOfElements.set(currentKey, (currValue != undefined) ? currValue.concat(currentNode) : currentNode);
            }
        });
        let resultingArray = [];
        ["multipleBlack", "singleBlack", "singleRed", "multipleRed", "singleCutV"].forEach((key) => {
            let currArray = mapOfElements.get(key);
            if(currArray != undefined) resultingArray = resultingArray.concat(currArray);
        });
        return resultingArray;
    }

    //assign the space dividing the father space for the number of the childrens
    _coordinateAssignmentClassifyingInOrderToTheNumerAndColorOfTheChildrens(setOfChildren, startRadiant, sliceStepInRadiant, xRoot, yRoot, stepMinRadius, currentMinRadius, stepMaxRadius, currentMaxRadius){
        let orderedSon = this._orderTheChildrenMultipleBlackSingleBlackSingleRedMultipleRedCutVertex(setOfChildren);
        orderedSon.forEach((node) => {
            const deep = currentMinRadius + (Math.abs(Math.cos(startRadiant)) * currentMaxRadius);
            node.setX(xRoot + (currentMinRadius + currentMaxRadius) * Math.cos(startRadiant + (sliceStepInRadiant / 2)));
            node.setY(yRoot + currentMinRadius * Math.sin(startRadiant + (sliceStepInRadiant / 2)));
            this._coordinateAssignmentClassifyingInOrderToTheNumerAndColorOfTheChildrens(node.children, startRadiant, sliceStepInRadiant/node.getNeighbours().length, xRoot, yRoot, stepMinRadius, currentMinRadius + stepMinRadius, stepMaxRadius, stepMaxRadius + currentMaxRadius);
            startRadiant += sliceStepInRadiant;
        });
    }
    //------------------------------------------------------------------------------------------------------------------
    //sunburst self adapting space, this is a snail with radius magior when the portion have less level

    _sunburstSelfAdaptingSnail(root, weight, height){
        let set = this._calculateSetsOfChildren(root);
        console.log(set);
        let numberOfSet = set[0].size;

        let radiusMin = Math.min(weight,height) * 0.5;
        let radiusMax = Math.max(weight, height) * 0.5;




        //draw the root in the middle
        let xRoot = weight / 2;
        let yRoot = height * 0.5;
        root.setX(xRoot - 10);
        root.setY(yRoot + 15);

        const sumOfTheLogaritmicNumberOfNodeForEachSet = this._sumOfLogaritmicValues(set[0]);//per dividere i radianti in maniera logaritmica

        let pieceOfSun = [0, 0];

        let iteratore = set[1] - 1; // set[1] is the smallest deep in the tree from the root to the leafs
        let firstVal = set[1];
        while(iteratore !== undefined && iteratore <= set[2]){
            let currentSetOfChildren = set[0].get(iteratore);
            //assign the coordinates to this set of children
            //potrebbe essere che la lunghezza passa da 2 a 4 quindi una fila può mancare, se non manca lavoro
            if(currentSetOfChildren !== undefined) {
                let allStepsForRadius = 0;
                let step = 6.28 * (Math.log10(this._sumOfTheSubNodes(currentSetOfChildren)) / sumOfTheLogaritmicNumberOfNodeForEachSet);
                pieceOfSun[1] += step;
                let currentSliceStep = (step - 0.025) / currentSetOfChildren.length;
                let currentStartRadiant = pieceOfSun[0];
                /*calculate the 4 set ov radius in this form [init, 1/3, 2/3, end] */
                let nextNumberOfLayers = this._nextKeyOfTheMap(set, iteratore);
                let nextNumberOfNodes = (set[0].get(nextNumberOfLayers) !== undefined) ? set[0].get(nextNumberOfLayers) : set[0].get(firstVal);
                allStepsForRadius = this._calculateTheRadiusForTheCurrentCone(pieceOfSun, currentSetOfChildren.length, nextNumberOfNodes.length, radiusMin, radiusMax, iteratore, nextNumberOfLayers);
                this._coordinateAssignmentLogarithmicSpiralsClassifyingInOrderToTheNumerAndColorOfTheChildrens(currentSetOfChildren, currentStartRadiant, currentSliceStep, xRoot, yRoot, allStepsForRadius[0], allStepsForRadius[0], allStepsForRadius[1], allStepsForRadius[1], allStepsForRadius);
                pieceOfSun[0] = pieceOfSun[1];
            }
            iteratore = this._nextKeyOfTheMap(set, iteratore);
        }
    }

    //assign the space dividing the father space for the number of the childrens
    _coordinateAssignmentLogarithmicSpiralsClassifyingInOrderToTheNumerAndColorOfTheChildrens(setOfChildren, startRadiant, sliceStepInRadiant, xRoot, yRoot, stepMinRadius, currentMinRadius, stepMaxRadius, currentMaxRadius, allStepForRadius){
        let orderedSon = this._orderTheChildrenMultipleBlackSingleBlackSingleRedMultipleRedCutVertex(setOfChildren);
        let minRadius = currentMinRadius, maxRadius = currentMaxRadius;
        let sequentialNumber = 0;
        orderedSon.forEach((node) => {
            if(sequentialNumber > allStepForRadius[2] && allStepForRadius[3] > 0){
                minRadius -= ((allStepForRadius[0] - allStepForRadius[3]) / (setOfChildren.length));
                maxRadius -= ((allStepForRadius[1] - allStepForRadius[4]) / (setOfChildren.length));
            }
            node.setX(xRoot + (minRadius + maxRadius) * Math.cos(startRadiant + (sliceStepInRadiant / 2)));
            node.setY(yRoot + minRadius * Math.sin(startRadiant + (sliceStepInRadiant / 2)));
            this._coordinateAssignmentClassifyingInOrderToTheNumerAndColorOfTheChildrens(node.children, startRadiant, sliceStepInRadiant/node.getNeighbours().length, xRoot, yRoot, minRadius, minRadius + minRadius, maxRadius, maxRadius + maxRadius, allStepForRadius);
            startRadiant += sliceStepInRadiant;
            sequentialNumber++;
        });
    }

    _nextKeyOfTheMap(map, iteratore){
        let currentSetOfChildren = [];
        iteratore++;
        do{
            currentSetOfChildren = map[0].get(iteratore);
            iteratore++;
        }while(currentSetOfChildren === undefined && iteratore <= map[2]);

        return (currentSetOfChildren === undefined) ? undefined : iteratore - 1;
    }

    _calculateTheRadiusForTheCurrentCone(currentStartAndEndRadiant, currentNumberOfChildren, nextNumberOfChildren, radiusMin, radiusMax, currentNumberOfLevel, nextNumberOfLevel){
        let setOfCurrentRadiant = [];
        let stepmin = (radiusMin - 9) / currentNumberOfLevel;
        let stepmax = (radiusMax - 9) / currentNumberOfLevel;
        let offset = stepmax - stepmin;

        //radius of the next cone
        let stepminNext = ((radiusMin - 9) / nextNumberOfLevel);
        let stepmaxNext = ((radiusMax - 9) / nextNumberOfLevel);
        let nextOffset = stepmaxNext - stepminNext;

        //
        let twoThirds = currentNumberOfChildren * 0;


        return [stepmin, offset, twoThirds, stepminNext, nextOffset, stepminNext, nextOffset];
    }

    //------------------------------------------------------------------------------------------------------------------
    //utilities
    _deepGraph(root,maxSize, vv = 2){
        if(root.getNeighbours().length === 0){
            root.setVisitedValue(vv);
            root.setVisited();
            root.subtreeNodes = root.getNeighbours().length;
            root.deep = 1;
            return [root.deep, root.subtreeNodes, root.getSize()];
        }
        else {
            let max = 0, currentValues = [0, 0], p = [0,0];
            root.getNeighbours().forEach((neighbour) => {
                neighbour.setVisitedValue(vv);
                if (neighbour.getVisited() === false) {
                    neighbour.setVisited();
                    p = this._deepGraph(neighbour, maxSize);
                    currentValues =[p[0], currentValues[1] + p[1]];
                    if (currentValues[0] > max) max = currentValues[0];
                    if(p[2] > maxSize) maxSize = p[2];
                }
            });
            root.subtreeNodes = currentValues[1] + 1;
            root.deep = max + 1;
            return [root.deep, root.subtreeNodes, ((root.getSize() > maxSize) ? root.getSize() : maxSize)];
        }
    }

    //main method for all kind of drawing
   async drawBCTree(graph){
        dialogueBox("coordinate assignment");
        await sleep(50);
        console.log(graph);
        let currentWeight = this.weight, currentHeight = this.height;
        let totalNumberOfNodes = 0, minWeight = 20, minHeight = 0;
        let newCC = [];
        graph.getAllComponents().forEach((connectedComponent) => {
            if(connectedComponent != undefined && connectedComponent.getNodes()[0] != undefined) {
                //delete the cutVertex
                //connectedComponent.deleteTheCutVertex();
                connectedComponent.deleteTheElementaryBlocks(5);

                newCC.push(connectedComponent);
                const root = connectedComponent.getNodes()[0];
                const deep = this._deepGraph(root, 0);
                totalNumberOfNodes += deep[1];
                connectedComponent.setMaxSize(deep[2]);
            }
        });
        newCC.sort((a,b) => {
            return b.getNodes()[0].subtreeNodes - a.getNodes()[0].subtreeNodes;
        });
        newCC.forEach((connectedComponent) => {
          //  if(connectedComponent.getNodes()[0] !== undefined) {
                let root = connectedComponent.getNodes()[0];
                let percentage = root.subtreeNodes / totalNumberOfNodes;
                if (percentage >= 0.3) {
                    root.root = true;
                   this._sunburstSelfAdaptingSnail(root, currentWeight, currentHeight);
                   minHeight += currentHeight * percentage;
                }
                else {
                  minWeight += currentWeight * percentage;

                }

        });
        dialogueBox("The coordinates have been assigned to all the nodes, now it's the renderer's job");
        await sleep(50);
        //document.getElementById("dialogText").innerHTML = "The coordinates have been assigned to all the nodes";
        console.log("The coordinates have been assigned to all the nodes");
       return;
    }
}