import { EditOutlined, EllipsisOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Card, Image } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import MediaListItem from "../models/MediaListItem";
import MediaEditModal from "./MediaEditModal";

const SDescription = styled.div`
    padding-top: 10px;
    max-height: 50px;
`;

interface Props {
    mediaItem: MediaListItem;
}
function MediaCard(props: Props) {
    const [editOpen, setEditOpen] = useState(false);
    const history = useHistory();
    console.log(props.mediaItem.thumbnailUrl);

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
            actions={[<EditOutlined key="edit" onClick={handleEditClick} />, <EllipsisOutlined />, <PlayCircleOutlined onClick={handleWatchClick} />]}
        >
            <Card.Meta
                title={props.mediaItem.title}
                description={<Image placeholder src={`https://image.tmdb.org/t/p/w185${props.mediaItem.thumbnailUrl}`} />}
            ></Card.Meta>
            <SDescription>{props.mediaItem.overview}</SDescription>

            <MediaEditModal onClose={handleEditClose} mediaItem={props.mediaItem} open={editOpen} />
        </Card>
    );
}

export default MediaCard;
