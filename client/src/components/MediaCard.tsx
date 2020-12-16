import {
	EditOutlined,
	EllipsisOutlined,
	PlayCircleOutlined,
} from "@ant-design/icons";
import { Card, Image } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import MediaListItem from "../models/MediaListItem";
import MediaEditModal from "./MediaEditModal";
import imagePath from "../assets/Placeholder.png";

const SCard = styled(Card)`
	& .ant-card-body {
		//text-align: center;
		//padding-top: 10px;
		//padding-bottom: 10px;
		//padding-left: 10px;
		//padding-right: 0;
	}
	& .ant-card-meta-title {
		white-space: normal;
		max-height: 100px;
	}
`;

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
		<SCard
			bodyStyle={{ maxWidth: 150 }}
			hoverable
			actions={[
				<EditOutlined key="edit" onClick={handleEditClick} />,
				<EllipsisOutlined />,
				<PlayCircleOutlined onClick={handleWatchClick} />,
			]}
			cover={
				<Image
					width={150}
					height={225}
					style={{ backgroundColor: "lightgray" }}
					fallback={imagePath}
					src={`https://image.tmdb.org/t/p/w185${props.mediaItem.thumbnailUrl}`}
				/>
			}
		>
			<Card.Meta title={props.mediaItem.title}></Card.Meta>

			<MediaEditModal
				onClose={handleEditClose}
				mediaItem={props.mediaItem}
				open={editOpen}
			/>
		</SCard>
	);
}

export default MediaCard;
