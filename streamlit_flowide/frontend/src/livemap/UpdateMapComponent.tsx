import { LivePlay } from "@flowide/leaflet-playback-plugin";
import { Control, ControlOptions, Map as LeafletMap } from "leaflet";
import { loadModule } from "../javascript-hook";
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


interface UpdateMapHook {
    setup(map:LeafletMap,livemap: LivePlay,args: Record<string,any>): Promise<void>;

    message(patch:JsonPatch):void;
}

function isUpdateMapHook(obj: any): obj is UpdateMapHook {
    return 'setup' in obj && 'message' in obj;
}

interface HooksModule {
    default: UpdateMapHook | {
        [key:string]: UpdateMapHook
    }
}

interface JsonPatch {
    op:string;
    path:string;
    value:any;
    times:{
        dcmTime:number;
        measurement:number;
        sensorsetbuffer:number;
    }
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
        container.style.opacity = '0';
        container.onmouseover = () => container.style.opacity = '1';
        container.onmouseout = () => container.style.opacity = '0';
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

    private connectionLabel: ConnectionLabel = new ConnectionLabel();

    private websockets = new Map<string,WS.JSONWebsocketClient<JsonPatch[]>>();

    private hooksModule: HooksModule = null;

    protected async setupComponent() : Promise<boolean> {
        if(!this.map) return false;

        this.connectionLabel.addTo(this.map);
        this.connectionLabel.setLabel('Disconnected','red');

        
        const urls = this.props.args["ws_urls"];

        for(const url of urls) {
            const socket = new WS.JSONWebsocketClient(url);
            socket
                .on('message',(ev) => this.onWebsocketMessage(url,ev))
                .on('open',() => this.connectionLabel.setLabel('Connected','green'))
                .on('reconnecting',() => this.connectionLabel.setLabel('Reconnecting','yelow'))
                .on('close',() => this.connectionLabel.setLabel('Disconnected','red'))
                .on('error',() => this.connectionLabel.setLabel('Disconnected','red'));
            console.debug("Creating websocket connection for",url);
            this.websockets.set(url,socket);
        }
    
        this.readdLiveMap()
        this.hooksModule = await loadModule(this.props.args["js_hook"]);
        if(isUpdateMapHook(this.hooksModule.default)) {
            await this.hooksModule.default.setup(this.map,this.livemap,this.props.args)
        } else {
            for(const [key,value] of Object.entries(this.hooksModule.default)) {
                await value.setup(this.map,this.livemap,this.props.args);
            }
        }
        return true;
    }

    protected async processData() {
        
    }

    private readdLiveMap() {
        if(this.livemap)
            this.livemap.removeFrom(this.map);

        this.livemap = new LivePlay(null,null);
        this.livemap.addTo(this.map);

        const data: InitData[] = this.props.args["init_data"];
        
        if(!data) return;

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

    private onWebsocketMessage(fromUrl:string,ev: CustomEvent<WS.Data<JsonPatch[]>>) {
        if(!this.livemap) return;
        for(const patch of ev.detail.data) {

            if(isUpdateMapHook(this.hooksModule.default)) {
                this.hooksModule.default.message(patch);
            } else {
                this.hooksModule.default[fromUrl].message(patch);
            }

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