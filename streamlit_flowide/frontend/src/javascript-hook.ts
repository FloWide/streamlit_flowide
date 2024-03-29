import * as L from 'leaflet';
import {Streamlit} from 'streamlit-component-lib';
import * as Playback from '@flowide/leaflet-playback-plugin';
import * as Transformation from '@flowide/leaflet-custom-transformation';
import { WS } from './livemap/WebsocketClient';
import { switchFromMapCoords } from './flowidemap/mapcoord-helper';

export async function loadModule<T extends {}>(code: string): Promise<T> {
    try{
        return (await import( /* webpackIgnore: true */ code)) as T;
    } catch(e) {
        console.error("Module load error:",e.message);
        return null;
    }
}

export function bootstrapGlobals() {
    L["Playback"] = Playback;
    L["CustomTransform"] = Transformation;
    window["L"] = L;
    window["Streamlit"] = Streamlit;
    window["WS"] = WS;
    window["Hooks"] = {
        switchFromMapCoords:switchFromMapCoords
    }
}