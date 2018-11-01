class DrawAlgorithm{

    constructor(weight, height){
        this.weight = weight;
        this.height = height;
    }

    _drawBCTreeRandom(graph){
        graph.getConnectedComponent(0).getNodes().forEach((node) => {
            let positionX = (this.weight - 7) * Math.random();
            let positionY = (this.height - 7) * Math.random();
            (positionX < 14) ? positionX = 14 : positionX;
            (positionY < 14) ? positionY = 14 : positionY;
            node.setX(positionX);
            node.setY(positionY);
        });

        console.log(graph);
       // this.renderer = new Renderer(graph.getConnectedComponent(0).getNodes());

    }

    /*first simple draw:
    *       - assign the coordinateto the root ( x = weight/2;  y = slice)
    *       - divide the space for the number of the chidren
    *       - call recursively on the children
    *
    *       permette di avere la root sempre al centro dei figli però non si occupa tutto lo spazio a disposizione, nell'assegnare lo spazio a disposizione
    *       non si fa differenza tra figli che hanno un sottoalbero enorme da figli foglie.
    *       quando lo spazio sulle x del padre è molto piccolo questo si ripercuote sui figli facendoli sovrapporre e non si capisce bene la struttura ad albero
    * */
    _drawTree(root, weight, height = 100, y, vv = 2){
        root.setVisitedValue(vv);
        let offset = (weight[1] - weight[0]);
        root.setX((offset/2) + weight[0]);
        root.setY((root.root === true) ? height * 0.5 : height * y - height * 0.5);
        root.setVisited();
        let spaceX = offset;
        (root.root === true) ?  spaceX /= root.getNeighbours().length : spaceX /= (root.getNeighbours().length-1);
        let currentValue = 0;
        root.getNeighbours().forEach((neighbour, i, array) => {
            neighbour.setVisitedValue(vv);
            if(neighbour.getVisited() !== true) {
                this._drawTree(neighbour, [spaceX * (currentValue) + weight[0], spaceX * (currentValue + 1) + weight[0]], height, y + 1, 2);
                currentValue++;
            }
        });
    }

    _drawBCTreeDivideSpaceSmartly(root, weight, height, y, vv = 3){
        root.setVisitedValue(vv);
        let offset = (weight[1] - weight[0]);
        root.setX((offset/2) + weight[0]);
        root.setY((root.root === true) ? height * 0.5 : height * y - height * 0.5);
        root.setVisited();
        let currentMinVal = weight[0];
        let sum = root.getSumOfSizes();
        root.getNeighbours().forEach((neighbour, i, array) => {
            neighbour.setVisitedValue(vv);
            if(neighbour.getVisited() !== true){
                const maxWeight = ((offset * neighbour.getSize() / sum) + currentMinVal);
                this._drawBCTreeDivideSpaceSmartly(neighbour, [currentMinVal, maxWeight], height, y + 1);
                currentMinVal = maxWeight ;
            }

        });
    }

    _drawBCTreeBetterMaxSubTreeNodes(root, weight, height, y, vv = 3){
        root.setVisitedValue(vv);
        let offset = (weight[1] - weight[0]);
        root.setX((offset/2) + weight[0]);
        root.setY((root.root === true) ? height * 0.5 : height * y - height * 0.5);
        root.setVisited();
        let currentMinVal = weight[0];
        let sum = root.subtreeNodes - root.getNeighbours().length;
        root.getNeighbours().forEach((neighbour, i, array) => {
            neighbour.setVisitedValue(vv);
            if(neighbour.getVisited() !== true){
                const maxWeight = ((offset * neighbour.subtreeNodes / sum) + currentMinVal);
                this._drawBCTreeDivideSpaceSmartly(neighbour, [currentMinVal, maxWeight], height, y + 1);
                currentMinVal = maxWeight ;
            }

        });
    }

    _orderTheVectorOfChildren(vectorOfLeaf, vectorOfNotLeaf, sum, sumTot, currentMinVal, offset, length){
        let returningOrderedArray = [];
        let minForCalculatingTheNewInterval = currentMinVal;
        vectorOfNotLeaf.forEach((neighbour) => {
            if(neighbour.getVisited() !== true){
                const numberOfLeafBeforeAndAfter = Math.floor((neighbour.subtreeNodes - neighbour.getNeighbours().length) / sum * length);
                let before = Math.floor(numberOfLeafBeforeAndAfter / 2);
                const current = vectorOfLeaf.splice(0, numberOfLeafBeforeAndAfter);
                current.forEach((node) => {
                    if (before === 0) {
                        returningOrderedArray.push(neighbour);
                    }
                    returningOrderedArray.push(node);
                    neighbour.weightForChildren += offset * node.subtreeNodes / sumTot;
                    before--;
                });
                if(current.length === 0 || numberOfLeafBeforeAndAfter === 0) returningOrderedArray.push(neighbour);
                neighbour.weightForChildren += offset * neighbour.subtreeNodes / sumTot;
                neighbour.minWidth = minForCalculatingTheNewInterval;
                minForCalculatingTheNewInterval += neighbour.weightForChildren;
            }
        });
        const a = vectorOfNotLeaf.length+length;
        returningOrderedArray.splice.apply(returningOrderedArray, [returningOrderedArray.length, 0].concat(vectorOfLeaf));
        return returningOrderedArray;
    }

    _drawBCTreeReusingSpaceAfterLeaf(root, weight, height, y, deep, vv = 3){
        root.setVisitedValue(vv);
        let offset = (weight[1] - weight[0]);
        root.setX((offset/2) + weight[0]);
        root.setY((root.root === true) ? ((height[1] * 0.5) + height[0]) : (height[1] * y - height[1] * 0.5) + height[0]);
        root.setVisited();
        let currentMinVal = weight[0];
        let sum = 0, sumTot = root.subtreeNodes;
        let cutVertexToLeaf = [], cutVertexNotToLeaf = [], correctOrdering = [], length = 0;

        //if((root.root === true) ? root.getNeighbours().length : root.getNeighbours().length-1 > 0) {
            root.getNeighbours().forEach((neighbour) => {
                neighbour.setVisitedValue(vv);
                if (neighbour.getVisited() !== true) {
                    if (neighbour.deep <= 2) {
                        cutVertexToLeaf.push(neighbour);
                    }
                    else {
                        cutVertexNotToLeaf.push(neighbour);
                        sum += neighbour.subtreeNodes - neighbour.getNeighbours().length;
                    }
                }
            });
            length = cutVertexToLeaf.length;
            if (length > 0 && cutVertexNotToLeaf.length > 0) {
                correctOrdering = this._orderTheVectorOfChildren(cutVertexToLeaf, cutVertexNotToLeaf, sum, sumTot, currentMinVal, offset, length);
            }
            else correctOrdering = root.getNeighbours();
            let tramanda = false, minchildrenWeigth = 0;
            if (root.weightForChildren > offset && root.minWidth < currentMinVal) {
                if(root.isABNode === true) {
                    currentMinVal = root.minWidth;
                    offset = root.weightForChildren;
                }
                else{
                    tramanda = true;
                    minchildrenWeigth = root.minWidth;
                }
            }
            correctOrdering.forEach((neighbour) => {
                if (neighbour.getVisited() !== true) {
                    if(tramanda === true){
                        const father = ((root.weightForChildren * neighbour.subtreeNodes / (sumTot)));
                        neighbour.weightForChildren = (father > neighbour.weightForChildren) ? father : neighbour.weightForChildren;
                        neighbour.minWidth = minchildrenWeigth;
                        minchildrenWeigth += neighbour.weightForChildren;
                    }
                    const maxWeight = ((offset * neighbour.subtreeNodes / (sumTot)) + currentMinVal);
                    //console.log(" offset " + offset + " nodes " + neighbour.subtreeNodes + " sumTot " + sumTot);
                    this._drawBCTreeReusingSpaceAfterLeaf(neighbour, [currentMinVal, maxWeight], height, (y === 0) ? y : y + 1, deep);
                    currentMinVal = maxWeight;
                }
            });
        //}

    }

    //for sunburst explicit drawing
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

    _coordinateAssignmentToNodes(children, radiant, sliceStep, xRoot, yRoot, stepForEachLevel, deep){
        children.forEach((node) => {
            node.setX(xRoot + deep * Math.cos(radiant));
            node.setY(yRoot + deep * Math.sin(radiant));
            this._coordinateAssignmentToNodes(node.children, radiant, sliceStep/node.getNeighbours().length, xRoot, yRoot, stepForEachLevel, deep + stepForEachLevel);
            radiant += sliceStep;
        });
    }

    _sunBurstExplicitDrawing(root, weight, height){
        //calculating the sets of nodes, classifying the nodes based on their distance from the root
        //percorro i figli diretti della radice e li classifico in base alla loro altezza
        let set = this._calculateSetsOfChildren(root);
        console.log(set);

        //number of sets
        let numberOfSet = set[0].size;

        //the step for each level is defined from the radius / max deep
        //the radius = min(h,w)/2
        let radius = Math.min(weight,height) / 2;
        let stepForEachLevel = radius / numberOfSet;
        console.log(radius + " " + stepForEachLevel);

        //draw the root in the middle
        let xRoot = weight / 2;
        let yRoot = height / 2;
        root.setX(xRoot);
        root.setY(yRoot);

        //getting the keys of the map and sorting it for drawing before the
        //let keys = Array.from( myMap.keys() );

        //variables for assign the coordinates

        //step for each set in radianti
        let step = 6.28 / numberOfSet;

        let pieceOfSun = [0, step];
        //iterating to all the set in the map from the smallest to the biggest
        let iteratore = set[1]; // set[1] is the smallest deep in the tree from the root to the leafs
        for(iteratore = set[1]; iteratore <= set[2]; iteratore++){
            const currentSetOfChildren = set[0].get(iteratore);
            //assign the coordinates to this set of children
            if(currentSetOfChildren !== undefined) {
                let currentSliceStep = step / currentSetOfChildren.length;
                let currentRadiant = pieceOfSun[0];
                this._coordinateAssignmentToNodes(currentSetOfChildren, currentRadiant, currentSliceStep, xRoot, yRoot, stepForEachLevel, stepForEachLevel);
                pieceOfSun = [pieceOfSun[1], pieceOfSun[1] + step];
            }
        }

    }

    //------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------sunbursteye------------------------------------------------------------

    _coordinateAssignmentToNodesByEyeMethod(children, radiant, sliceStep, xRoot, yRoot, stepmin, currentStep, offset, step){

        children.forEach((node) => {
            const deep = currentStep + (Math.abs(Math.cos(radiant)) * offset);
            node.setX(xRoot + (currentStep + offset) * Math.cos(radiant + (sliceStep / 2)));
            node.setY(yRoot + currentStep * Math.sin(radiant + (sliceStep / 2)));
            this._coordinateAssignmentToNodesByEyeMethod(node.children, radiant, sliceStep/node.getNeighbours().length, xRoot, yRoot, stepmin, currentStep + stepmin, offset + step, step);
            radiant += sliceStep;
        });

    }

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

    _sunburstEye(root, weight, height){
        let set = this._calculateSetsOfChildren(root);
        console.log(set);
        let numberOfSet = set[0].size;
        let radiusMin = Math.min(weight,height) * 0.66;
        let radiusMax = Math.max(weight, height) * 0.5;

        let stepmin = radiusMin / (set[2] * 0.76);
        let stepmax = radiusMax / set[2];
        let offset = stepmax - stepmin;

        //draw the root in the middle
        let xRoot = weight / 2;
        let yRoot = height * 0.66;
        root.setX(xRoot);
        root.setY(yRoot);

        const sumOfTheLogaritmicNumberOfNodeForEachSet = this._sumOfLogaritmicValues(set[0]);

        let pieceOfSun = [0, 0];

        let iteratore = set[1]; // set[1] is the smallest deep in the tree from the root to the leafs
        for(iteratore = set[1]; iteratore <= set[2]; iteratore++){

            const currentSetOfChildren = set[0].get(iteratore);
            //assign the coordinates to this set of children
            //potrebbe essere che la lunghezza passa da 2 a 4 quindi una fila può mancare, se non manca lavoro
            if(currentSetOfChildren != undefined) {
                let step = 6.28 * (Math.log10(this._sumOfTheSubNodes(currentSetOfChildren)) / sumOfTheLogaritmicNumberOfNodeForEachSet);
                pieceOfSun[1] += step;
                let currentSliceStep = (step - 0.052) / currentSetOfChildren.length;
                let currentRadiant = pieceOfSun[0];

                this._coordinateAssignmentClassifyingInOrderToTheNumerAndColorOfTheChildrens(currentSetOfChildren, currentRadiant, currentSliceStep, xRoot, yRoot, stepmin, stepmin, offset, offset);
                //this._coordinateAssignmentDividingTheSpaceEgualForEachNodeInALevel(currentSetOfChildren, currentRadiant, step - 0.052, xRoot, yRoot, stepmin, stepmin, offset, offset);
                pieceOfSun[0] = pieceOfSun[1];
            }
        }
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

    //divide the space of each level in base of the number of the node in that level
    _coordinateAssignmentDividingTheSpaceEgualForEachNodeInALevel(setOfChildren, startRadiant, stepInRadiant, xRoot, yRoot, stepMinRadius, currentMinRadius, stepMaxRadius, currentMaxRadius){
        const numberOfNodeToEachLevel = new Map();
        this._calculateTheNumberOfNodesToEachLevel(setOfChildren, numberOfNodeToEachLevel, 0);

        this._proveToCalculateNewMap(numberOfNodeToEachLevel,startRadiant);
        this._assignCoordinate(setOfChildren, startRadiant, stepInRadiant / numberOfNodeToEachLevel.get(0)[0], stepInRadiant, numberOfNodeToEachLevel, 0, xRoot, yRoot, stepMinRadius, currentMinRadius, stepMaxRadius, currentMaxRadius);
    }

    _proveToCalculateNewMap(map, v){
        for(const key of map.keys()) {
            map.set(key, [map.get(key), v]);
            console.log("v " + v);
        }
    }

    _assignCoordinate(setOfChildren, startRadiant, stepForEachNode, stepInRadiant, numberOfNodesToEachLevel, level, xRoot, yRoot, stepMinRadius, currentMinRadius, stepMaxRadius, currentMaxRadius){
        let orderedSon = this._orderTheChildrenMultipleBlackSingleBlackSingleRedMultipleRedCutVertex(setOfChildren);
        let startSon = 0;
        if(numberOfNodesToEachLevel.get(level + 1) !== undefined) {
            startSon = numberOfNodesToEachLevel.get(level + 1)[1];
            console.log(startSon);
        }
        orderedSon.forEach((node) => {
            const deep = currentMinRadius + (Math.abs(Math.cos(startRadiant)) * currentMaxRadius);
            node.setX(xRoot + (currentMinRadius + currentMaxRadius) * Math.cos(startRadiant + (stepForEachNode / 2)));
            node.setY(yRoot + currentMinRadius * Math.sin(startRadiant + (stepForEachNode / 2)));
            if(node.getNeighbours().length > 0) {
                this._assignCoordinate(node.children, startSon, stepInRadiant / numberOfNodesToEachLevel.get(level + 1)[0], stepInRadiant, numberOfNodesToEachLevel, level + 1, xRoot, yRoot, stepMinRadius, currentMinRadius + stepMinRadius, stepMaxRadius, stepMaxRadius + currentMaxRadius);
                startSon += (stepInRadiant / numberOfNodesToEachLevel.get(level + 1)[0]) * node.getNeighbours().length;
                numberOfNodesToEachLevel.get(level + 1)[1] = startSon;
            }
            startRadiant += stepForEachNode;
        });
    }

    _calculateTheNumberOfNodesToEachLevel(nodes, nNodeEachLevel, depth){
        let currentNumber = nNodeEachLevel.get(depth);
        (currentNumber != undefined) ? currentNumber += nodes.length : currentNumber = nodes.length;
        nNodeEachLevel.set(depth, currentNumber);
        nodes.forEach((n) => {
            if(n.getNeighbours().length > 0)
                this._calculateTheNumberOfNodesToEachLevel(n.getNeighbours(), nNodeEachLevel, depth + 1);
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
                //this._coordinateAssignmentDividingTheSpaceEgualForEachNodeInALevel(currentSetOfChildren, currentStartRadiant, step - 0.052, xRoot, yRoot, allStepsForRadius[0], allStepsForRadius[0], allStepsForRadius[2], allStepsForRadius[2]);
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
    drawBCTree(graph){
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
                console.log(deep);
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
                    //this._drawBCTreeDivideSpaceSmartly(root, [minWeight, currentWeight], (currentHeight * percentage / root.deep) , 1);
                    //this._drawBCTreeReusingSpaceAfterLeaf(root, [minWeight, currentWeight], [minHeight, (currentHeight * percentage / root.deep)], 1, root.deep);
                    //this._drawTree(root, [minWeight, currentWeight], (currentHeight * percentage / root.deep), 1);
                    //this._drawBCTreeRandom(graph);
                    this._sunburstSelfAdaptingSnail(root, currentWeight, currentHeight);
                    //this._sunburstEye(root, currentWeight, currentHeight);
                    //this._sunBurstExplicitDrawing(root, currentWeight, currentHeight);
                    minHeight += currentHeight * percentage;
                }
                else {
                    //this._drawBCTreeReusingSpaceAfterLeaf(root, [minWeight, currentWeight * percentage + minWeight], [minHeight-100, 0], 0, root.deep);
                    //this._drawBCTreeReusingSpaceAfterLeaf((root, [minWeight, currentWeight * percentage + minWeight], currentHeight, 1));
                    minWeight += currentWeight * percentage;

                }
                //this._drawBCTreeDivideSpaceSmartly(root, [20, this.weight - 30], (this.height / deep[0]) , 1);
                //this._drawTree(root, [20, this.weight - 30], (this.height / deep) * 0.5 , (this.height / deep));
           // }
        });

        console.log("le coordinate sono state assegnate a tutti i nodi");
    }



}