import {LatLng} from "leaflet";
import {booleanPointInPolygon, Polygon} from "@turf/turf";

export function isInPolygon(polygon: Polygon, latlng: LatLng): boolean {

    let isInside = booleanPointInPolygon([latlng.lng, latlng.lat], polygon)
    return isInside;
}

