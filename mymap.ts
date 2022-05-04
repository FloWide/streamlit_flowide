



class MyMap implements Hooks.FloWideMap {

    setup(masterMap: L.Map, overLayMap: L.Map, maps: Map<string, L.Map>, args: Hooks.Args): void {
        L.marker([48.13037983959886, 22.294233664870266])
            .addTo(masterMap)
            .bindTooltip('master',{permanent:true});
        L.marker([-33.49072760857131,-11.41693059169152])
            .addTo(maps.get('other'))
            .bindTooltip('2563',{permanent:true});
    }
    onRerun(args: Hooks.Args): void {
        console.log("flowidemap rerun");
    }

}


export default new MyMap();