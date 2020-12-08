import React, { useState } from "react";
import styled from "styled-components";
import { Route, BrowserRouter, Switch, useHistory } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { Button, Divider, Layout, Menu } from "antd";
import {
  ReloadOutlined,
  SettingFilled,
  SettingOutlined,
  SettingTwoTone,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Settings from "./pages/Settings";
import Library from "./pages/Library";
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

const SHeader = styled(Layout.Header)`
  //padding-bottom: 5px !important;
  background-color: white !important;
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
      <SHeader>
        <SNavbar>
          <Menu
            theme="light"
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
      </SHeader>
      <Layout>
        <Sider>
          <SMenu
            theme="light"
            selectedKeys={sidebarKeys}
            onClick={handleSidebarClick}
          >
            <SMenu.Item key="dashboard">
              <Link to="/dashboard" onClick={() => setSelectedKeys([])}>
                Dashboard
              </Link>
            </SMenu.Item>
            <SMenu.Divider />
            <SMenu.ItemGroup key="libraries" title="Libraries">
              <SMenu.Item key="2">
                <Link
                  to={`/library/movies`}
                  onClick={() => setSelectedKeys([])}
                >
                  Movies
                </Link>
              </SMenu.Item>
            </SMenu.ItemGroup>
          </SMenu>
        </Sider>
        <Content>
          <Switch>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/library/:name">
              <Library />
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
