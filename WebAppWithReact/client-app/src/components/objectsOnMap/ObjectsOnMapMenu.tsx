import React, {useEffect, useState} from 'react';
import {EditOutlined, MailOutlined} from '@ant-design/icons';
import type {ListProps, MenuProps} from 'antd';
import {Button, Checkbox, Form, List, Menu, Modal} from 'antd';
import {UpdateObjectOnMapDto, GetObjectOnMapDto, ObjectsOnMapClient, IUpdateObjectOnMapDto} from "../../services/Clients";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import { Collapse, theme } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import ObjectOnMapForm from "./ObjectOnMapForm";


const ObjectsOnMapMenu: React.FC = () => {
    
    const [list, setList] = useState<GetObjectOnMapDto[]>([]);

    const { token } = theme.useToken();
    const { Panel } = Collapse;

    const panelStyle = {
        marginBottom: 24,
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: 'none',
    };
    
    const onChange = (e: CheckboxChangeEvent) => {
        console.log(`checked = ${e.target.checked}`);
        console.log(`target name = ${e.target.id}`);
    };
    
    useEffect(() => {
        const layerClient = new ObjectsOnMapClient();
        layerClient.getAllWithoutLayer().then(res => {
            setList(res);
        })
    }, [onChange]);

    const {confirm} = Modal;
    const [form] = Form.useForm();

    function showEdit(item: GetObjectOnMapDto) {

        confirm({
            title: "Изменение объекта",
            icon: <div/>,
            content: <ObjectOnMapForm form={form} objectDto={item}/>,
            onOk: () => {
                form
                    .validateFields()
                    .then(async (values) => {
                        form.resetFields();
                        const model = new UpdateObjectOnMapDto({
                            id: item.id!.toString(),
                            name: values.objectName,
                            lati: values.objectLat,
                            long: values.objectLng,
                            capacity: 1
                        });
                        const objectClient = new ObjectsOnMapClient();
                        await objectClient.objectsOnMapPUT(model)
                        console.log('Success', values.objectName,
                            values.objectLat,
                            values.objectLng,)
                    })
                    .catch((info) => {
                        form.resetFields();
                    });
            },
            onCancel: () => {

                form.resetFields()
                console.log('Clear:', item.long, item.lati);
            }
        })
    }
    
    return (
        <>
            <div>
                <Collapse bordered={false}
                          defaultActiveKey={['1']}
                          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                          style={{ background: token.colorBgContainer }}>
                    <Panel header='Список объектов' key={1}>
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
                                         onClick={() => showEdit(item)}
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