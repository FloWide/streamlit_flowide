import { ComponentProps } from "streamlit-component-lib";
import React,{RefObject, ReactNode} from 'react'
import {CustomCRS, ImageOverlayExcludeCRS, MatrixTransformationConfig} from '@flowide/leaflet-custom-transformation'
import {Map as LeafletMap,map as createMap, LatLngBounds,easyButton, TileLayer} from 'leaflet';
import 'leaflet-easybutton';
import RasterCoords from "./RasterCoords";

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
}


class MapBaseComponent<S = {}> extends React.PureComponent<ComponentProps,S> {

    protected container: RefObject<HTMLDivElement>;

    protected map: LeafletMap | null = null;

    protected imageOverlay: ImageOverlayExcludeCRS | null = null;

    protected tileLayer: TileLayer | null = null;

    protected isRendered: boolean = false;

    protected componentReady: boolean = false;

    protected previousConfig: string = '';


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

    protected renderLogic() {
        const config = this.props.args["config"];

        if(config && this.isNewConfig(config)) {
            this.isRendered = false;
            this.setupMap(config);
            this.componentReady = this.setupComponent();
            this.previousConfig = JSON.stringify(config);
        } else if(!this.isRendered && this.previousConfig) {
            this.setupMap(JSON.parse(this.previousConfig));
            this.componentReady = this.setupComponent();
        } else {
            if (this.componentReady)
                this.processData();
            else
                this.componentReady = this.setupComponent();
        }
    }

    protected setupMap(config:MapConfig) {
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

       

    protected setupComponent() : boolean {
        throw Error("Not implemented");
    }

    protected processData() {
        throw Error("Not implemented");
    }


    protected isNewConfig(config:MapConfig) : boolean {
        return JSON.stringify(config) !== this.previousConfig;
    }
}

export default MapBaseComponent