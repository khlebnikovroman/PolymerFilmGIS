import React, {MouseEvent, useCallback, useMemo, useRef, useState} from "react";
import {MapContainer, TileLayer, ZoomControl} from "react-leaflet";
import L, {latLng} from "leaflet";
import './Map.css';
import {Layout} from 'antd';
import 'antd/dist/antd.css'
import {Content} from "antd/es/layout/layout";
import {useContextMenu} from "../../hooks";
import {RandomRussiaPoints} from "./exampleData2";
import {Mapelements} from "../menu/mapelements";
import "leaflet.webgl-temperature-map"
import WebGlTemperatureMapLayer from "../heatmap/lib/HeatMapLayer";

L.Icon.Default.imagePath = "https://unpkg.com/browse/leaflet@1.9.2/dist/images/";

export const MapComponent: React.FC = () => {
    const [lat, setLat] = useState(59.918711823015684);
    const [lng, setlng] = useState(30.319212156536604);

    const {setContextMenu} = useContextMenu();

    const center = [lat, lng];
    const mapRef = useRef<L.Map>(null);
    const tempMapRef = useRef<L.WebGlTemperatureMapLayer>(null);
    const contextMenu = useMemo(() => [
        {
            name: 'Option #1',
            onClick: () => {
            }
        },
        {
            name: 'Option #2',
            onClick: () => {
            }
        },
        {
            name: 'Option #3',
            onClick: () => {
            }
        },
    ], [])

    const handleContextMenu = useCallback((event: MouseEvent) => {
        event.preventDefault();
        const {clientX, clientY} = event;
        console.log(clientX, clientY);
        setContextMenu(contextMenu, [clientX, clientY]);
    }, [setContextMenu, contextMenu])

    return (
        <div>
            <Layout className="site-layout">
                <div>
                    <Content>
                        <div className="element-on-map">
                            <Mapelements/>
                        </div>
                        <div onContextMenu={handleContextMenu}>
                            <MapContainer ref={mapRef} zoomControl={false} zoom={4} center={latLng(lat, lng)}
                                          className="big-map"
                                          attributionControl={false}
                                          style={{zIndex: 1, position: "relative", top: 0, left: 0}}>
                                <ZoomControl position={'bottomright'}/>
                                <WebGlTemperatureMapLayer data={RandomRussiaPoints} idwOptions={{
                                    isNullColorized: false,
                                    p: 5,
                                    opacity: 0.5,
                                    range_factor: 0.05,
                                    gamma: 5
                                }}/>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"/>
                            </MapContainer>
                        </div>
                    </Content>
                </div>
            </Layout>
        </div>
    );
}

export default MapComponent;