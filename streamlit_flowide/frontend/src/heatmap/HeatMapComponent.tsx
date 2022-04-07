import MapBaseComponent from "../MapBaseComponent";
import {HeatLayer} from '@flowide/leaflet-flo-heat';



class HeatMapComponent extends MapBaseComponent {

    private heatLayer:HeatLayer | null = null;


    async setupComponent() : Promise<boolean> {
        if(!this.map) return false;

        const data = this.props.args["data"] || [];
        const options = this.props.args["options"] || null;

        if(this.heatLayer)
            this.heatLayer.removeFrom(this.map);

        this.heatLayer = new HeatLayer(data,options);
        this.heatLayer.addTo(this.map);
        return false;
    }

    async processData() {
        //no
    }

}

export default HeatMapComponent