import { Input, Modal } from "antd";
import Form from "antd/lib/form/Form";
import React, { Fragment } from "react";
import styled from "styled-components";
import MediaListItem from "../models/MediaListItem";

const SModal = styled(Modal)`
	& .ant-modal-content {
		height: calc(100vh - 20px);
		top: 0 !important;
	}
	&.ant-modal {
		top: 10px !important;
		padding-bottom: 0;
	}
`;

interface Props {
	mediaItem: MediaListItem;
	open: boolean;
	onClose: () => void;
}
function WatchMediaModal(props: Props) {
	return (
		<Fragment>
			{props.open && (
				<SModal
					width="100%"
					footer={null}
					destroyOnClose
					visible
					title={`Edit ${props.mediaItem.title}`}
					onCancel={props.onClose}
				></SModal>
			)}
		</Fragment>
	);
}

export default WatchMediaModal;
