import React, {useEffect} from 'react';
import {CaretRightOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {Button, Collapse, Form, List, Modal, Table, theme} from 'antd';
import {GetObjectOnMapDto, ObjectsOnMapClient, UpdateObjectOnMapDto} from "../../../services/Clients";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import ObjectOnMapForm from "./ObjectOnMapForm";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../../redux/store";
import {editObject, removeObject, setObjects} from "../../../redux/ObjectSlice";
import {editObjectFromAll, removeObjectFromAll} from "../../../redux/AllObjectSlice";


const ObjectsOnMapMenu: React.FC = () => {
    const {token} = theme.useToken();
    const {Panel} = Collapse;
    const {objects} = useSelector((state: RootState) => state.objects);
    const panelStyle = {
        marginBottom: 24,
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: 'none',
    };
    const dispatch = useAppDispatch();


    const onChange = (e: CheckboxChangeEvent) => {
    };

    useEffect(() => {
        const objectsOnMapClient = new ObjectsOnMapClient();
        objectsOnMapClient.getAllWithoutLayer().then(res => {
            dispatch(setObjects(res))
        })
    }, []);

    const {confirm} = Modal;
    const [form] = Form.useForm();
    
    function showEdit(item: GetObjectOnMapDto) {
        form.setFieldsValue({
            objectName: item.name,
            objectLat: item.lati,
            objectLng: item.long,
            objectCapacity: item.capacity,
        });
        confirm({
            title: "Изменение объекта",
            icon: <div/>,
            width: 750,
            okText: 'Применить',
            cancelText: 'Отмена',
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
                            capacity: values.objectCapacity,
                        });
                        const objectClient = new ObjectsOnMapClient();
                        await objectClient.objectsOnMapPUT(model)
                        dispatch(editObject(model))
                        dispatch(editObjectFromAll(model));
                    })
                    .catch((info) => {
                        form.resetFields();
                    });
            },
            onCancel: () => {
                form.resetFields()
            }
        })
    }

    function deleteObject(item: GetObjectOnMapDto) {
        const objectClient = new ObjectsOnMapClient();
        objectClient.objectsOnMapDELETE(item.id!).then()
        dispatch(removeObject(item.id!));
        dispatch(removeObjectFromAll(item.id!));
    }
    
    return (
        <>
            <div style={{ borderRadius: '15px' }}> 
                <Collapse bordered={false}
                          defaultActiveKey={['1']}
                          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                          style={{ background: token.colorBgContainer }}>
                    <Panel header='Список объектов' key={1}>
                        <Table
                            style={{ backgroundColor: 'white', textAlign: 'center' }}
                            size="small"
                            bordered
                            dataSource={objects}
                            locale={{
                                emptyText: 'Нет данных',
                            }}
                        >
                            <Table.Column
                                title="Название"
                                dataIndex="name"
                                key="name"
                            />
                            <Table.Column
                                title="Действия"
                                dataIndex="actions"
                                align={"center"}
                                key="actions"
                                render={(text, record) => (
                                    <div>
                                        <Button
                                            type="primary"
                                            shape="default"
                                            icon={<EditOutlined />}
                                            size="small"
                                            style={{ marginLeft: '8px' }}
                                            onClick={() => showEdit(record as GetObjectOnMapDto)}
                                        ></Button>
                                        <Button
                                            type="primary"
                                            shape="default"
                                            icon={<DeleteOutlined />}
                                            size="small"
                                            style={{ marginLeft: '8px' }}
                                            onClick={() => deleteObject(record as GetObjectOnMapDto)}
                                        ></Button>
                                    </div>
                                )}
                            />
                        </Table>
                    </Panel>
                </Collapse>
            </div>
        </>
    )
}

export default ObjectsOnMapMenu