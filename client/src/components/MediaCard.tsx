import {
	EditOutlined,
	EllipsisOutlined,
	PlayCircleOutlined,
} from "@ant-design/icons";
import { Card } from "antd";
import Meta from "antd/lib/card/Meta";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import MediaListItem from "../models/MediaListItem";
import MediaEditModal from "./MediaEditModal";
import WatchMediaModal from "./WatchMediaModal";

interface Props {
	mediaItem: MediaListItem;
}
function MediaCard(props: Props) {
	const [editOpen, setEditOpen] = useState(false);
	const history = useHistory();
	function handleEditClick() {
		setEditOpen(true);
	}

	function handleEditClose() {
		setEditOpen(false);
	}
	function handleWatchClick() {
		history.push(`/media/watch/${props.mediaItem.id}`);
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
			{props.mediaItem.durationPlayed}
			<Card.Meta title={props.mediaItem.title}></Card.Meta>
			<MediaEditModal
				onClose={handleEditClose}
				mediaItem={props.mediaItem}
				open={editOpen}
			/>
		</Card>
	);
}

export default MediaCard;
