import {
  EditOutlined,
  EllipsisOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Card, Dropdown, Image, Menu, Progress } from "antd";
import React, { CSSProperties, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import MediaListItem from "../models/MediaListItem";
import MediaEditModal from "./MediaEditModal";
import imagePath from "../assets/Placeholder.png";
import {
  SCard,
  SCardMeta,
  SImageContainer,
  SProgress,
} from "./MediaCard.styled";
import { CardProps } from "antd/es/card";

interface Props extends CardProps {
  mediaItem: MediaListItem;
}
function MediaCard(props: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const history = useHistory();
  const { mediaItem, ...slicedProps } = props;

  function handleEditClick(
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) {
    setEditOpen(true);
    event.stopPropagation();
  }

  function handleEditClose() {
    setEditOpen(false);
  }
  function handleWatchClick(
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) {
    event.stopPropagation();
    history.push(`/media/watch/${props.mediaItem.id}`);
  }
  function getDurationPercent() {
    if (!props.mediaItem.duration || !props.mediaItem.duration) {
      return 0;
    }
    return (props.mediaItem.durationPlayed / props.mediaItem.duration) * 100;
  }

  function handleCardClick(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
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
      actions={[
        <EditOutlined title="Edit video" onClick={handleEditClick} />,
        <PlayCircleOutlined title="Watch video" onClick={handleWatchClick} />,
      ]}
      cover={
        <SImageContainer>
          <img
            src={
              props.mediaItem.thumbnailUrl
                ? `https://image.tmdb.org/t/p/w185${props.mediaItem.thumbnailUrl}`
                : imagePath
            }
          />
          <SProgress
            strokeLinecap="square"
            strokeWidth={4}
            percent={getDurationPercent()}
            strokeColor="rgb(255 176 68)"
            showInfo={false}
          />
        </SImageContainer>
      }
      {...slicedProps}
    >
      <SCardMeta title={props.mediaItem.title} />

      <MediaEditModal
        onClose={handleEditClose}
        mediaItem={props.mediaItem}
        open={editOpen}
      />
    </SCard>
  );
}

export default MediaCard;
