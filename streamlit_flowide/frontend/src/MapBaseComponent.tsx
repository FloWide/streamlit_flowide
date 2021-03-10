import { StreamlitComponentBase,ComponentProps } from "streamlit-component-lib";
import React,{RefObject, ReactNode} from 'react'
import {CustomCRS, ImageOverlayExcludeCRS, MatrixTransformationConfig} from '@flowide/leaflet-custom-transformation'
import {Map as LeafletMap,map as createMap, LatLngBounds} from 'leaflet';

interface MapConfig {
    map:MatrixTransformationConfig & {lowerBounds:[number,number];upperBounds:[number,number]};
    image:string;
}


class MapBaseComponent<S = {}> extends React.PureComponent<ComponentProps,S> {

    protected container: RefObject<HTMLDivElement>;

    protected map: LeafletMap | null = null;

    protected imageOverlay: ImageOverlayExcludeCRS | null = null;

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
        console.log("setup map")
        const lowerBounds = config.map?.lowerBounds ?? [-20,-20];
        const upperBounds = config.map?.upperBounds ?? [20,20];

        if(this.container.current) {

            if(this.map) {
                this.map.off();
                this.map.remove();
            }

            this.map = createMap(this.container.current,{
                crs:(new CustomCRS(config.map) as any)
            });
            this.map.setView([0,0],4);
            this.imageOverlay = new ImageOverlayExcludeCRS(config.image,new LatLngBounds(lowerBounds,upperBounds))
            this.imageOverlay.addTo(this.map)
            this.isRendered = true;
        }
        console.log(this.isRendered)
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