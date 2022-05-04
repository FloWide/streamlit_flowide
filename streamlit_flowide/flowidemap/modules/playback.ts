



class PlayBack implements Hooks.FloWideMap {


    private playbacks: Map<string,L.Playback.PlayBack> = new Map();

    private playControl: L.Playback.PlayControl;

    private maps: Map<string,L.Map>;

    private masterMap: L.Map;

    setup(
        masterMap: L.Map, 
        overLayMap: L.Map, 
        maps: Map<string, L.Map>, 
        args: Hooks.Args
    ): void {
        this.maps = maps;
        this.masterMap = masterMap;

        this.addPlayBacks(args);
        this.addControl();
    }
    onRerun(args: Hooks.Args): void {
        if(!args?.auto_refresh) return;

        this.playControl.remove();
        this.playbacks.forEach((value,key) => value.remove());

        this.addPlayBacks(args);
        this.addControl();

    }

    private addPlayBacks(args: Hooks.Args) {
        this.maps.forEach((value,key) => {
            if(args && key in args) {
                const p = new L.Playback.PlayBack(args[key])
                this.playbacks.set(key,p);
                p.addTo(value);
            }
        })
    }

    private addControl() {
        const playBacks = Array.from(this.playbacks.values())
        if(playBacks.length > 0) {
            this.playControl = new L.Playback.PlayControl(...playBacks);
            this.playControl.addTo(this.masterMap);
        }
    }

}


export default new PlayBack();