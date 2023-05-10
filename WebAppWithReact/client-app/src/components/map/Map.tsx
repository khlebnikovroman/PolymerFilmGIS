import React, {MouseEvent, useCallback, useMemo, useRef, useState} from "react";
import {MapContainer, TileLayer, ZoomControl} from "react-leaflet";
import L, {latLng} from "leaflet";
import './Map.css';
import {Layout} from 'antd';
import 'antd/dist/antd.css'
import {Content} from "antd/es/layout/layout";
import {useContextMenu} from "../../hooks";
import {addressPoints4} from "./exampleData2";
import {Mapelements} from "../menu/mapelements";
//import {HeatmapLayerFactory} from "@vgrid/react-leaflet-heatmap-layer";
import "leaflet.webgl-temperature-map"
import WebGlTemperatureMapLayer from "../../heatmap/lib/HeatMapLayer";
//import {WebGlTemperatureMapLayer} from "../../heatmap/lib/WebGlTemperatureMapLayer";
//const HeatmapLayer = HeatmapLayerFactory<[number, number, number]>()
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

    // useEffect(() => {
    //     if (mapRef.current) {
    //         const map = mapRef.current;
    //         const tempMap = new L.WebGlTemperatureMapLayer()
    //         console.log(mapRef)
    //         console.log(mapRef.current)
    //         //tempMap.addTo(map!)
    //
    //         // tempMap.setPoints([
    //         //     [43.3990609000508, 39.9655151367188, 3],
    //         //     [43.5823804682817, 39.7183227539063, 65],
    //         //     [43.6738315711329, 40.2017211914063, 68]
    //         // ]);
    //     }
    // },[mapRef]);
    // function addlayer(){
    //     const map = mapRef.current;
    //     const tempMap = new L.WebGlTemperatureMapLayer()
    //     console.log(mapRef)
    //     console.log(mapRef.current)
    //     tempMap.addTo(map!)
    //
    //     tempMap.setPoints(exp
    //     );
    // }
    // setTimeout(()=> addlayer(), 2000)
    const handleContextMenu = useCallback((event: MouseEvent) => {
        event.preventDefault();
        const {clientX, clientY} = event;
        console.log(clientX, clientY);
        setContextMenu(contextMenu, [clientX, clientY]);
    }, [setContextMenu, contextMenu])

    return (
        <div>
            <Layout className="site-layout">
                {/*<MenuSider/>*/}
                <div>

                    <Content>
                        <div className="element-on-map">
                            <Mapelements/>
                        </div>
                        {/*<Button></Button>*/}
                        <div onContextMenu={handleContextMenu}>

                            <MapContainer ref={mapRef} zoomControl={false} zoom={4} center={latLng(lat, lng)}
                                          className="big-map"
                                          attributionControl={false}
                                          style={{zIndex: 1, position: "relative", top: 0, left: 0}}>
                                <ZoomControl position={'bottomright'}/>
                                <WebGlTemperatureMapLayer data={addressPoints4} idwOptions={{
                                    isNullColorized: false,
                                    p: 5,
                                    opacity: 0.5,
                                    range_factor: 0.05,
                                    gamma: 5
                                }}/>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
                                />
                                {/*<HeatmapLayer*/}
                                {/*    fitBoundsOnLoad*/}
                                {/*    fitBoundsOnUpdate*/}
                                {/*    points={addressPoints}*/}
                                {/*    // @ts-ignore*/}
                                {/*    longitudeExtractor={m => m[1]}*/}
                                {/*    // @ts-ignore*/}
                                {/*    latitudeExtractor={m => m[0]}*/}
                                {/*    // @ts-ignore*/}
                                {/*    intensityExtractor={m => parseFloat(m[2])}/>*/}

                                {/*<HeatmapLayer*/}
                                {/*    fitBoundsOnLoad*/}
                                {/*    fitBoundsOnUpdate*/}
                                {/*    // @ts-ignore*/}
                                {/*    points={addressPoints2}*/}
                                {/*    radius={120}*/}
                                {/*    blur={50}*/}
                                {/*    // @ts-ignore*/}
                                {/*    longitudeExtractor={m => m[1]}*/}
                                {/*    // @ts-ignore*/}
                                {/*    latitudeExtractor={m => m[0]}*/}
                                {/*    max={10000}*/}
                                {/*    // @ts-ignore*/}

                                {/*    intensityExtractor={m => parseFloat(m[2])}/>*/}


                                {/*<ImageOverlay*/}
                                {/*    url="https://cdnn1.ukraina.ru/img/07e6/0c/02/1041436899_0:0:2905:2047_1440x900_80_1_1_6fd268ee900f29e6eae4ce34429efb1c.jpg.webp?source-sid=rian_photo"*/}
                                {/*    bounds={new LatLngBounds(new LatLng(80,60),new LatLng(70,80))}*/}
                                {/*    />*/}

                                {/*<Marker position={latLng(lat, lng)}>*/}
                                {/*    <Popup>*/}
                                {/*        Зачем сюда жмешь Э?*/}
                                {/*    </Popup>*/}
                                {/*</Marker>*/}
                            </MapContainer>
                        </div>
                    </Content>
                </div>
            </Layout>
        </div>
    );
}

export default MapComponent;