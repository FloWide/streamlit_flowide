import React from "react"
import ReactDOM from "react-dom"

import L from "leaflet";
import 'leaflet.sync'
import 'leaflet/dist/leaflet.css';
import '@flowide/leaflet-playback-plugin/dist/index.min.css';
import '@flowide/leaflet-spaghetti-plugin/dist/index.css';
import '@flowide/leaflet-graph-editor/dist/index.css';
import 'leaflet-easybutton/src/easy-button.css'
import '@fortawesome/fontawesome-free/css/all.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet-dialog/Leaflet.Dialog.css';  



import icon from 'leaflet/dist/images/marker-icon.png';
import icon2x from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import ComponentSelector from "./ComponentSelector";
import { bootstrapGlobals } from "./javascript-hook";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconRetinaUrl:icon2x,
  iconSize: [ 25, 41 ],
  iconAnchor: [ 13, 41 ],
});

L.Marker.prototype.options.icon = DefaultIcon;
bootstrapGlobals();
ReactDOM.render(
  <React.StrictMode>
    <ComponentSelector />
  </React.StrictMode>,
  document.getElementById("root")
)


declare module 'leaflet' {

  interface Map {
    sync(m:L.Map,options: any): void;
    unsync(m:L.Map): void;
    isSynced(m:L.Map): boolean;
  }

}

declare module 'leaflet-arrowheads' {

  interface SingleArrowheadOptions {
    [key:string]:any;
  }

  interface ArrowheadOptions extends L.PolylineOptions, SingleArrowheadOptions {
    [key:string]: any;
  }
}