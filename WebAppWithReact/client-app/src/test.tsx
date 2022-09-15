import React from "react";
import 'antd/dist/antd.css'
import { DatePicker } from 'antd';
import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Layout,Space ,Upload,Popconfirm } from 'antd';


const { Header, Footer, Sider, Content } = Layout;
class TestComponent extends React.Component{

    render() {
        
        return (
            <div>
                <h1>Заголовок</h1>
                <p>Первый абзац.</p>
                <p>Второй абзац.</p>
                <DatePicker />
                <div>
                    <Space>
                        Space
                        <Button type="primary">Button</Button>
                        <Upload>
                            <Button>
                                <UploadOutlined /> Click to Upload
                            </Button>
                        </Upload>
                        <Popconfirm title="Are you sure delete this task?" okText="Yes" cancelText="No">
                            <Button>Confirm</Button>
                        </Popconfirm>
                    </Space>
                </div>
            </div>
    );
    }
}

export default TestComponent;