import React from "react";
import 'antd/dist/antd.css'
import {Menu} from 'antd';
import {BarsOutlined, CalculatorOutlined, EuroOutlined, HeartOutlined, MenuOutlined} from '@ant-design/icons';


class Navbar extends React.Component {
    render() {
        return (
            <div>
                <div style={{
                    float: 'left',
                    width: '220px',
                    height: '31px',

                    background: 'rgba(255, 255, 255, 0.3)'
                }}>
                    <a href="/">
                        ываываываы
                    </a>
                </div>

                <Menu mode="horizontal" overflowedIndicator={<MenuOutlined/>}>
                    <Menu.Item key="1" icon={<EuroOutlined/>}>
                        <a href="/"> Пример 1 </a>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<HeartOutlined/>}>
                        <a href="/"> Пример 2 </a>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<CalculatorOutlined/>}>
                        <a href="/"> Пример 3 </a>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<BarsOutlined/>}>
                        Пример 4
                    </Menu.Item>

                </Menu>
            </div>)
    };

}


export default Navbar;