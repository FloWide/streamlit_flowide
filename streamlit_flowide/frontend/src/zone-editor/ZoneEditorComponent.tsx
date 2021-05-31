import '@geoman-io/leaflet-geoman-free';
import 'leaflet-dialog';
import MapBaseComponent from "../MapBaseComponent";
import L,{PM,Map as LeafletMap, LatLng, easyButton, LeafletEvent, LayerGroup, Polygon} from 'leaflet';
import { Streamlit } from 'streamlit-component-lib';
import 'leaflet-easybutton';
import {createPatch} from 'rfc6902';


//extra type declaration
declare module 'leaflet' {
    namespace PM {
        interface DrawEvent extends LeafletEvent {
            shape:PM.SUPPORTED_SHAPES;
        }

        export type DrawEventHandler = (event:DrawEvent) => void;
    }

    interface Evented {
        on(type:'pm:create' | 'pm:edit' | 'pm:remove',handler:PM.DrawEventHandler,context?:any):this;
    }

    interface Dialog {
        addTo:(map:Map)=>this;
        open:()=>this;
        close:()=>this;
        destroy:()=>this;
        setLocation:(loc:[number,number])=>this;
        setSize:(size:[number,number])=>this;
        lock:()=>this;
        unlock:()=>this;  
        freeze:()=>this;  
        unfreeze:()=>this;  
        hideClose:()=>this;  
        showClose:()=>this;
        hideResize:()=>this;  
        showResize:()=>this;
        setContent:(content:string | Function | HTMLElement)=>this;
        update:()=>this;
        getElement:()=>HTMLElement;  
    }

    namespace control {
        interface DialogOptions {
            size?: [ number,number];
            minSize?: [ number,number];
            maxSize?: [ number,number];
            anchor?: [ number,number];
            position?: string;
            initOpen?: boolean;
        }

        function dialog(options?:control.DialogOptions):Dialog;
    }
}



interface ZoneModel {
    name:string;
    vertices:Array<[number,number]>;
    height?:[number,number];
}


class ZoneEditorComponent extends MapBaseComponent {


    private toolbarOptions:PM.ToolbarOptions = {
        drawMarker:false,
        drawPolygon:true,
        drawPolyline:false,
        drawRectangle:false,
        cutPolygon: false,
        drawCircle:false,
        drawCircleMarker:false,
    }

    private zones:{[key:string]:ZoneModel} = {};

    private originalZones:{[key:string]:ZoneModel} = {};

    private zoneLayer:LayerGroup = new LayerGroup();

    private inputDialog:InputDialog | null = null;

    setupComponent(): boolean {

        if(!this.map) return false;
        
        this.map.pm.setGlobalOptions({...this.map.pm.getGlobalOptions(),layerGroup:this.zoneLayer});
        this.zoneLayer.addTo(this.map);

        this.map.pm.addControls(this.toolbarOptions);
        this.map.on('pm:create',this.onCreate.bind(this));
        this.inputDialog = new InputDialog(this.map);

        easyButton('fas fa-check',() => {
            Streamlit.setComponentValue([
                createPatch(this.originalZones,this.zones),
                this.zones
            ]);
        },'Finish').addTo(this.map);

        return true;

    }

    processData() {
        const data: {[key:string]:ZoneModel} = this.props.args["data"];
        if(data) {
            this.zoneLayer.clearLayers();
            this.originalZones = JSON.parse(JSON.stringify(data));//deep copy
            this.zones = data;

            

            Object.values(this.zones).forEach((z:ZoneModel) => {
                const poly = new Polygon(z.vertices.map(v => new LatLng(v[0],v[1])));
                poly.bindTooltip(z.name);
                poly.addTo(this.zoneLayer);
                (poly as any).__name = z.name;
                poly.on('pm:edit',this.onEdit.bind(this));
                poly.on('pm:remove',this.onRemove.bind(this));
                poly.on('contextmenu',this.onEditParameters.bind(this));
            })
        }
    }

    private async onCreate(event:PM.DrawEvent) {
        if(event.shape !== 'Polygon') return;

        const result = await this.inputDialog?.open();
        if (result) {
            const zone:ZoneModel = {
                name:result.name,
                vertices:this.getVertices(event.layer),
                height:result.height,
            }

            this.zones[zone.name] = zone;
            event.layer.__name = result.name;
            event.layer.on('pm:edit',this.onEdit.bind(this));
            event.layer.on('pm:remove',this.onRemove.bind(this));
            event.layer.on('contextmenu',this.onEditParameters.bind(this));
            event.layer.bindTooltip(result.name);
        }
    }

    private onEdit(event:PM.DrawEvent) {
        if(event.shape !== 'Polygon') return;

        const name = event.layer.__name;
        const zone = this.zones[name];
        if(zone) {
            zone.vertices = this.getVertices(event.layer);
        }
    }

    private onRemove(event:PM.DrawEvent) {
        if(event.shape !== 'Polygon') return;

        const name = event.layer.__name;
        delete this.zones[name];
    }

    private async onEditParameters(event:LeafletEvent) {
        const name = event.target.__name;

        if(!name) return;

        const zone = this.zones[name];

        const dialogResult = await this.inputDialog?.open(name,zone?.height)

        if(dialogResult && zone) {
            zone.name = dialogResult.name;
            zone.height = dialogResult.height;
            event.target.bindTooltip(zone.name);
            delete this.zones[name];
            this.zones[zone.name] = zone;
        }

    }

    private getVertices(layer:any) : Array<[number,number]> {
        const vertices: Array<[number,number]> = layer._latlngs[0].map((latlng:LatLng) => [latlng.lat,latlng.lng]);
        vertices.push(vertices[0]);
        return vertices;
    }
}

interface DialogResult {
    name:string;
    height:[number,number];
}
    
class InputDialog { 

    private dialog: L.Dialog;

    private nameInput:HTMLInputElement;
    private heightLowInput:HTMLInputElement;
    private heightHighInput:HTMLInputElement;
    private cancelButton:HTMLButtonElement;
    private submitButton:HTMLButtonElement;

    constructor(map:LeafletMap) {
        this.dialog = L.control.dialog({position:'topleft',size:[400,250],initOpen:false}).setContent(`
        <div class="container p-2 d-flex flex-column">
        <h3 id="title">Zone</h3>
        
        <div class="input-group">
          <span class="input-group-text w-25">Name</span>
          <input id="name-input" type="text" class="form-control">
        </div>
        
        <div class="input-group">
          <span class="input-group-text w-25">Height</span>
          <input id="height-input-low" type="number" placeholder="Low" class="form-control">
          <input id="height-input-high" type="number" placeHolder="High" class="form-control">
        </div>
        <div class="container d-flex flex-row w-100 my-1 p-2 justify-content-center">
          <button id="cancel-button" type="button" class="btn btn-secondary">Cancel</button>
          <span class="flex-fill"></span>
          <button id="submit-button" type="button" class="btn btn-primary">Save</button>
        </div>
      </div>
        `).addTo(map);
        this.dialog.lock();

        const el = this.dialog.getElement();
        this.nameInput = el.querySelector('input#name-input') as HTMLInputElement;
        this.heightLowInput = el.querySelector('input#height-input-low') as HTMLInputElement;
        this.heightHighInput = el.querySelector('input#height-input-high') as HTMLInputElement;
        this.cancelButton = el.querySelector('button#cancel-button') as HTMLButtonElement;
        this.submitButton = el.querySelector('button#submit-button') as HTMLButtonElement;
    }

    async open(name?:string,height?:[number,number]) : Promise<DialogResult | null> {
        this.nameInput.value = "";
        this.heightHighInput.value = "";
        this.heightLowInput.value = "";
        if(name)
            this.nameInput.value = name;
        if(height) {
            this.heightLowInput.value = height[0].toString();
            this.heightHighInput.value = height[1].toString();
        }
        this.dialog.open();
        return new Promise((resolve,reject) => {

            this.cancelButton.onclick = () => {
                this.dialog.close();
                resolve(null);
            };

            this.submitButton.onclick = () => {

                if(!this.nameInput.value || !this.heightHighInput.value || !this.heightLowInput.value) return;
                this.dialog.close();
                resolve({
                    name:this.nameInput.value,
                    height:[Number(this.heightLowInput.value),Number(this.heightHighInput.value)]
                });
            };

        });
    }
}



export default ZoneEditorComponent