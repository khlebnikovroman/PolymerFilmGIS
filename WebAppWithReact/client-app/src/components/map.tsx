import React, {useState} from "react";
import {MapContainer, TileLayer, ZoomControl} from "react-leaflet";
import {latLng} from "leaflet";
import './Map.css';
import {Button, Layout} from 'antd';
import 'antd/dist/antd.css'
import {Content} from "antd/es/layout/layout";
import MenuSider from "./menuSider/menuSider";
import './contextMenu/contextMenu.css';
import ContextMenu from "./contextMenu/contextMenu";

export const MapComponent: React.FC = () => {
    const [lat, setLat] = useState(59.918711823015684);
    const [lng, setlng] = useState(30.319212156536604);
    // Show or hide the custom context menu
    const [isShown, setIsShown] = useState(false);
    // The position of the custom context menu
    const [position, setPosition] = useState({ x: 0, y: 0 });
    // Show the custom context menu
    const showContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        // Disable the default context menu
        event.preventDefault();

        setIsShown(false);
        const newPosition = {
            x: event.pageX,
            y: event.pageY,
        };

        setPosition(newPosition);
        setIsShown(true);
    };

    // Hide the custom context menu
    const hideContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        setIsShown(false);
    };

    // Do what you want when an option in the context menu is selected
    const [selectedValue, setSelectedValue] = useState<String>();
    const doSomething = (selectedValue: String) => {
        setSelectedValue(selectedValue);
    };
    //const center2 = new LatLngTuple(center)
    // @ts-ignore
    return (
        <div>
            <Layout className="site-layout">
                <MenuSider/>
                <div>
                    <Content>
                        {/*<div>*/}
                        {/*    <ContextMenu/>*/}
                        {/*</div>*/}
                        <div className="element-on-map">
                            <Button type="primary" shape={"round"}>Primary</Button>
                            <Button shape={"round"}>Default</Button>
                            <Button type="dashed" shape={"round"}>Dashed</Button>
                        </div>
                        <Button></Button>
                        <div onContextMenu={showContextMenu}
                             onClick={hideContextMenu}>
                            {/* Define the custom context menu */}
                            {isShown && (
                                <div
                                    style={{ top: position.y, left: position.x }}
                                    className="custom-context-menu"
                                >
                                    <div className="option" onClick={() => doSomething("Option 1")}>
                                        Option #1
                                    </div>
                                    <div className="option" onClick={() => doSomething("Option 2")}>
                                        Option #2
                                    </div>
                                    <div className="option" onClick={() => doSomething("Option 3")}>
                                        Option #3
                                    </div>
                                </div>
                            )}
                            <MapContainer  zoomControl={false} zoom={100} center={latLng(lat, lng)} className="big-map"
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