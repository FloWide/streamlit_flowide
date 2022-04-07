import MapBaseComponent from "../MapBaseComponent";
import {Graph} from '@flowide/leaflet-graph-editor';
import { IGraph } from "@flowide/leaflet-graph-editor/dist/plugin/graph/Interfaces";
import { easyButton,Rectangle,Marker } from "leaflet";
import { Streamlit } from "streamlit-component-lib";


class GraphMapComponent extends MapBaseComponent {


    private graph:Graph<any,any,any> | null = null;

    private rectangles: Rectangle[] = [];

    private markers: Marker[] = [];

    async setupComponent() : Promise<boolean> {

        if(!this.map) return false;

        const data : IGraph = this.props.args["data"];

        const markers = this.props.args["markers"];

        const rectangles = this.props.args["rectangles"];

        if(!data) return false;
        
        if(this.graph)
            this.map.removeLayer(this.graph);

        this.rectangles.forEach((rect) => rect.removeFrom(this.map));

        this.markers.forEach((marker) => marker.removeFrom(this.map));
        


        if (rectangles)
            rectangles.forEach((rect: any) => {
                const r = new Rectangle([rect.lowerBounds,rect.upperBounds],{color:rect.color,fillColor:rect.color});
                this.rectangles.push(r);
                r.bindTooltip(rect.tooltip);
                r.addTo(this.map);
            });

        if(markers)
            markers.forEach((marker: any) => {
                const m = new Marker(marker.pos);
                m.bindTooltip(marker.tooltip);
                m.addTo(this.map);
                this.markers.push(m);
            })

        this.graph = new Graph(data);
        this.graph.addTo(this.map);

        easyButton('fas fa-check',() => {
            Streamlit.setComponentValue(JSON.parse(JSON.stringify(this.graph)));
        },'Finish','graph-finish').addTo(this.map);
        return true;

    }

    async processData() {
        //no
    }

}

export default GraphMapComponent