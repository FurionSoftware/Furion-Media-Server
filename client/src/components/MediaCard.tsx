import { EditOutlined, EllipsisOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Card, Dropdown, Image, Menu, Progress } from "antd";
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
        //white-space: normal;
        max-height: 100px;
    }
`;

const SImageContainer = styled.div`
    width: 180px !important;
    height: 180px !important;
    & img {
        object-fit: cover !important;
        object-position: top !important;
        width: 100% !important;
        height: 100% !important;
        background-color: lightgray;
    }
`;

const SCardMeta = styled(Card.Meta)`
    font-size: 14px !important;
`;

const SProgress = styled(Progress)`
    & .ant-progress-inner {
        margin-top: -20px !important;
        border-radius: 0;
    }
`;

interface Props {
    mediaItem: MediaListItem;
}
function MediaCard(props: Props) {
    const [editOpen, setEditOpen] = useState(false);
    const history = useHistory();

    function handleEditClick(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
        setEditOpen(true);
        event.stopPropagation();
    }

    function handleEditClose() {
        setEditOpen(false);
    }
    function handleWatchClick(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
        event.stopPropagation();
        history.push(`/media/watch/${props.mediaItem.id}`);
    }
    function getDurationPercent() {
        if (!props.mediaItem.duration || !props.mediaItem.duration) {
            return 0;
        }
        return (props.mediaItem.durationPlayed / props.mediaItem.duration) * 100;
    }

    function handleCardClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (!editOpen) {
            history.push(`/media/details/${props.mediaItem.id}`);
        }
    }

    return (
        <SCard
            onClick={handleCardClick}
            bordered={false}
            bodyStyle={{ padding: 12 }}
            style={{ width: 180 }}
            hoverable
            actions={[<EditOutlined title="Edit video" onClick={handleEditClick} />, <PlayCircleOutlined title="Watch video" onClick={handleWatchClick} />]}
            cover={
                <SImageContainer>
                    <img src={props.mediaItem.thumbnailUrl ? `https://image.tmdb.org/t/p/w185${props.mediaItem.thumbnailUrl}` : imagePath} />
                    <SProgress strokeLinecap="square" strokeWidth={4} percent={getDurationPercent()} strokeColor="rgb(255 176 68)" showInfo={false} />
                </SImageContainer>
            }
        >
            <SCardMeta title={props.mediaItem.title}></SCardMeta>

            <MediaEditModal onClose={handleEditClose} mediaItem={props.mediaItem} open={editOpen} />
        </SCard>
    );
}

export default MediaCard;
