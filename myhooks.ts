


class MyHooks implements Hooks.UpdateMapHook {

    constructor(private hookName: string) {}

    setup(map: L.Map, livemap: L.Playback.LivePlay, args: Record<string, any>): Promise<void> {
        console.log("setup from",this.hookName);
        console.log(args);
        return null;
    }
    message(patch: Hooks.JsonPatch): void {
        console.log("message from",this.hookName,patch);
    }

}


export default new MyHooks('');