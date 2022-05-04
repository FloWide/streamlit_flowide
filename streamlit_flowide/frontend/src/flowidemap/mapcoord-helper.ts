import { MatrixTransformation } from '@flowide/leaflet-custom-transformation'
import {LatLng, Map as LeafletMap} from 'leaflet'
import {vec2} from 'gl-matrix';




export function switchFromMapCoords(fromMap: LeafletMap,toMap: LeafletMap,latlng: LatLng) {
    const vec = vec2.fromValues(latlng.lat,latlng.lng);
    const fromTransMatrix = (fromMap.options.crs.transformation as MatrixTransformation).transformationMatrix
    const toInvMatrix = (toMap.options.crs.transformation as MatrixTransformation).inverseTransformationMatrix
    vec2.transformMat3(vec,vec,fromTransMatrix) // transforms from the map to pixel coordinates
    vec2.transformMat3(vec,vec,toInvMatrix) // transforms from pixel coords to the other map
    return new LatLng(vec[0],vec[1]);
}