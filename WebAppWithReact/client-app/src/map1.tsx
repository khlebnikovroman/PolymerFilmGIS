import React, {useState} from "react";
import {MapContainer, TileLayer, ZoomControl} from "react-leaflet";
import {latLng} from "leaflet";
import './Map.css';
import {Button, Layout} from 'antd';
import 'antd/dist/antd.css'
import Sider from "antd/es/layout/Sider";
import {Content} from "antd/es/layout/layout";

export const MapComponent: React.FC = () => {
    const [lat, setLat] = useState(59.918711823015684);
    const [lng, setlng] = useState(30.319212156536604);
    const [collapsed, setCollapsed] = useState(false)

    //const center2 = new LatLngTuple(center)
    // @ts-ignore
    return (
        <div>
            <Layout className="site-layout">
            <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
                Left Sidebar
            </Sider>
                <div>
                
                    <Content>
                        <div className="element-on-map">
                            <Button type="primary" shape={"round"}>Primary</Button>
                            <Button shape={"round"}>Default</Button>
                            <Button type="dashed" shape={"round"}>Dashed</Button>
                        </div>
                        <Button></Button>
                        
                        <div>
                            <MapContainer zoomControl={false} zoom={100} center={latLng(lat, lng)} className="big-map"
                                          attributionControl={false}
                                          style={{ zIndex: 1, position: "relative", top: 0, left: 0 }}>
                                <ZoomControl position={'bottomright'} />
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                            </MapContainer>
                        </div>
                    </Content>
                </div>
            </Layout>


        </div>
    );
}

export default MapComponent;