import React, {MouseEvent, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {MapContainer, Marker, Popup, TileLayer, useMapEvents, ZoomControl} from "react-leaflet";
import L, {LatLng, latLng} from "leaflet";
import './Map.css';
import {Form, Layout, Modal} from 'antd';

import {Content} from "antd/es/layout/layout";
import {useContextMenu} from "../../hooks";
import {Mapelements} from "../menu/mapelements";
import ReactGaussHeatmapLayer from "../heatmap/ReactGaussHeatmapLayer";
import {CreateObjectOnMapDto, GetObjectOnMapDto, ObjectsOnMapClient} from "../../services/Clients";
import ObjectOnMapForm from "../menu/objectsOnMap/ObjectOnMapForm";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../redux/store";
import {addObject} from "../../redux/ObjectSlice";
import UserService from "../../services/UserService";
import {setAllObjects} from "../../redux/AllObjectSlice";
import customObjectIconImage from "./objectIcon.png";
import customCityIconImage from "./cityIcon.png";
import {setCities} from "../../redux/CitiesSlice";

L.Icon.Default.imagePath = "https://unpkg.com/browse/leaflet@1.9.2/dist/images/";

export const MapComponent: React.FC = () => {
    document.title = 'HeatGIS';
    
    const [lat, setLat] = useState(59.918711823015684);
    const [lng, setlng] = useState(30.319212156536604);
    const [position, setPosition] = useState<LatLng>();

    const {allObjects} = useSelector((state: RootState) => state.allObjects)
    const {layers} = useSelector((state: RootState) => state.layers);
    const {cities} = useSelector((state: RootState) => state.cities);
    const [objects, setObjects] = useState<[number, number, number][]>();

    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);

    const {setContextMenu} = useContextMenu();
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        const objClient = new ObjectsOnMapClient();
        objClient.objectsOnMapAll().then((res) => {
            dispatch(setAllObjects(res));
        })
    }, [])
    
    
    useEffect(() => {
        const result = layers.filter((l) => l.isSelectedByUser)
            .flatMap((layer) =>
                layer.objects?.map(({lati, long, capacity}) => [lati, long, capacity, layer.alpha])
            );
        // @ts-ignore
        setObjects(result);
        dispatch(setCities([]));
    }, [layers])
    
    const center = [lat, lng];
    const mapRef = useRef<L.Map>(null);
    
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
        document.title = 'Создание объекта';
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
                            capacity: values.objectCapacity
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
                        document.title = 'HeatGIS';

                    })
                    .catch((info) => {
                        form.resetFields();
                        document.title = 'HeatGIS';
                    });
            },
            onCancel: () => {

                form.resetFields()
                document.title = 'HeatGIS';

            }
        })
    }

    const customObjectIcon = L.icon({
        iconUrl: customObjectIconImage,
        iconSize: [32, 32], // Размер иконки в пикселях
        iconAnchor: [16, 32], // Точка привязки иконки
    });

    const customCityIcon = L.icon({
        iconUrl: customCityIconImage,
        iconSize: [32, 32], // Размер иконки в пикселях
        iconAnchor: [16, 32], // Точка привязки иконки
    });
    const renderObjectMarkers = () => {
        return allObjects.map((object) => (
            <Marker icon={customObjectIcon} position={[object.lati!, object.long!]} key={object.id}>
                <Popup>
                    <div>
                        <h3>Название: {object.name}</h3>
                        <p>Мощность: {object.capacity}</p>
                        <p>Широта: {object.lati}</p>
                        <p>Долгота: {object.long}</p>
                    </div>
                </Popup>
            </Marker>
        ));
    };

    const renderCityMarkers = () => {
        return cities.map((city) => (
            <Marker icon={customCityIcon} position={[city.lat!, city.lng!]}>
                <Popup>
                    <div>
                        <h3>Название: {city.name}</h3>
                        <p>Наличие Ж\Д: {city.isRailwayNearby}</p>
                        <p>Население: {city.population}</p>
                        <p>Широта: {city.lat}</p>
                        <p>Долгота: {city.lng}</p>
                    </div>
                </Popup>
            </Marker>
        ));
    };

    return (
        <div>
            <Layout className="site-layout">
                <div>
                    <Content>
                        <div className="element-on-map">
                            <Mapelements />
                        </div>
                        <div onContextMenu={handleContextMenu}>
                            <MapContainer ref={mapRef} zoomControl={false} zoom={4} center={latLng(lat, lng)}
                                          className="big-map"
                                          attributionControl={false}
                                          style={{zIndex: 1, position: "relative", top: 0, left: 0}}>
                                {renderObjectMarkers()}
                                {renderCityMarkers()}
                                <ZoomControl position={'bottomright'}/>
                                <LocationFinder/>
                                <ReactGaussHeatmapLayer latlngs={objects}
                                                        opacity={0.3}
                                                        maxZoom={18}
                                                        cellSize={10}
                                                        exp={2}
                                    // maxDistance={900000}
                                />
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