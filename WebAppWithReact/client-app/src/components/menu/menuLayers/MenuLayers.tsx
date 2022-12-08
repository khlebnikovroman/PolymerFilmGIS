import React, {useEffect, useState} from "react";
import {Button, Checkbox, List} from 'antd';
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {GetLayerDto, LayerClient} from "../../../services/Clients";
import CreateLayerModal from "./CreateLayerModal";

const MenuLayers = (): JSX.Element => {

    // useEffect(()=>{
    //     const layers: GetLayerDto[] =  layerClient.layerAll()
    //
    // })


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


    const onClick = () => {
        setIsShown(true);
    };
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
                    <List.Item style={{width: 256}}>
                        <Checkbox
                            onChange={onChange}
                            id={item.id}
                            name={item.name}
                        >
                            {item.name}
                        </Checkbox>
                    </List.Item>}
            />
            <Button type="primary" shape={"default"} style={{width: 256}} onClick={onClick}>Создать новый слой</Button>
            <CreateLayerModal open={isShown} setShown={setShown}/>
        </>
    );
}

export default MenuLayers;