//ogdf
#include <ogdf/basic/Graph.h>
#include <ogdf/basic/graph_generators.h>
#include <ogdf/layered/DfsAcyclicSubgraph.h>

#include <ogdf/fileformats/GraphIO.h>

//standard
#include <iostream>

#include "GraphLoader.h"

using namespace ogdf;
using namespace std;

//costruttore
GraphLoader::GraphLoader(string name){
	G = new Graph();
	if (!GraphIO::readGML(*G, name))
		std::cerr << "Could not loadd "<< name << std::endl;
	else
		cout << " NODES: " << G->numberOfNodes() << "    EDGES: " << G->numberOfEdges() << endl;
}
	