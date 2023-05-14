import React, {MouseEvent, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {MapContainer, TileLayer, useMapEvents, ZoomControl} from "react-leaflet";
import L, {LatLng, latLng} from "leaflet";
import './Map.css';
import {Form, Layout, Modal} from 'antd';

import {Content} from "antd/es/layout/layout";
import {useContextMenu} from "../../hooks";
import {Mapelements} from "../menu/mapelements";
import "leaflet.webgl-temperature-map"
import IdwMapLayer from "../heatmap/variant2/HeatMapLayer2";
import {CreateObjectOnMapDto, GetObjectOnMapDto, ObjectsOnMapClient} from "../../services/Clients";
import ObjectOnMapForm from "../menu/objectsOnMap/ObjectOnMapForm";
import {shallowEqual, useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../redux/store";
import {addObject} from "../../redux/ObjectSlice";
import UserService from "../../services/UserService";

L.Icon.Default.imagePath = "https://unpkg.com/browse/leaflet@1.9.2/dist/images/";

export const MapComponent: React.FC = () => {
    const [lat, setLat] = useState(59.918711823015684);
    const [lng, setlng] = useState(30.319212156536604);
    const [position, setPosition] = useState<LatLng>();


    const {layers} = useSelector((state: RootState) => state.layers, shallowEqual);
    const [objects, setObjects] = useState<[number, number, number][]>();

    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);

    const {setContextMenu} = useContextMenu();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (objects) {
            const min = objects.reduce((acc, cur) => Math.min(acc, cur[2]), Infinity);
            const max = objects.reduce((acc, cur) => Math.max(acc, cur[2]), -Infinity);
            setMin(min);
            setMax(max);
        }
    }, [objects])
    
    useEffect(() => {
        const result = layers.filter((l) => l.isSelectedByUser)
            .flatMap((layer) =>
                layer.objects?.map(({lati, long, capacity}) => [lati, long, capacity])
            );
        // @ts-ignore
        setObjects(result)
    }, [layers])
    
    const center = [lat, lng];
    const mapRef = useRef<L.Map>(null);
    const tempMapRef = useRef<L.WebGlTemperatureMapLayer>(null);
    
    const contextMenu = useMemo(() => [
        {
            name: 'Добавить объект здесь',
            onClick: () => {
                if (position) {
                    showAdd(new CreateObjectOnMapDto({lati: position.lat, long: position.lng, name: "", capacity: 0}))
                }
            }
        },

    ], [position])

    const handleContextMenu = useCallback((event: MouseEvent) => {
        event.preventDefault();
        const {clientX, clientY} = event;
        setContextMenu(contextMenu, [clientX, clientY]);
    }, [setContextMenu, contextMenu])

    const LocationFinder = () => {
        const map = useMapEvents({
            contextmenu(e) {
                setPosition(e.latlng);
            },
        });
        return null;
    };

    const {confirm} = Modal;
    const [form] = Form.useForm();
    
    function showAdd(item: CreateObjectOnMapDto) {
        
        confirm({
            title: "Создание объекта",
            icon: <div/>,
            content: <ObjectOnMapForm form={form} objectDto={item}/>,
            onOk: () => {
                form
                    .validateFields()
                    .then(async (values) => {
                        form.resetFields();
                        const model = new CreateObjectOnMapDto({
                            name: values.objectName,
                            lati: values.objectLat,
                            long: values.objectLng,
                            capacity: 1
                        });
                        const objectClient = new ObjectsOnMapClient();
                        const id = await objectClient.objectsOnMapPOST(model)
                        const createdObject = new GetObjectOnMapDto({
                            lati: model.lati,
                            long: model.long,
                            capacity: model.capacity,
                            name: model.name,
                            appUserId: UserService.getCurrentUserId()!,
                            id: id
                        })
                        dispatch(addObject(createdObject))
                    })
                    .catch((info) => {
                        form.resetFields();
                        console.log('Validate Failed:', position);
                    });
            },
            onCancel: () => {

                form.resetFields()
                console.log('Clear:', item.long, item.lati);
            }
        })
    }
    
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
                                <LocationFinder/>
                                <IdwMapLayer latlngs={objects}
                                             opacity={0.3}
                                             maxZoom={18}
                                             cellSize={10}
                                             exp={3}
                                             displayValue={{min: min, max: max}}/>
                                {/*<WebGlTemperatureMapLayer data={KleknerPoints} idwOptions={{*/}
                                {/*    isNullColorized: true,*/}
                                {/*    p: 5,*/}
                                {/*    opacity: 0.5,*/}
                                {/*    range_factor: 0.05,*/}
                                {/*    gamma: 5*/}
                                {/*}}/>*/}
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