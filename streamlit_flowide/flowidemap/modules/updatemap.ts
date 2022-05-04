
interface InitData {
    markerId: string;
    tags: string[];
    position: [number, number];
    map: string;
    color?: string;
    icon?: string;
    scale?: number;
}



class UpdateMap implements Hooks.FloWideMap {

    protected masterMap: L.Map;

    protected maps: Map<string, L.Map>

    protected liveMaps: Map<string, L.Playback.LivePlay> = new Map();

    protected webSocketClient: WS.JSONWebsocketClient<Hooks.JsonPatch>;

    protected tagMarkerMap = new Map<string, string>();

    private gpsMap: L.Playback.LivePlay;

    private meterMap: L.Playback.LivePlay;

    setup(
        masterMap: L.Map,
        overLayMap: L.Map,
        maps: Map<string, L.Map>,
        args: Hooks.Args
    ): void {
        this.masterMap = masterMap;
        this.maps = maps;

        if (args?.ws_url) {
            this.webSocketClient = new WS.JSONWebsocketClient(args.ws_url);
            this.webSocketClient.on('message', this.onWebsocketMessage.bind(this));
        }
        this.addLiveMap(args.init_data || []);
        if(args.gps_map_key) {
            this.gpsMap = this.liveMaps.get(args.gps_map_key)
        } else {
            console.warn("gps map key not specifed, using master as gps map")
            this.gpsMap = this.liveMaps.get('master');
        }

        if(args.meter_map_key) {
            this.meterMap = this.liveMaps.get(args.meter_map_key)
        } else {
            console.warn("meter map key not specified, using master map as meter map")
            this.meterMap = this.liveMaps.get('master');
        }
    }
    onRerun(args: Hooks.Args): void {
        //
    }

    protected onWebsocketMessage(ev: CustomEvent<WS.Data<Hooks.JsonPatch[]>>) {
        for (const patch of ev.detail.data) {
            const splits = patch.path.split('/');
            const tagId = splits[1];
            const property = splits[2];

            if(!this.tagMarkerMap.has(tagId)) continue;

            const markerId = this.tagMarkerMap.get(tagId);

            if(property === 'position') {
                this.switchOrMove(this.gpsMap,this.meterMap,markerId,patch.value);
            } else if(property === 'gpsPosition') {
                this.switchOrMove(this.meterMap,this.gpsMap,markerId,patch.value);
            }
        }
    }
    
    /*
        Move the marker between two maps or just simply move it if it's already on it
    */
    protected switchOrMove(from: L.Playback.LivePlay,to: L.Playback.LivePlay,markerId: string,pos: [number,number]) {
        if(to.getMarkerById(markerId)) { // it's already on the destination map so just move it
            to.getMarkerById(markerId).setLatLng(pos)
        } else { // it's on the other map so move it over and set its position
            const marker = from.getMarkerById(markerId);
            from.removeMarker(markerId);
            to.createMarker(marker,markerId);
            marker.setLatLng(pos);

        }
    }

    private addLiveMap(initData: InitData[]) {
        this.maps.forEach((map, key) => {
            const liveMap = new L.Playback.LivePlay();
            liveMap.addTo(map);
            this.liveMaps.set(key, liveMap);
        });


        for (const data of initData) {

            if (!this.liveMaps.has(data.map)) continue;

            const livemap = this.liveMaps.get(data.map)

            livemap.onEvent({
                event: {
                    name: 'CREATE_MARKER',
                    args: {
                        id: data.markerId,
                        position: data.position,
                        scale: data.scale,
                        trackColor: data.color
                    }
                },
                time: 0,

            });
            if (data.icon)
                livemap.onEvent({
                    time: 0,
                    event: {
                        name: 'FLO_ICON_CHANGE_MAIN_ICON',
                        args: {
                            id: data.markerId,
                            to: data.icon
                        }
                    }
                });
            if (data.color)
                livemap.onEvent({
                    time: 0,
                    event: {
                        name: 'FLO_ICON_CHANGE_MAIN_COLOR',
                        args: {
                            id: data.markerId,
                            to: data.color
                        }
                    }
                });

            for (const tag of data.tags) {
                this.tagMarkerMap.set(tag, data.markerId);
            }
        }
    }

}

export default new UpdateMap();