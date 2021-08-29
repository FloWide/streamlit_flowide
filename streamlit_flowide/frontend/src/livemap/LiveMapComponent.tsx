import { LivePlay } from "@flowide/leaflet-playback-plugin";
import { PlayBackElement } from "@flowide/leaflet-playback-plugin/dist/plugin/playback/PlaybackData";
import MapBaseComponent from "../MapBaseComponent";



class LiveMapComponent extends MapBaseComponent {
    private livemap:LivePlay | null = null;


    setupComponent() : boolean {
        if(!this.map) return false;

        if(this.livemap)
            this.livemap.removeFrom(this.map);
        
        let cluster = this.props.args["cluster"] || false;

        this.livemap = new LivePlay(null,null,cluster);
        this.livemap.addTo(this.map);


        return true;
    }

    processData() {
        const data = this.props.args["live_data"]

        if(!data || data.length === 0 || !this.livemap) return;
        try {
            data.forEach((d:PlayBackElement) => {
                this.livemap?.onEvent(d);
            });
        } catch(e) {
            console.error(e);
        }
        
    }
}

export default LiveMapComponent;