import { ComponentProps } from "streamlit-component-lib";
import React,{RefObject, ReactNode} from 'react'
import {Array3x3, CustomCRS, ImageOverlayExcludeCRS, MatrixTransformationConfig} from '@flowide/leaflet-custom-transformation'
import {Map as LeafletMap,map as createMap, LatLngBounds,easyButton, TileLayer} from 'leaflet';
import 'leaflet-easybutton';
import RasterCoords from "./RasterCoords";
import {mat3,vec2} from 'gl-matrix';
import isEqual from 'lodash.isequal';

interface TileLayerConfig {
    imgSize: [number,number];
    urlTemplate: string;
    tileSize?: number;
}

interface MapConfig {
    map:MatrixTransformationConfig & {lowerBounds:[number,number];upperBounds:[number,number]};
    image:string;
    height?:string;
    tileLayer: TileLayerConfig;
    gpsTransform: Array3x3;
}


export default class MapBaseComponent<S = {}> extends React.PureComponent<ComponentProps,S> {

    protected container: RefObject<HTMLDivElement>;

    protected map: LeafletMap | null = null;

    protected imageOverlay: ImageOverlayExcludeCRS | null = null;

    protected tileLayer: TileLayer | null = null;

    protected isRendered: boolean = false;

    protected componentReady: boolean = false;

    protected mapConfig: MapConfig = null;

    protected gpsTransformMatrix: mat3 = mat3.create();


    constructor(props:any) {
        super(props);
        this.container = React.createRef<HTMLDivElement>();
    }

    componentDidMount() {
        this.renderLogic();
    }

    render() : ReactNode {
        this.renderLogic();        
        return (
            <div 
                ref={this.container}
                style={{height:'600px',width:'100%'}}
            >
            </div>
        )
    }

    protected async renderLogic() {
        const config = this.props.args["config"];

        if(config && this.isNewConfig(config)) {
            this.isRendered = false;
            this.mapConfig = config;
            this.setupMap(config);
            this.componentReady = await this.setupComponent();
        } else if(!this.isRendered && this.mapConfig) {
            this.setupMap(this.mapConfig);
            this.componentReady = await this.setupComponent();
        } else {
            if (this.componentReady)
                this.processData();
            else
                this.componentReady = await this.setupComponent();
        }
    }

    protected async setupMap(config:MapConfig) {
        const lowerBounds = config.map?.lowerBounds ?? [-20,-20];
        const upperBounds = config.map?.upperBounds ?? [20,20];

        if(this.container.current) {

            if(config.height)
                this.container.current.style.height = config.height;

            if(this.map) {
                this.map.off();
                this.map.remove();
            }

            this.map = createMap(this.container.current,{
                crs:(new CustomCRS(config.map) as any),
                attributionControl: false,
                maxZoom:12
            });
            this.mapConfig = config;

            if(config.gpsTransform)
                this.gpsTransformMatrix = fromArray3x3(config.gpsTransform)
            else
                this.gpsTransformMatrix = mat3.create();

            if(config.image) {
                this.imageOverlay = new ImageOverlayExcludeCRS(config.image,new LatLngBounds(lowerBounds,upperBounds))
                this.imageOverlay.addTo(this.map)
                this.map.fitBounds(this.imageOverlay.getBounds())
            }

            if(config.tileLayer) {
                const rc = new RasterCoords(this.map,config.tileLayer.imgSize[0],config.tileLayer.imgSize[1],config.tileLayer.tileSize);
                this.map.setMaxZoom(rc.zoomLevel());
                this.map.setView(rc.unproject([
                    config.tileLayer.imgSize[0],
                    config.tileLayer.imgSize[1]
                ]
                ),2)
                this.tileLayer = new TileLayer(config.tileLayer.urlTemplate,{
                    noWrap:true,
                    bounds:rc.getMaxBounds(),
                    maxNativeZoom:rc.zoomLevel()
                });
                this.tileLayer.addTo(this.map);
            }

            this.isRendered = true;
            easyButton({
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
            }).addTo(this.map);
        }
    }

       

    protected async setupComponent() : Promise<boolean> {
        throw Error("Not implemented");
    }

    protected async processData() {
        throw Error("Not implemented");
    }


    protected isNewConfig(config:MapConfig) : boolean {
        return !isEqual(config,this.mapConfig);
    }

    protected gpsTransformation(gps: [number,number]) {
        const vec = vec2.fromValues(gps[1],gps[0]);
        vec2.transformMat3(vec,vec,this.gpsTransformMatrix);
        return [vec[0],vec[1]];
    }
}


function fromArray3x3(arr:Array3x3) : mat3 {
    return mat3.fromValues(
        arr[0][0],arr[1][0],arr[2][0],
        arr[0][1],arr[1][1],arr[2][1],
        arr[0][2],arr[1][2],arr[2][2]
    );
}