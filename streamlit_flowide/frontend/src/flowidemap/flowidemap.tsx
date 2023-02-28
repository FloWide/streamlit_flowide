import React,{ ReactNode } from "react";
import { ComponentProps } from "streamlit-component-lib";
import {control, easyButton, LatLng, LatLngExpression, Map as LeafletMap, marker, Point, tileLayer, TileLayerOptions} from 'leaflet';
import { PixelCRSOptions,PixelCRS, MatrixTransformation } from "@flowide/leaflet-custom-transformation";
import {vec2,mat3} from 'gl-matrix';
import { loadModule } from "../javascript-hook";

interface MapProps {
    master?:boolean;
    syncService:MapSyncService;
    id: string;
    config: PixelCRSOptions;
    initialView?: [number, number, number];
}

type TileOptions = {urlTemplate:string} & TileLayerOptions;


interface FloWideMapConfig {
    tileLayers:TileOptions[];
    masterMap:PixelCRSOptions;
    initialView?: [number, number, number];
    maps: {
        [key:string]: PixelCRSOptions['unitToPixel']
    }
}

type Args = Record<string,any>;

interface FloWideMapModule {

    setup(
        masterMap: L.Map,
        overLayMap: L.Map,
        maps: Map<string,L.Map>,
        args: Args
    ): void;

    onRerun(args: Args): void;
}

function isFloWideMapModule(obj: any): obj is FloWideMapModule {
    return !!obj && typeof obj === 'object' && !Array.isArray(obj) && 'setup' in obj && 'onRerun' in obj;
}


class MapSyncService {


    // this one's on the top, use it for events
    public master: LeafletMap;

    // this one's on the bottom, use it for tilelayers and such
    public first: LeafletMap;

    public maps: Map<string,LeafletMap> = new Map<string,LeafletMap>();

    private toSync: LeafletMap[] = [];

    setMaster(map:LeafletMap) {
        this.master = map;
        this.maps.set("master",map);
        for(const m of this.toSync) {
            this.master.sync(m,{
                offsetFn: (center: LatLng,zoom: number,refMap: LeafletMap,targetMap: LeafletMap) => {
                    const targetInvMatrix = (targetMap.options.crs.transformation as MatrixTransformation).inverseTransformationMatrix;
                    const refMatrix = (refMap.options.crs.transformation as MatrixTransformation).transformationMatrix
                    const vec = vec2.fromValues(center.lat,center.lng);

                    vec2.transformMat3(vec,vec,refMatrix);
                    vec2.transformMat3(vec,vec,targetInvMatrix);

                    return new LatLng(vec[0],vec[1]);
                }
            });
        }
        this.toSync = [];
        if(!this.first) {
            this.first = map;
        }
    }

    addSlave(slave: LeafletMap,id: string) {
        this.maps.set(id,slave);
        if(!this.first) {
            this.first = slave;
        }
        if(!this.master) {
            this.toSync.push(slave);
            return;
        }
        this.master.sync(slave,{});
    }
}

export class FloWideMap<S = {}> extends React.PureComponent<ComponentProps,S>  {

    private mapSyncService = new MapSyncService();

    private mapModule: FloWideMapModule = null;

    private container: React.RefObject<HTMLDivElement>;

    constructor(props:any) {
        super(props);
        this.container = React.createRef();
    }

    async componentDidMount() {
        this.mapModule = await loadFlowideMapModule(this.props?.args?.module);
        const config: FloWideMapConfig = this.props.args["config"];
        
        config.tileLayers.forEach((tile) => {
            tileLayer(tile.urlTemplate,tile).addTo(this.mapSyncService.first);
        });

        const btn = easyButton({
            states: [{
                    stateName: 'to-fullscreen',        // name the state
                    icon:      'fas fa-expand',               // and define its properties
                    title:     'fullscreen',      // like its title
                    onClick:(btn, map) => {       // and its callback
                        this.container.current?.requestFullscreen();
                        btn.state('to-normal');    // change state on click!
                    }
                }, {
                    stateName: 'to-normal',
                    icon:      'fas fa-compress',
                    title:     'normal',
                    onClick: (btn, map) => {
                        document.exitFullscreen();
                        btn.state('to-fullscreen');
                    }
            }]
        }).addTo(this.mapSyncService.master);

        this.container.current.onfullscreenchange = (ev) => {
            if (document.fullscreenElement)
                btn.state('to-normal');
            else
                btn.state('to-fullscreen');

        }

        if(this.mapModule)
            this.mapModule.setup(this.mapSyncService.master,this.mapSyncService.first,this.mapSyncService.maps,getCleanArgs(this.props.args));
    }

    render(): ReactNode {
        if(this.mapModule)
            this.mapModule.onRerun(getCleanArgs(this.props.args));
        const config: FloWideMapConfig = this.props.args["config"] 
        return (
            <div 
                style={{
                    height:'600px',
                    width:'100%',
                    position:'relative'
                }}
                ref={this.container}
            >
                {Object.entries(config.maps).length > 0 && 
                    <MapComponent
                        key={'first'}
                        syncService={this.mapSyncService}
                        id={'first'}
                        config={config.masterMap}
                    />
                }
                {Object.entries(config.maps).map(([id,c],index) => {
                    return (
                        <MapComponent
                            key={id} 
                            syncService={this.mapSyncService}
                            id={id}
                            config={{...config.masterMap,unitToPixel:c}}
                        />
                    )
                })}
                <MapComponent
                    key={'master'} 
                    master={true}
                    syncService={this.mapSyncService}
                    id={'master'}
                    initialView={config.initialView}
                    config={config.masterMap}
                />
            </div>
        )
    }
}


class MapComponent extends React.Component<MapProps> {

    private container: React.RefObject<HTMLDivElement>;

    private map: LeafletMap;

    constructor(props:any) {
        super(props);
        this.container = React.createRef<HTMLDivElement>();
    }

    componentDidMount() {
        const crs = new PixelCRS(this.props.config)
        this.map = new LeafletMap(
            this.container.current,
            {
                attributionControl:false,
                crs: crs as any,
                maxZoom:crs.zoomLevel()
            }
        );
        this.map.setView([0,0],4);
        if (!this.props.master) {
            disableMapControls(this.map);
            this.props.syncService.addSlave(this.map,this.props.id);
        } else {
            if (this.props.initialView)
                this.map.setView([this.props.initialView[0],this.props.initialView[1]],this.props.initialView[2])
            else
                this.map.setView(crs.getMaxBounds().getCenter(),0);
            this.props.syncService.setMaster(this.map);
        }
        
        this.container.current.setAttribute('flowide-map-id',this.props.id);
    }

    render() : ReactNode {
        return (
            <div
                ref={this.container}
                style={{
                    height:'100%',
                    width:'100%',
                    position:'absolute',
                    top:0,
                    left:0,
                }}
            >
            </div>
        )
    }
}

function disableMapControls(map: LeafletMap) {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    map.zoomControl.remove();
    if (map.tap) map.tap.disable();
}

async function loadFlowideMapModule(dataString: string) : Promise<FloWideMapModule> {
    const parsed = await loadModule<{default:FloWideMapModule} | FloWideMapModule >(dataString)
    if (isFloWideMapModule(parsed)) {
        return parsed;
    } else if(parsed?.default && isFloWideMapModule(parsed.default)) {
        return parsed.default;
    } else {
        return null
    }
}


function getCleanArgs(args: Args) {
    const props = ["module"]
    const newArgs = {...args};
    for(const p of props) {
        delete newArgs[p]
    }
    return newArgs;
}