import React, {useEffect, useState} from "react";
import {Button, Checkbox, List, Modal} from 'antd';
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {GetLayerDto, LayerClient} from "../../../services/Clients";

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

    const handleOk = () => {
        setIsShown(false);
    };

    const handleCancel = () => {
        setIsShown(false);
    };

    const setModal = () => {
        setIsShown(true);
    }

    interface ItemType {
        label: string
        key: string
    }


    const items: ItemType[] = [
        {
            label: 'Слой 1',
            key: '0',
        },
        {
            label: 'Слой 2',
            key: '1',
        },
        {
            label: 'Слой 3',
            key: '2',
        },
        {
            label: 'Слой 4',
            key: '3',
        },
        {
            label: 'Слой 5',
            key: '4',
        },
        {
            label: 'Слой 6',
            key: '5',
        }
    ]

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
                header={<div>Header</div>}
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
            <Button type="primary" shape={"default"} style={{width: 256}} onClick={onClick}>Создать свой слой</Button>
            <Modal title="Basic Modal" open={isShown} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </>
    );
}

export default MenuLayers;