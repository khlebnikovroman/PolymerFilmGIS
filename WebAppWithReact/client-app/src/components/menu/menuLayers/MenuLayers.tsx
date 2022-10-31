import React, {useState} from "react";
import {AppstoreOutlined, MailOutlined, SettingOutlined, VerticalAlignBottomOutlined} from '@ant-design/icons';
import type { MenuProps, ListProps } from 'antd';
import {Button, Menu, Modal} from 'antd';
import { Divider, List, Typography } from 'antd';
import ItemLayers from "../../items/ItemLayers";

type MenuItem = Required<MenuProps>['items'][number];

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
        key: number
    }
    
    const items:ItemType[] = [
        {
            label: 'Слой 1',
            key: 0,
        },
        {
            label: 'Слой 2',
            key: 1,
        },
        {
            label: 'Слой 3',
            key: 2,
        },
        {
            label: 'Слой 4',
            key: 3,
        },
        {
            label: 'Слой 5',
            key: 4,
        },
        {
            label: 'Слой 6',
            key: 5,
        },
        {
            label: 'Создать свой слой',
            key: 6,
        }
    ]
    
    const layers = items.map(item => <ItemLayers name={item.label} key={item.key} setModal={setModal}/>);
    
    const onClick: MenuProps['onClick'] = e => {
        console.log(e.key);
        if (e.key === '6'){
            setIsShown(true);
        }

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
                renderItem={item => <List.Item style={{ width: 256 }}><ItemLayers name={item.label} key={item.key} setModal={setModal}/></List.Item>}
            />
            <Modal title="Basic Modal" open={isShown} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </>
    );
}

export default MenuLayers;