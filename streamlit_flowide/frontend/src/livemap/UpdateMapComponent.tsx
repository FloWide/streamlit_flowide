import { LivePlay } from "@flowide/leaflet-playback-plugin";
import { Control, ControlOptions, Map as LeafletMap } from "leaflet";
import MapBaseComponent from "../MapBaseComponent";
import { WS } from "./WebsocketClient";


interface InitData {
    markerId:string;
    tags: string[];
    position:[number,number];
    color?: string;
    icon?: string;
    scale?: number;
}

interface JsonPatch {
    op:string;
    path:string;
    value:any;
}

class ConnectionLabel extends Control {
    options:ControlOptions = {
        position:'topright'
    }

    private label: HTMLHeadingElement;

    onAdd(map: LeafletMap): HTMLElement {
        const container = document.createElement('div');
        this.label = document.createElement('h4');
        container.appendChild(this.label);
        container.style.padding = '5px'
        return container;
    }

    setLabel(text: string,color?: string) {
        this.label.innerText = text.toUpperCase();
        if(color)
            this.label.style.color = color;
    }
}


export default class UpdateMapComponent extends MapBaseComponent {

    private livemap:LivePlay | null = null;

    private tagMarkerMap = new Map<string,string>();

    private websocket: WS.JSONWebsocketClient<JsonPatch[]> = null;

    private connectionLabel: ConnectionLabel = new ConnectionLabel();

    protected setupComponent() : boolean {
        if(!this.map) return false;

        this.connectionLabel.addTo(this.map);
        this.connectionLabel.setLabel('Disconnected','red');
        this.websocket = new WS.JSONWebsocketClient(this.props.args['ws_url']);
        this.websocket
            .on('message',this.onWebsocketMessage.bind(this))
            .on('open',() => this.connectionLabel.setLabel('Connected','green'))
            .on('reconnecting',() => this.connectionLabel.setLabel('Reconnecting','yelow'))
            .on('close',() => this.connectionLabel.setLabel('Disconnected','red'))
            .on('error',() => this.connectionLabel.setLabel('Disconnected','red'));
        this.readdLiveMap()
        return true;
    }

    protected processData(): void {
        const data: InitData[] = this.props.args["init_data"];
        
        if(!data) return;

        this.readdLiveMap();
        this.tagMarkerMap.clear();

        for(const el of data) {
            this.livemap.onEvent({
                event:{
                    name:'CREATE_MARKER',
                    args:{
                        id:el.markerId,
                        position:el.position,
                        scale:el.scale,
                        trackColor:el.color
                    }
                },
                time:0,

            });
            if(el.icon)
                this.livemap.onEvent({
                    time:0,
                    event:{
                        name:'FLO_ICON_CHANGE_MAIN_ICON',
                        args:{
                            id:el.markerId,
                            to:el.icon
                        }
                    }
                });
            if(el.color)
                this.livemap.onEvent({
                    time:0,
                    event:{
                        name:'FLO_ICON_CHANGE_MAIN_COLOR',
                        args:{
                            id:el.markerId,
                            to:el.color
                        }
                    }
                });

            for(const tag of el.tags)
                this.tagMarkerMap.set(tag,el.markerId);
        }
    }

    private readdLiveMap() {
        if(this.livemap)
            this.livemap.removeFrom(this.map);

        this.livemap = new LivePlay(null,null);
        this.livemap.addTo(this.map);
    }

    private onWebsocketMessage(ev: CustomEvent<WS.Data<JsonPatch[]>>) {
        if(!this.livemap) return;
        for(const patch of ev.detail.data) {
            const splits = patch.path.split('/');
            const tagId = splits[1];
            const property = splits[2];

            if(!this.tagMarkerMap.has(tagId)) continue;

            let pos = [0,0];
            if(property === 'position')
                pos = patch.value;
            else if(property === 'gpsPosition')
                pos = this.gpsTransformation(patch.value);
            else 
                continue;

            this.livemap.onEvent({
                time:0,
                event:{
                    name:'MOVE_MARKER',
                    args:{
                        id:this.tagMarkerMap.get(tagId),
                        position:pos
                    }
                }
            });
        }
    }
}