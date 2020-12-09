import {
	EditOutlined,
	EllipsisOutlined,
	PlayCircleOutlined,
} from "@ant-design/icons";
import { Card } from "antd";
import Meta from "antd/lib/card/Meta";
import React, { useState } from "react";
import MediaListItem from "../models/MediaListItem";
import MediaEditModal from "./MediaEditModal";
import WatchMediaModal from "./WatchMediaModal";

interface Props {
	mediaItem: MediaListItem;
}
function MediaCard(props: Props) {
	const [editOpen, setEditOpen] = useState(false);
	const [watchOpen, setWatchOpen] = useState(false);
	function handleEditClick() {
		setEditOpen(true);
	}

	function handleEditClose() {
		setEditOpen(false);
	}
	function handleWatchClick() {
		setWatchOpen(true);
	}
	function handleWatchClose() {
		setWatchOpen(false);
	}
	return (
		<Card
			hoverable
			actions={[
				<EditOutlined key="edit" onClick={handleEditClick} />,
				<EllipsisOutlined />,
				<PlayCircleOutlined onClick={handleWatchClick} />,
			]}
		>
			<Card.Meta title={props.mediaItem.title}></Card.Meta>
			<MediaEditModal
				onClose={handleEditClose}
				mediaItem={props.mediaItem}
				open={editOpen}
			/>
			<WatchMediaModal
				open={watchOpen}
				onClose={handleWatchClose}
				mediaItem={props.mediaItem}
			/>
		</Card>
	);
}

export default MediaCard;
