import React, {useEffect, useState} from "react";
import {Button, Checkbox, Form, List, Modal} from 'antd';
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {GetLayerDto, LayerClient} from "../../../services/Clients";
import CreateLayerModal from "./CreateLayerModal";
import {EditOutlined} from "@ant-design/icons";
import EditLayerForm from "./EditLayerForm";

const MenuLayers = () => {

    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [layers, setLayers] = useState<GetLayerDto[]>([]);
    const [list, setList] = useState<GetLayerDto[]>([]);

    useEffect(() => {
        const layerClient = new LayerClient();
        layerClient.layerAll().then(res => {
            setInitLoading(false);
            setLayers(res);
            setList(res);
        })
    }, []);


    const [isShown, setIsShown] = useState(false);

    const setShown = (show: boolean) => {
        setIsShown(show);
        const layerClient = new LayerClient();
        layerClient.layerAll().then(res => {
            setInitLoading(false);
            setLayers(res);
            setList(res);
        })
    }

    const {confirm} = Modal;
    const [form] = Form.useForm();

    function showEdit(item: GetLayerDto) {
        confirm({

            title: "Изменение слоя",
            icon: <div/>,
            content: <EditLayerForm form={form} layerDto={item}/>,
            onOk: () => {

            },
        })
    }

    function showAdd() {

    }

    const onChange = (e: CheckboxChangeEvent) => {
        console.log(`checked = ${e.target.checked}`);
        console.log(`target name = ${e.target.id}`);
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
                            onChange={onChange}
                            id={item.id}
                            name={item.name}
                        >
                            {item.name}
                        </Checkbox>
                        <Button type="primary"
                                shape="default"
                                icon={<EditOutlined/>}
                                style={{marginLeft: '8px'}}
                                onClick={() => showEdit(item)}></Button>
                    </List.Item>}
            />
            <Button type="primary" shape={"default"} style={{width: "100%"}} onClick={showAdd}>Создать новый
                слой</Button>
            <CreateLayerModal open={isShown} setShown={setShown}/>
        </>
    );
}

export default MenuLayers;