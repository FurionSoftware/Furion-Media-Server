import { Form, Input, Modal } from "antd";
import { FormInstance } from "antd/lib/form";
import React, { Fragment, useRef } from "react";
import MediaListItem from "../models/MediaListItem";

interface Props {
	mediaItem: MediaListItem;
	open: boolean;
	onClose: () => void;
}
function MediaEditModal(props: Props) {
	const [form] = Form.useForm();
	return (
		<Fragment>
			{props.open && (
				<Modal
					destroyOnClose
					onCancel={props.onClose}
					visible
					title={`Edit ${props.mediaItem.title}`}
					okText="Save Changes"
				>
					<Form form={form}>
						<Form.Item
							initialValue={props.mediaItem.title}
							required={false}
							label="Title"
							name="title"
							rules={[
								{
									required: true,
									message:
										"Please enter a title for this media!",
								},
							]}
						>
							<Input />
						</Form.Item>
					</Form>
				</Modal>
			)}
		</Fragment>
	);
}

export default MediaEditModal;
