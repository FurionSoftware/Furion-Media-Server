import { Menu } from "antd";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Library from "../models/Library";
import layoutSlice from "../store/layoutSlice";
import { RootState } from "../store/store";

const SMenu = styled(Menu)`
	height: 100%;
`;

function SideNav() {
	const { selectedNavKeys } = useSelector(
		(state: RootState) => state.layoutReducer
	);
	const dispatch = useDispatch();
	const [libraries, setLibraries] = useState<Library[]>([]);
	useEffect(() => {
		Axios.get<Library[]>("/libraries").then((response) => {
			setLibraries(response.data);
		});
	}, []);
	function handleMenuClick(event: any) {
		dispatch(layoutSlice.actions.setSelectedNavKeys([event.key]));
	}
	return (
		<SMenu
			theme="light"
			selectedKeys={selectedNavKeys}
			onClick={handleMenuClick}
		>
			<SMenu.Item key="sideDashboard">
				<Link to="/dashboard">Dashboard</Link>
			</SMenu.Item>
			<SMenu.Divider />
			<SMenu.ItemGroup key="sideLibraries" title="Libraries">
				{libraries.map((item) => (
					<SMenu.Item key={`side${item.name}`}>
						<Link to={`/library/${item.name.replace(/ /g, "_")}`}>
							Movies
						</Link>
					</SMenu.Item>
				))}
			</SMenu.ItemGroup>
		</SMenu>
	);
}

export default SideNav;
