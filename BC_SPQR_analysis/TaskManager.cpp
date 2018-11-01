//ogdf
#include <ogdf/basic/Graph.h>
#include <ogdf/layered/DfsAcyclicSubgraph.h>
//connected component
#include <ogdf/fileformats/GraphIO.h>
//biconnected component
#include <ogdf/decomposition/BCTree.h>
#include <ogdf/decomposition/DynamicBCTree.h>
//triconnected component
#include <ogdf/decomposition/SPQRTree.h>
#include <ogdf/decomposition/DynamicSPQRTree.h>

//this application
#include "GraphComposition.h"
#include "GraphCompositionJSON.h"
#include "GraphLoader.h"
#include "TaskManager.h"
#include "TriconnectedAnalysis.h"
#include "BCTreeJSON.h"


/*create a simple task manager for wich you can execute all the possible tasks with this app*/
TaskManager::TaskManager(){
	G = new Graph();
	GL = new GraphLoader(get_graph_from_keyboard());
	G = GL->getGraph();
	delete GL;
}

/*for execute all the tasks with one command*/
TaskManager::TaskManager(int isThisCreationLazy){

	G = new Graph();
	GL = new GraphLoader(get_graph_from_keyboard());
	G = GL->getGraph();
	delete GL;
	
	composition = new GraphComposition(G, isThisCreationLazy);

	//create Json
	createJson(isThisCreationLazy);

	//set the importance for each node of each spqrtree
	ta = new TriconnectedAnalysis();
	ta->setTriconnectedComponents(composition->getSPQRTree());
	ta->calculateTheImportancesOfTheTriconnectedGraphs();

}

void TaskManager::createTheCompositionStructure(){
	composition = new GraphComposition(G);
	cout << "cc fatte" << endl;
}

void TaskManager::createJsonForBCTrees(){
	//for first I create the BCTrees component in the us new structure (GraphComposition)
	composition->BCconstructor();
	cout << "bicomponents fatte" << endl;
	//now I have to create the specific json with the BCTreeJSON class
	bcJSON = new BCTreeJSON(composition);
}

void TaskManager::createJson(int isThisCreationLazy){
	GCJ = new GraphCompositionJSON(isThisCreationLazy);
	GCJ->setGraphComposition(composition);
	GCJ->createJSON(graphName);
}



//take the name of the graph by input
string TaskManager::get_graph_from_keyboard(){
	cout << "insert a graph name" << endl;
	cin >> graphName;
	return graphName + ".gml";
}



