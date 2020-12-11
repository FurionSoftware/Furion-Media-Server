import { Spin } from "antd";
import React, { Fragment } from "react";

interface Props {
    loading?: boolean;
    children: React.ReactNode;
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
        <Fragment>{props.children}</Fragment>
    );
}

export default PageContainer;
