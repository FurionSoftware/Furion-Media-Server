import { Button, Col, Row, Tag, Typography } from "antd";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import PageContainer from "../components/PageContainer";
import MediaDetail from "../models/MediaDetail";
import {
  SMediaCard,
  SPageContainer,
  SResolutionTag,
  SVideoMeta,
} from "./MediaDetails.styled";
import MediaCard from "../components/MediaCard";

interface Params {
  mediaId: string;
}

function MediaDetails() {
  const { mediaId } = useParams<Params>();
  const [mediaDetail, setMediaDetail] = useState<MediaDetail>(
    {} as MediaDetail
  );
  useEffect(() => {
    Axios.get<MediaDetail>(`/media/detail/${mediaId}`).then((response) => {
      if (response.data.releaseDate) {
        response.data.releaseDate = new Date(response.data.releaseDate);
      }

      setMediaDetail(response.data);
    });
  }, []);

  return (
    <SPageContainer>
      <div style={{ display: "flex" }}>
        <SMediaCard hoverable={false} mediaItem={mediaDetail} />
        <SVideoMeta>
          <Typography.Title style={{ marginBottom: 0 }} level={3}>
            {mediaDetail.title}&nbsp;
            {mediaDetail.releaseDate &&
              `(${mediaDetail.releaseDate.getFullYear()})`}
          </Typography.Title>
          {mediaDetail.duration > 0 && (
            <span className="meta-item duration">
              {mediaDetail.duration / 60} minutes
            </span>
          )}
          <div className="meta-item">
            {Boolean(mediaDetail.resolution) && (
              <SResolutionTag color="blue">
                {mediaDetail.resolution} {mediaDetail.quality}
              </SResolutionTag>
            )}
          </div>
          <div className="meta-item">
            {Boolean(mediaDetail.codec) && (
              <Tag color="orange">{mediaDetail.codec}</Tag>
            )}
            {Boolean(mediaDetail.audio) && (
              <Tag color="orange">{mediaDetail.audio}</Tag>
            )}
          </div>
          <Typography.Paragraph style={{ marginTop: "auto" }}>
            {mediaDetail.overview}
          </Typography.Paragraph>
        </SVideoMeta>
      </div>
    </SPageContainer>
  );
}

export default MediaDetails;
