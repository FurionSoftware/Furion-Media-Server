import { SettingOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import layoutSlice from "../store/layoutSlice";
import { RootState } from "../store/store";
import ReloadLibraryButton from "./ReloadLibraryButton";
import { SNavbar } from "./TopNav.styled";

function TopNav() {
  const history = useHistory();
  const { selectedNavKeys } = useSelector(
    (state: RootState) => state.layoutReducer
  );
  const dispatch = useDispatch();

  function handleSettingsClick() {
    history.push("/settings");
  }
  function handleMenuClick(event: any) {
    dispatch(layoutSlice.actions.setSelectedNavKeys([event.key]));
  }
  return (
    <SNavbar>
      <ReloadLibraryButton />
      <Menu
        theme="light"
        onClick={handleMenuClick}
        mode="horizontal"
        selectedKeys={selectedNavKeys}
      >
        <Menu.Item
          onClick={handleSettingsClick}
          key="navSettings"
          icon={<SettingOutlined />}
        >
          Settings
        </Menu.Item>
      </Menu>
    </SNavbar>
  );
}

export default TopNav;
