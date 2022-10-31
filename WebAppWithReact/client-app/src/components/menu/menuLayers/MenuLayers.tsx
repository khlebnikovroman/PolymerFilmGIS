import React, {useState} from "react";
import {AppstoreOutlined, MailOutlined, SettingOutlined, VerticalAlignBottomOutlined} from '@ant-design/icons';
import type { MenuProps, ListProps } from 'antd';
import {Button, List, Menu, Modal} from 'antd';
import { Divider, Typography } from 'antd';
import ListT from './MyList';
import ItemLayer from "../../items/ItemLayers";

const MenuLayers = () => {
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
    
    const items:ItemType[] = [
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
    
    const layers = items.map(item => <ItemLayer name={item.label} key={item.key}/>);
    
    const onClick = () => {
        setIsShown(true);
    };
    return(
        <>
            {/*<Menu*/}
            {/*    onClick={onClick}*/}
            {/*    style={{ width: 256 }}*/}
            {/*    defaultSelectedKeys={['1']}*/}
            {/*    defaultOpenKeys={['sub1']}*/}
            {/*    mode="inline"*/}
            {/*    items={layers}*/}
            {/*/>*/}
            
            <List
                style={{backgroundColor: 'white'}}
                size="small"
                header={<div>Header</div>}
                bordered
                dataSource={items}
                renderItem={item => <List.Item style={{ width: 256 }}><ItemLayer name={item.label} key={item.key}/></List.Item>}
            />
            {/*<ListT dataSource={items} renderItem={item =>*/}
            {/*    <ListT.Item style={{ width: 256 }}>*/}
            {/*        <ItemLayers name={item.label} key={item.key}/>*/}
            {/*    </ListT.Item>}*/}
            {/*/>*/}
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