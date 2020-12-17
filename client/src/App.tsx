import React, { useState } from "react";
import styled from "styled-components";
import { Route, BrowserRouter, Switch, useHistory } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { Button, Divider, Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import Settings from "./pages/Settings";
import Library from "./pages/Library";
import ReloadLibraryButton from "./components/ReloadLibraryButton";
import { RootState } from "./store/store";
import { useDispatch, useSelector } from "react-redux";
import layoutSlice from "./store/layoutSlice";
import TopNav from "./components/TopNav";
import SideNav from "./components/SideNav";
import WatchMedia from "./pages/WatchMedia";
import MediaDetails from "./pages/MediaDetails";
const { Header, Footer, Sider, Content } = Layout;

const SHeader = styled(Layout.Header)`
	//padding-bottom: 5px !important;
	background-color: white !important;
`;
function App() {
	return (
		<Layout style={{ height: "inherit" }}>
			<SHeader>
				<TopNav />
			</SHeader>
			<Layout style={{ height: "inherit" }}>
				<Sider>
					<SideNav />
				</Sider>
				<Content style={{ height: "inherit" }}>
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
						<Route path="/media/watch/:mediaId">
							<WatchMedia />
						</Route>
						<Route path="/media/details/:mediaId">
							<MediaDetails />
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
