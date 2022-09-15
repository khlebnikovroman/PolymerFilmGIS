import React from "react";
import {MapContainer, TileLayer} from "react-leaflet";
import {latLng} from "leaflet";
import './Map.css';

class MapComponent extends React.Component{
    state = {
        lat: 59.918711823015684,
        lng: 30.319212156536604,
        zoom: 120
    }
    render() {
        const center = [this.state.lat, this.state.lng];
        //const center2 = new LatLngTuple(center)
        // @ts-ignore
        return (
            <MapContainer zoom={this.state.zoom} center={latLng(this.state.lat, this.state.lng)} attributionControl={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        );
    }
}

export default MapComponent;