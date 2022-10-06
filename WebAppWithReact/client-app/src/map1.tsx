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


    //const center2 = new LatLngTuple(center)
    // @ts-ignore
    return (
        <div>
            <Layout className="site-layout">
                <Sider>

                </Sider>
                <Content>
                    <div className="element-on-map">
                        <Button type="primary" shape={"round"}>Primary</Button>
                        <Button shape={"round"}>Default</Button>
                        <Button type="dashed" shape={"round"}>Dashed</Button>
                    </div>
                    <div>
                        <MapContainer zoomControl={false} zoom={100} center={latLng(lat, lng)} className="big-map"
                                      attributionControl={false}
                                      style={{zIndex: 1, position: "relative", top: 0, left: 0}}>
                            <ZoomControl position={'bottomright'}/>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </MapContainer>
                    </div>
                </Content>
            </Layout>


        </div>
    );
}

export default MapComponent;