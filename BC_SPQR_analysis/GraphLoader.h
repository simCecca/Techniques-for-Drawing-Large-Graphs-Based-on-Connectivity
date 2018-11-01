#ifndef GRAPHLOADER_H
#define GRAPHLOADER_H

class GraphLoader{

	private:
		ogdf::Graph *G;

	public:
		GraphLoader(string name);
		ogdf::Graph *getGraph(){	return G; }

};



#endif