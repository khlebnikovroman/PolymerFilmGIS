import {useAppDispatch} from "../../redux/store";
import {GetObjectOnMapDto, ObjectsOnMapClient, UpdateObjectOnMapDto} from "../../services/Clients";
// @ts-ignore
import L from "leaflet";
import {useEffect} from "react";
import { MapContainer } from "react-leaflet";


const ObjectMarker: React.FC = () => {

    const dispatch = useAppDispatch();

    // useEffect(() => {
    //     const addMarkers = () => {
    //         allObjects.forEach((object) => {
    //             const lat = object.lati!;
    //             const lng = object.long!;
    //             L.marker([lat, lng]).addTo(mapRef.current?.leafletElement); // Add the marker to the map
    //         });
    //     };
    //
    //     addMarkers();
    // }, [allObjects, mapRef]);
    
    return null;
}
export default ObjectMarker