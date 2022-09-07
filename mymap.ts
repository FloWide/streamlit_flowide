


import 'leaflet'

class MyMap implements Hooks.FloWideMap {


    
    setup(
        masterMap: L.Map, 
        overLayMap: L.Map, 
        maps: Map<string, L.Map>, 
        args: Hooks.Args
    ): void {
        const marker1= L.marker([48.13037983959886, 22.294233664870266])
            .addTo(masterMap)
            .bindTooltip('master',{permanent:true});
        const marker2 = L.marker([-33.49072760857131,-11.41693059169152])
            .addTo(maps.get('meter'))
            .bindTooltip('2563',{permanent:true});
        console.log(Hooks.switchFromMapCoords(maps.get('meter'),masterMap,marker2.getLatLng()));
        console.log(L);
        console.log("Hello");
        console.log("Hello");
    }
    onRerun(args: Hooks.Args): void {
        console.log("flowidemap rerun2");
    }

}


export default new MyMap();