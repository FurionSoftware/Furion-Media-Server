import React, { useState } from "react";
import styled from "styled-components";
import { Route, BrowserRouter, Switch, useHistory } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { Button, Layout, Menu } from "antd";
import {
  SettingFilled,
  SettingOutlined,
  SettingTwoTone,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Settings from "./pages/Settings";
const { Header, Footer, Sider, Content } = Layout;
const SMenu = styled(Menu)`
  height: 100%;
`;
const SNavbar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
`;

const SButton = styled(Button)`
  border: none;
`;
function App() {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [sidebarKeys, setSidebarKeys] = useState([]);
  const history = useHistory();

  function handleNavMenuClick(event: any) {
    setSelectedKeys(event.key);
    setSidebarKeys([]);
  }

  function handleSidebarClick(event: any) {
    setSidebarKeys(event.key);
    setSelectedKeys([]);
  }

  function handleSettingsClick() {
    history.push("/settings");
  }
  return (
    <Layout style={{ height: "inherit" }}>
      <Header
        style={{
          backgroundColor: "white",
          padding: 0,
        }}
      >
        <SNavbar>
          <Menu
            onClick={handleNavMenuClick}
            mode="horizontal"
            selectedKeys={selectedKeys}
          >
            <Menu.Item
              onClick={handleSettingsClick}
              key="settings"
              icon={<SettingOutlined />}
            >
              Settings
            </Menu.Item>
          </Menu>
        </SNavbar>
      </Header>
      <Layout>
        <Sider>
          <SMenu
            theme="light"
            selectedKeys={sidebarKeys}
            onClick={handleSidebarClick}
          >
            <SMenu.Item key="1">
              <Link to="/dashboard" onClick={() => setSelectedKeys([])}>
                Dashboard
              </Link>
            </SMenu.Item>
          </SMenu>
        </Sider>
        <Content>
          <Switch>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/settings">
              <Settings />
            </Route>
            <Route path="/">
              <Dashboard />
            </Route>
          </Switch>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
