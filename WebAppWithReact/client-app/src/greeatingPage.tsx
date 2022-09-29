import {Layout} from 'antd';
import React from 'react';
import Navbar from "./navbar";

const {Header, Content, Footer} = Layout;

const greating: React.FC = () => (
    <div>
        <Navbar/>
        <Content className="site-layout" style={{padding: '0 50px', marginTop: 64}}>

            <div className="site-layout-background" style={{padding: 24, minHeight: 380}}>
                Content
            </div>

        </Content>
        <Footer className="ant-layout-footer" style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
    </div>
);

export default greating;