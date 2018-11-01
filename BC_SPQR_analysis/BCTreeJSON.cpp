

#include "BCTreeJSON.h"



BCTreeJSON::BCTreeJSON(GraphComposition *composition){
	json = new StructureJSON();
	//for each connected components i have a BCTree
	for (int i = 0; i < composition->getConnectedComponent()->numberOfCCs(); i++){
		json->setName("cc" + to_string(i)); //need an endObject
		json->setKeyValue("size", composition->getConnectedComponent()->constGraph().numberOfEdges());
		//for all BCTree i generate the specific json
		node v;
		json->setKeyArray();
		forall_nodes(v, (*composition->getBCTree())[i]->bcTree()){
			//for all the biconnected blocks of this BCTree i save in the jml all the adjacent (cutvertexes)
			if ((*composition->getBCTree())[i]->typeOfBNode(v) == BCTree::BComp){
				json->setName("bc" + to_string(v->index()));
				json->setKeyValue("size", (*composition->getBCTree())[i]->numberOfEdges(v));
				adjEntry adj;
				//start array json
				json->setKeyArray();
				forall_adj(adj, v){
					node current = adj->twinNode();
					json->setName("cutv" + to_string(current->index()));
					json->endObject(1);
				}
				json->endArray();
				json->endObject(1);
			}
			

		}
		json->endArray();
		json->endObject(1);
	}
	json->saveJSON("prova");
}