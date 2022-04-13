


class MyMap implements Hooks.CustomMap {

    //called to setup the leaflet map, must return the map object
    async setupMap(container: HTMLDivElement, args?: Hooks.Args): Promise<L.Map> {
        const map = L.map(container).setView([0,0],4);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        L.marker([47.497913,19.040236]).addTo(map);
        return map;
    }
    // called to setup the component, called again on rerun if failed to setup the first time
    async setupComponent(args?: Hooks.Args): Promise<boolean> {
        return true
    }
    //called on every rerun
    onRerun(args?: Hooks.Args): void {
        console.log("rerun",args);
    }

}


export default new MyMap();