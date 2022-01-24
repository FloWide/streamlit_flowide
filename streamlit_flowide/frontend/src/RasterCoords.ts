import {LatLngBounds, LatLngExpression, Map as LeafletMap, PointExpression} from 'leaflet';


export default class RasterCoords {
    
    private zoom: number;

    constructor(
        private map: LeafletMap,
        private imgWidth: number,
        private imgHeight: number,
        private tileSize: number = 256
    ) {
        this.zoom = this.zoomLevel();
        if(this.imgWidth && this.imgHeight) {
            this.setMaxBounds();
        }
    }


    zoomLevel() {
        return Math.ceil(
            Math.log(
              Math.max(this.imgWidth, this.imgHeight) /
              this.tileSize
            ) / Math.log(2)
          )
    }

    unproject(coords: PointExpression) {
        return this.map.unproject(coords,this.zoom);
    }

    project(coords: LatLngExpression) {
        return this.map.project(coords,this.zoom);
    }

    getMaxBounds() {
        return new LatLngBounds(
            this.unproject([0, this.imgHeight]),
            this.unproject([this.imgWidth, 0])
        )
    }

    setMaxBounds() {
        this.map.setMaxBounds(this.getMaxBounds());
    }

}



