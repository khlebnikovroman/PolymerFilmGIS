import React, {useEffect} from "react";
import {Button, Collapse, List, Table, theme} from "antd";
import {CityDto, GoodCitiesClient} from "../../../services/Clients";
import {CaretRightOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../../redux/store";
import {setCities} from "../../../redux/CitiesSlice";

const CitiesOnMapMenu: React.FC = () => {
    const {Panel} = Collapse;
    const {token} = theme.useToken();
    
    const dispatch = useAppDispatch();
    const {cities} = useSelector((state: RootState) => state.cities);
    const {layers} = useSelector((state: RootState) => state.layers);
    
    const handleClickFindCities = async () => {
        const isAnyLayerSelected = layers.some((layer) => layer.isSelectedByUser);

        const hasObjectsInSelectedLayer = layers.some(
            (layer) => layer.isSelectedByUser && layer.objects.length > 0
        );

        if (isAnyLayerSelected && hasObjectsInSelectedLayer) {
            const citiesClient = new GoodCitiesClient();
            await citiesClient.getCities().then((res) => {
                dispatch(setCities(res));
                console.log(res);
            })
        }
    }
    
    return (
        <div style={{ borderRadius: '15px'}}>
            <Collapse bordered={false}
                      defaultActiveKey={['1']}
                      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                      style={{ background: token.colorBgContainer }}>
                <Panel header='Список городов' key={1}>
                    <div style={{flexDirection: "row"}}>
                        <p>Название Наличие Ж/Д Население</p>
                    </div>
                    <List
                        style={{backgroundColor: 'white'}}
                        size="small"
                        bordered
                        dataSource={cities}
                        renderItem={(item: CityDto, index: number) =>
                            
                            <List.Item>
                                <p>{item.name}</p>
                                <p>{item.isRailwayNearby ? 'Да' : 'Нет'}</p>
                                <p>{item.population}</p>
                            </List.Item>}
                    />
                    <Button type="primary" shape={"default"} style={{width: "100%"}}
                            onClick={() => handleClickFindCities()}>
                        Найти города
                    </Button>
                </Panel>
            </Collapse>
        </div>
    )
}
export default CitiesOnMapMenu