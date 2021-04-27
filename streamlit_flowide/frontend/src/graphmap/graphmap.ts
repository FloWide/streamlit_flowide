import MapBaseComponent from "../MapBaseComponent";
import {Graph} from '@flowide/leaflet-graph-editor';
import { IGraph } from "@flowide/leaflet-graph-editor/dist/plugin/graph/Interfaces";



class GraphMapComponent extends MapBaseComponent {


    private graph:Graph<any,any,any> | null = null;

    setupComponent() : boolean {

        if(!this.map) return false;

        const data : IGraph = this.props.args["data"];

        if(!data) return false;

        if(this.graph) {
            this.graph.removeFrom(this.map);
        }

        this.graph = new Graph(data);
        this.graph.addTo(this.map);
        return false;

    }

    processData() {
        //noop
    }

}

export default GraphMapComponent