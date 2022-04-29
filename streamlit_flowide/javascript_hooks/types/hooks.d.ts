

export as namespace Hooks;

export interface JsonPatch {
    op:string;
    path:string;
    value:any;
    times:{
        dcmTime:number;
        measurement:number;
        sensorsetbuffer:number;
    }
}

export type Args = Record<string,any>

export interface UpdateMapHook {
    setup(map:L.Map,livemap: L.Playback.LivePlay,args: Args): Promise<void>;

    message(patch:Hooks.JsonPatch):void;

    onRerun?(args?: Args): void;
}



export interface CustomMap {

    setupMap(container: HTMLDivElement,args?: Args): Promise<L.Map>;

    setupComponent(args?: Args): Promise<boolean>;

    onRerun(args?: Args): void;
}