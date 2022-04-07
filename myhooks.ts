


class MyHooks implements Hooks.UpdateMapHook {

    constructor(private hookName: string) {}

    setup(map: L.Map, livemap: L.Playback.LivePlay, args: Record<string, any>): Promise<void> {
        console.log("setup from",this.hookName);
        return null;
    }
    message(patch: Hooks.JsonPatch): void {
        console.log("message from",this.hookName,patch);
    }

}


export default {
    'wss://pss-gw.flowide.net/v2/locations/websocket':new MyHooks("locations-hook"),
    'wss://pss-gw.flowide.net/v2/generalTags/websocket':new MyHooks("tags-hook")
};