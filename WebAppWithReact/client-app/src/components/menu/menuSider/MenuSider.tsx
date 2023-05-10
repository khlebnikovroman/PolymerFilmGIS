import React, {useState} from 'react';
import Sider from "antd/es/layout/Sider";


const MenuSider = () => {
    const [collapsed, setCollapsed] = useState(false)
    return (
        <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
            Left Sidebar
        </Sider>
    );
}

export default MenuSider;