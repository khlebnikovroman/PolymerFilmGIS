import React, {MouseEvent, useCallback, useMemo, useState} from "react";
import {MapContainer, Marker, Popup, TileLayer, ZoomControl} from "react-leaflet";
import {DomEvent, latLng} from "leaflet";
import L from 'leaflet';
import SelectLayers from 'leaflet';
import './Map.css';
import {Button, Layout} from 'antd';
import 'antd/dist/antd.css'
import {Content} from "antd/es/layout/layout";
import MenuSider from "../menu/menuSider/MenuSider";
import {useContextMenu} from "../../hooks";
import MenuLayers from "../menu/menuLayers/MenuLayers";

L.Icon.Default.imagePath = "https://unpkg.com/browse/leaflet@1.9.2/dist/images/";

export const MapComponent: React.FC = () => {
    const [lat, setLat] = useState(59.918711823015684);
    const [lng, setlng] = useState(30.319212156536604);
    
    const { setContextMenu } = useContextMenu();
    
    const center = [lat, lng];

    const contextMenu = useMemo(() => [
        {
            name: 'Option #1', 
            onClick: () => {}
        },
        {
            name: 'Option #2',
            onClick: () => {}
        },
        {
            name: 'Option #3',
            onClick: () => {}
        },
    ], [])
    
    const handleContextMenu = useCallback((event: MouseEvent) => {
        event.preventDefault();
        const {clientX, clientY} = event;
        console.log(clientX, clientY);
        setContextMenu(contextMenu, [clientX, clientY]);
    },[setContextMenu, contextMenu])
    
    //const center2 = new LatLngTuple(center)
    // @ts-ignore
    return (
        <div>
            <Layout className="site-layout">
                <MenuSider/>
                <div>
                    <Content>
                        <div className="element-on-map">
                            <MenuLayers></MenuLayers>
                        </div>
                        <Button></Button>
                        <div onContextMenu={handleContextMenu}>
                            <MapContainer zoomControl={false} zoom={100} center={latLng(lat, lng)} className="big-map"
                                          attributionControl={false}
                                          style={{ zIndex: 1, position: "relative", top: 0, left: 0 }}>
                                <ZoomControl position={'bottomright'} />
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position = {latLng(lat, lng)}>
                                    <Popup>
                                        Зачем сюда жмешь Э?
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </Content>
                </div>
            </Layout>
        </div>
    );
}

export default MapComponent;