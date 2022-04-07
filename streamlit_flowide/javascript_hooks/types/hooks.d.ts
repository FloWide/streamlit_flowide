

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

export interface UpdateMapHook {
    setup(map:L.Map,livemap: L.Playback.LivePlay,args: Record<string,any>): Promise<void>;

    message(patch:Hooks.JsonPatch):void;
}