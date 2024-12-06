import React, { useState } from "react";

// Components
import Processing from "../components/Processing";

// AntDesign
import {
  ExperimentOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
const { Content, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem("Generar Resultados", "1", <FileDoneOutlined />), 
  getItem("Simulador", "2", <ExperimentOutlined />)
];

export default function BasicTabs() {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div style={{color: 'white', textAlign: 'center',  fontWeight: 'bold', margin: '15px 0'}}>♻️ Recycle App ♻️</div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Content
          style={{
            margin: "16px",
          }}
        >
          {/* <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb> */}
          <Processing />
        </Content>
      </Layout>
    </Layout>
  );
}
