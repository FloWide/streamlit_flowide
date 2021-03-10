import { StreamlitComponentBase, withStreamlitConnection } from "streamlit-component-lib";
import React from 'react';


import PlayBackComponent from './playback/PlayBackComponent';
import HeatMapComponent from './heatmap/HeatMapComponent';
import SpaghettiComponent from './spaghetti/SpaghettiComponent' 
import LiveMapComponent from "./livemap/LiveMapComponent";


class ComponentSelector extends StreamlitComponentBase {


    render(): React.ReactNode {
        console.log("component select render")
        return this.getComponent(this.props.args["component"]);
    }

    private getComponent(name:string) : React.ReactNode {

        switch (name) {
            case 'streamlit_flowide_playback':
                return (
                    <PlayBackComponent 
                        args={this.props.args}
                        disabled={this.props.disabled}
                        width={this.props.width}
                    />
                )
            case 'streamlit_flowide_heatmap':
                return (
                    <HeatMapComponent 
                        args={this.props.args}
                        disabled={this.props.disabled}
                        width={this.props.width}
                    />
                )
            case 'streamlit_flowide_spaghetti':
                return (
                    <SpaghettiComponent 
                        args={this.props.args}
                        disabled={this.props.disabled}
                        width={this.props.width}
                    />
                )

            case 'streamlit_flowide_livemap':
                return (
                    <LiveMapComponent 
                        args={this.props.args}
                        disabled={this.props.disabled}
                        width={this.props.width}
                    />
                )

                
            default:
                return (
                    <div style={{height:'100px'}}>
                        <h1>Component selection error for {name}</h1>
                    </div>
                )
                
        }
    }
}


export default withStreamlitConnection(ComponentSelector);