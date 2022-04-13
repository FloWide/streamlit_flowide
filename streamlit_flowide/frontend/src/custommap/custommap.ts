import MapBaseComponent from "../MapBaseComponent";
import {Map as LeaftetMap} from 'leaflet';
import { loadModule } from "../javascript-hook";

type Args = Record<string,any>

interface CustomComponentJs {

    setupMap(container: HTMLDivElement,args?: Args): Promise<LeaftetMap>;

    setupComponent(args?: Args): Promise<boolean>;

    onRerun(args?: Args): void;
}


class CustomMapComponent extends MapBaseComponent {

    private jsCode: CustomComponentJs = null;

    protected override async setupMap() {
        if(!this.container.current) return;
        try{
            this.jsCode = (await loadModule<{default:CustomComponentJs}>(this.props.args["js_code"])).default;
        }catch(e) {
            console.error(e)
            return;
        }
        
        try{
            this.map = await this.jsCode.setupMap(this.container.current,this.getCleanArgs());
        } catch(e) {
            console.error(e);
            this.isRendered = false;
            return;
        }

        if(!this.map) {
            this.isRendered = false;
            return;
        }
        this.isRendered = true;
        
    }

    protected override async setupComponent() {
        if(!this.jsCode) return false;
        try {
            return (await this.jsCode.setupComponent(this.getCleanArgs()));
        }catch(e) {
            console.error(e);
            return false;
        }
    }

    protected override async processData() {
        try {
            this.jsCode.onRerun(this.getCleanArgs())
        } catch(e) {
            console.error(e);
        }
    }

    private getCleanArgs() : Args {
        const args = this.props.args;
        delete args["js_code"];
        return args;
    }

}



export default CustomMapComponent;