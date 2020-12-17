import { Spin } from "antd";
import React, { Fragment } from "react";
import { CSSProperties } from "styled-components";

interface Props {
	loading?: boolean;
	children: React.ReactNode;
	style?: CSSProperties;
	className?: string;
}
function PageContainer(props: Props) {
	return props.loading ? (
		<Spin
			style={{
				position: "absolute",
				top: "50%",
				left: "50%",
			}}
			size="large"
		/>
	) : (
		<div className={props.className} style={props.style}>
			{props.children}
		</div>
	);
}

export default PageContainer;
