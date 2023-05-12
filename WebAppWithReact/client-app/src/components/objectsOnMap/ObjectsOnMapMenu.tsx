import React, {useEffect, useState} from 'react';
import {EditOutlined, MailOutlined} from '@ant-design/icons';
import type {ListProps, MenuProps} from 'antd';
import {Button, Checkbox, List, Menu} from 'antd';
import {GetLayerDto, GetObjectOnMapDto, LayerClient, ObjectsOnMapClient} from "../../services/Clients";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import { Collapse, theme } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';


const ObjectsOnMapMenu: React.FC = () => {
    
    const [list, setList] = useState<GetObjectOnMapDto[]>([]);
    const [initLoading, setInitLoading] = useState(true);
    type MenuItem = Required<MenuProps>['items'][number];

    const { token } = theme.useToken();
    const { Panel } = Collapse;

    const panelStyle = {
        marginBottom: 24,
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: 'none',
    };
    
    useEffect(() => {
        const layerClient = new ObjectsOnMapClient();
        layerClient.getAllWithoutLayer().then(res => {
            setInitLoading(false);
            setList(res);
        })
    }, []);
    
    const onChange = (e: CheckboxChangeEvent) => {
        console.log(`checked = ${e.target.checked}`);
        console.log(`target name = ${e.target.id}`);
    };
    
    
    return (
        <>
            <div>
                <Collapse bordered={false}
                          defaultActiveKey={['1']}
                          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                          style={{ background: token.colorBgContainer }}>
                    <Panel header='Obj' key={1}>
                        <List
                            style={{backgroundColor: 'white'}}
                            size="small"
                            //header={<div>Объекты</div>}
                            bordered
                            dataSource={list}
                            renderItem={(item: GetObjectOnMapDto, index: number) =>
                                <List.Item>
                                    {/*<Checkbox*/}
                                    {/*    onChange={onChange}*/}
                                    {/*    id={item.id}*/}
                                    {/*    name={item.name}*/}
                                    {/*>*/}
                                    {/*    {item.name}*/}
                                    {/*</Checkbox>*/}
                                    <text>{item.name}</text>
                                    <Button type="primary"
                                            shape="default"
                                            icon={<EditOutlined/>}
                                            size={"small"}
                                            style={{marginLeft: '8px'}}
                                        // onClick={() => showEdit(item)}
                                    ></Button>
                                </List.Item>}
                        />
                    </Panel>
                </Collapse>
            </div>
        </>
    )
}

export default ObjectsOnMapMenu