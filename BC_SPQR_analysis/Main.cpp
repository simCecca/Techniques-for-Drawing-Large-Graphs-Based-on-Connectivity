//ogdf
#include <ogdf/basic/Graph.h>
#include <ogdf/fileformats/GraphIO.h>
#include <ogdf/basic/graph_generators.h>
//ogdf::connected_component
#include <ogdf/basic/Graph_d.h>
#include <ogdf/internal/planarity/ConnectedSubgraph.h>
//biconnected component
#include <ogdf/decomposition/BCTree.h>
#include <ogdf/decomposition/DynamicBCTree.h>
//triconnected component
#include <ogdf/decomposition/DynamicSPQRTree.h>
#include <ogdf/decomposition/DynamicSPQRForest.h>

//standard  c++
#include <iostream>
#include <list>
#include <vector>

//this project
#include "GraphLoader.h"
#include "GraphComposition.h"
#include "Windows.h"
#include "StructureJSON.h"
#include "GraphCompositionJSON.h"
#include "TaskManager.h"

//#include "json/json.h"
#include "rapidjson/document.h"
#include "rapidjson/writer.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/prettywriter.h"

//for let the permit to the server
#pragma comment(lib, "Ws2_32.lib")
//for the server
#include <httplib.h>
using namespace httplib;


using namespace rapidjson;

//stack & heap memory
//#pragma comment(linker, "/STACK:800000000")
//#pragma comment(linker, "/HEAP:800000000")

using namespace ogdf;
using namespace std;



int main()
{
	//TaskManager *tasks = new TaskManager(0);
	TaskManager *task = new TaskManager();
	task->createTheCompositionStructure();
	task->createJsonForBCTrees();

	//end of the program
	cout << "finito tutto" << endl;

	return 0;
}