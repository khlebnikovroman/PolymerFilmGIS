import React, {useEffect, useState} from "react";
import {Button, Checkbox, Form, List, Modal} from 'antd';
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {CreateLayerDto, GetLayerDto, LayerClient, SetLayerSelectionDto, UpdateLayerDto} from "../../../services/Clients"
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import LayerForm from "./LayerForm";
import {useAppDispatch} from "../../../redux/store";
import {setLayers, setSelection} from "../../../redux/LayersSlice";

const MenuLayers = () => {

    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<GetLayerDto[]>([]);
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        const layerClient = new LayerClient();
        layerClient.layerAll().then(res => {
            setInitLoading(false);
            setList(res);
            dispatch(setLayers(res))
        })
    }, []);


    const [isShown, setIsShown] = useState(false);

    const setShown = (show: boolean) => {
        setIsShown(show);
        const layerClient = new LayerClient();
        layerClient.layerAll().then(res => {
            setInitLoading(false);
            setList(res);
        })
    }

    const {confirm} = Modal;
    const [form] = Form.useForm();

    function showEdit(item: GetLayerDto) {
        confirm({
            title: "Изменение слоя",
            icon: <EditOutlined />,
            content: <LayerForm form={form} layerDto={item}/>,
            onOk: () => {
                console.log(form.getFieldsValue())
                form
                    .validateFields()
                    .then(async (values) => {
                        form.resetFields();

                        const model = new UpdateLayerDto({
                            id: item.id,                                // ЧЗХ ваще
                            name: values.layerName,
                            objects: values.layerObjects,
                            isSelectedByUser: item.isSelectedByUser
                        });
                        const layerClient = new LayerClient();
                        await layerClient.layerPUT(model)
                    })
                    .catch((info) => {
                        form.resetFields();
                        console.log('Validate Failed:');
                    });
            },
            onCancel: () => {

            }
        })
    }
    
    function showAdd(item: CreateLayerDto) {
        confirm({
            title: "Добавление слоя",
            icon: <PlusOutlined />,
            content: <LayerForm form={form} layerDto={item}/>,
            onOk: () => {
                form
                    .validateFields()
                    .then(async (values) => {
                        form.resetFields();
                        
                        const model = new CreateLayerDto({
                            name: values.layerName,
                            objects: []
                        });
                        const layerClient = new LayerClient();
                        await layerClient.layerPOST(model)
                    })
                    .catch((info) => {
                        form.resetFields();
                        console.log('Validate Failed:');
                    });
            },
            onCancel: () => {
                
            }
        })
    }

    function deleteLayer(item: GetLayerDto) {
        const layerClient = new LayerClient();
        layerClient.layerDELETE(item.id).then()
    }
    
    const onChange = (layer: GetLayerDto, e: CheckboxChangeEvent) => {
        const layerClient = new LayerClient()
        layerClient.selection(new SetLayerSelectionDto({layerId: layer.id, selection: e.target.checked}))
            .then(() => {
                dispatch(setSelection({selection: e.target.checked, id: layer.id}))
            })
    };
    
    return (
        <>
            <List
                style={{backgroundColor: 'white'}}
                size="small"
                header={<div>Слои</div>}
                bordered
                dataSource={list}
                renderItem={(item: GetLayerDto, index: number) =>
                    <List.Item>
                        <Checkbox
                            onChange={e => onChange(item, e)}
                            id={item.id}
                            defaultChecked={item.isSelectedByUser}
                            name={item.name}
                        >
                            {item.name}
                        </Checkbox>
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
                                    onClick={() => deleteLayer(item)}
                            ></Button>
                        </div>
                    </List.Item>}
            />
            <Button type="primary" shape={"default"} style={{width: "100%"}} onClick={() => showAdd(new CreateLayerDto({name: "", objects: []}))}>
                Создать новый слой
            </Button>
        </>
    );
}

export default MenuLayers;