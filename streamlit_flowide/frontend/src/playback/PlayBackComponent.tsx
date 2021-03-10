import MapBaseComponent from "../MapBaseComponent";
import {PlayBack, PlayControl} from '@flowide/leaflet-playback-plugin';
import { withStreamlitConnection } from "streamlit-component-lib";


class PlayBackComponent extends MapBaseComponent {

    private playback: PlayBack | null = null;

    private playbackControl: PlayControl | null = null;

    protected setupComponent() : boolean {
        const data  = this.props.args["data"] || [{
            time:1602247219471,
            event:{
                name:'CREATE_MARKER',
                args:{
                    id:'12',
                    position:[0,0]
                }
            }
          }];

        if (!this.map) return false;

        if (this.playback) 
            this.playback.removeFrom(this.map);
        
        if (this.playbackControl)
            this.map.removeControl(this.playbackControl);

        this.playback = new PlayBack(data);
        this.playbackControl = new PlayControl(this.playback);
        this.playback.addTo(this.map);
        this.playbackControl.addTo(this.map);

        return true;
        
    }

    protected processData() {
        //no
    }
}

export default PlayBackComponent;