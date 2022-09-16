import React from "react";
import {MapContainer, TileLayer} from "react-leaflet";
import {latLng} from "leaflet";
import './Map.css';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Radio } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { useState } from 'react';
import 'antd/dist/antd.css'
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
            <div >
                
                <MapContainer  zoom={this.state.zoom} center={latLng(this.state.lat, this.state.lng)} attributionControl={false} style = {{zIndex:1, position:"relative", top:0,left:0}}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
                <div style = {{zIndex:999, position:"relative", top:0,left:0}}>
                    <Button type="primary" shape={"round"} >Primary</Button>
                    <Button shape={"round"}>Default</Button>
                    <Button type="dashed" shape={"round"}>Dashed</Button>
                </div>
            </div>
        );
    }
}

export default MapComponent;