import MapBaseComponent from "../MapBaseComponent";
import {Graph} from '@flowide/leaflet-graph-editor';
import { IGraph } from "@flowide/leaflet-graph-editor/dist/plugin/graph/Interfaces";
import { easyButton } from "leaflet";
import { Streamlit } from "streamlit-component-lib";



class GraphMapComponent extends MapBaseComponent {


    private graph:Graph<any,any,any> | null = null;

    setupComponent() : boolean {

        if(!this.map) return false;


        const data : IGraph = this.props.args["data"];

        if(!data) return false;

        this.graph = new Graph(data);
        this.graph.addTo(this.map);

        easyButton('fas fa-check',() => {
            Streamlit.setComponentValue(JSON.parse(JSON.stringify(this.graph)));
        },'Finish','graph-finish').addTo(this.map);
        return true;

    }

    processData() {
        const data : IGraph = this.props.args["data"];

        if(!data || !this.map) return;

        if(this.graph) {
            this.map?.removeLayer(this.graph);
        }

        this.graph = new Graph(data);
        this.graph.addTo(this.map);

    }

}

export default GraphMapComponent