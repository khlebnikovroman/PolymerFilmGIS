import React, {useEffect, useState} from "react";
import {Button, Collapse, List, Table, theme} from "antd";
import {CityDto, GoodCitiesClient} from "../../../services/Clients";
import {CaretRightOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../../redux/store";
import {setCities} from "../../../redux/CitiesSlice";

const CitiesOnMapMenu: React.FC = () => {
    const {Panel} = Collapse;
    const {token} = theme.useToken();
    
    const {cities} = useSelector((state: RootState) => state.cities);
    const {layers} = useSelector((state: RootState) => state.layers);
    
    const [isLoading, setLoading] = useState(false);
    const [isShown, setShown] = useState(false);
    const dispatch = useAppDispatch();
    
    
    const handleClickFindCities = async () => {
        
        const isAnyLayerSelected = layers.some((layer) => layer.isSelectedByUser);
        const hasObjectsInSelectedLayer = layers.some(
            (layer) => layer.isSelectedByUser && layer.objects.length > 0
        );
        if (isAnyLayerSelected && hasObjectsInSelectedLayer) {
            setLoading(true);
            const citiesClient = new GoodCitiesClient();
            citiesClient.getCities().then((res) => {
                dispatch(setCities(res));
                console.log(res);
                setShown(true);
                setLoading(false);
            })
        }
    }
    
    useEffect(() => {
        setShown(false);
    }, [layers])
    
    return (
        <div style={{ borderRadius: '15px'}}>
            <Collapse bordered={false}
                      defaultActiveKey={['1']}
                      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                      style={{ background: token.colorBgContainer }}>
                <Panel header='Список городов' key={1}>
                    <Table
                        style={{ backgroundColor: 'white', display: isShown ? "flex" : "none" }}
                        size="small"
                        bordered
                        dataSource={cities}
                        locale={{
                            emptyText: "Города не найдены",
                        }}
                        columns={[
                            {
                                title: 'Название',
                                dataIndex: 'name',
                                key: 'name',
                            },
                            {
                                title: 'Наличие Ж/Д',
                                dataIndex: 'isRailwayNearby',
                                key: 'isRailwayNearby',
                                render: (isRailwayNearby) => (isRailwayNearby ? 'Да' : 'Нет'),
                            },
                            {
                                title: 'Население',
                                dataIndex: 'population',
                                key: 'population',
                            },
                        ]}
                    />

                    <Button
                        type="primary"
                        shape="default"
                        style={{ width: '100%' }}
                        onClick={() => handleClickFindCities()}
                        loading={isLoading}
                    >
                        {isLoading ? 'Ищем' : 'Найти города' }
                    </Button>
                </Panel>
            </Collapse>
        </div>
    )
}
export default CitiesOnMapMenu