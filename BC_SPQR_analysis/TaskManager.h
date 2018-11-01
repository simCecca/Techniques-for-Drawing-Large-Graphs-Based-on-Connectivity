#ifndef TASKMANAGER_H
#define TASKMANAGER_H

//this application
#include "GraphComposition.h"
#include "GraphCompositionJSON.h"
#include "GraphLoader.h"
#include "TaskManager.h"
#include "TriconnectedAnalysis.h"
#include "BCTreeJSON.h"

using namespace std;
using namespace ogdf;

class TaskManager{

	private:
		//methods
		string get_graph_from_keyboard();
		

		//for loading the graph
		GraphLoader *GL;
		//starting graph
		Graph *G;

		//for create the tree structure (connected-biconnected-triconnected / components)
		GraphComposition *composition;
		int isLazy;
		
		//for the json
		GraphCompositionJSON *GCJ;

		//for the spqrtree's node importance
		TriconnectedAnalysis *ta;

		//BCTree draw
		BCTreeJSON *bcJSON;

		//GraphName
		string graphName;

	public:
		TaskManager();
		TaskManager(int);

		//methods
		
		//for the json
		void createJsonForBCTrees();
		void createTheCompositionStructure();
		void createJson(int);
			
		//

};

#endif