import * as L from 'leaflet';
import {Streamlit} from 'streamlit-component-lib';
import * as Playback from '@flowide/leaflet-playback-plugin';
import * as Transformation from '@flowide/leaflet-custom-transformation';

export async function loadModule<T extends {}>(code: string): Promise<T> {
    return (await import( /* webpackIgnore: true */ code)) as T;
}

export function bootstrapGlobals() {
    L["Playback"] = Playback;
    L["CustomTransform"] = Transformation;
    window["L"] = L;
    window["Streamlit"] = Streamlit;
}