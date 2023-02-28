class MyMap implements Hooks.FloWideMap {
  setup(
    masterMap: L.Map,
    overLayMap: L.Map,
    maps: Map<string, L.Map>,
    args: Hooks.Args
  ): void {
    const marker1 = L.marker([0, 0])
      .addTo(masterMap)
    const marker2 = L.marker([3831, 3101])
      .addTo(maps.get("master"))
  }
  onRerun(args: Hooks.Args): void {
    console.log("flowidemap rerun2");
  }
}

export default new MyMap();
