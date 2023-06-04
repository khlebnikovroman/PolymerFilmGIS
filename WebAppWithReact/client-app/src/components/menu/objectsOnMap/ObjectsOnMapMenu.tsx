import React, {useEffect} from 'react';
import {CaretRightOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {Button, Collapse, Form, List, Modal, theme} from 'antd';
import {GetObjectOnMapDto, ObjectsOnMapClient, UpdateObjectOnMapDto} from "../../../services/Clients";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import ObjectOnMapForm from "./ObjectOnMapForm";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../../redux/store";
import {editObject, removeObject, setObjects} from "../../../redux/ObjectSlice";


const ObjectsOnMapMenu: React.FC = () => {

    //const [list, setList] = useState<GetObjectOnMapDto[]>([]);
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
        console.log(`checked = ${e.target.checked}`);
        console.log(`target name = ${e.target.id}`);
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
//todo починить, при вызове формы, появляются старые данные в форме а не новые
        form.resetFields();
        confirm({
            title: "Изменение объекта",
            icon: <div/>,
            content: <ObjectOnMapForm form={form} objectDto={item}/>,
            onOk: () => {
                console.log(form.getFieldsValue())
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
        dispatch(removeObject(item.id!))
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
                            dataSource={objects}
                            renderItem={(item: GetObjectOnMapDto, index: number) =>
                                <List.Item>
                                    <>{item.name}</>
                                    <div style={{width: 100, paddingLeft: 30}}>
                                        <Button type="primary"
                                                shape="default"
                                                icon={<EditOutlined/>}
                                                size={"small"}
                                                style={{marginLeft: '8px'}}
                                                onClick={() => showEdit(item)}
                                        ></Button>
                                        <Button type="primary"
                                                shape="default"
                                                icon={<DeleteOutlined/>}
                                                size={"small"}
                                                style={{marginLeft: '8px'}}
                                                onClick={() => deleteObject(item)}
                                        ></Button>
                                    </div>
                                </List.Item>} 
                        />
                    </Panel>
                </Collapse>
            </div>
        </>
    )
}

export default ObjectsOnMapMenu