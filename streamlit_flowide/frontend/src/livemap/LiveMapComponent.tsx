import { LivePlay } from "@flowide/leaflet-playback-plugin";
import { PlayBackElement } from "@flowide/leaflet-playback-plugin/dist/plugin/playback/PlaybackData";
import MapBaseComponent from "../MapBaseComponent";

declare type DelayedPlayBackElement = PlayBackElement & {delay?:number};

class AsyncQueue<T> {
    private promises: Promise<T>[];
    private resolvers: ((t: T) => void)[];

    constructor() {
        this.resolvers = [];
        this.promises = [];
    }

    private add() {
        this.promises.push(new Promise(resolve => {
        this.resolvers.push(resolve);
        }));
    }

    enqueue(t: T) {
        if (!this.resolvers.length) this.add();
        const resolve = this.resolvers.shift();
        resolve(t);
    }

    dequeue() {
        if (!this.promises.length) this.add();
        const promise = this.promises.shift()!;
        return promise;
    }
}


class LiveMapComponent extends MapBaseComponent {
    private livemap:LivePlay | null = null;


    private queue: AsyncQueue<DelayedPlayBackElement[]>;

    async setupComponent() : Promise<boolean> {
        if(!this.map) return false;

        if(this.livemap)
            this.livemap.removeFrom(this.map);
        this.livemap = new LivePlay(null,null);
        this.livemap.addTo(this.map);

        this.queue = new AsyncQueue();
        this.queueWork();

        return true;
    }

    async processData() {
        const data = this.props.args["live_data"]

        if(!data || data.length === 0 || !this.livemap) return;
        this.queue.enqueue(data);
    }

    private async queueWork() {

        while(true) {
            const el = await this.queue.dequeue();
            await this.bufferedPlay(el);
        }
    } 

    private async bufferedPlay(data:DelayedPlayBackElement[]) {
        for (const el of data) {
            if(el.delay)
                await sleep(el.delay); 
            try{
                this.livemap.onEvent(el);
            }
            catch(e){
                console.error(e)
            }
        }
    }
}

async function sleep(ms:number) {
    return new Promise<void>((resolve) => setTimeout(resolve,ms));
}

export default LiveMapComponent;