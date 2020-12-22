import { Col, Row, Tag, Typography } from "antd";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import PageContainer from "../components/PageContainer";
import MediaDetail from "../models/MediaDetail";

const SPageContainer = styled(PageContainer)`
  padding: 20px;
`;

const SVideoMeta = styled.div`
  display: flex;
  flex-direction: column;
  & .meta-item {
    padding-bottom: 5px;
    &.duration {
      font-size: 16px;
    }
  }
`;

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
        <img
          style={{ paddingRight: 10 }}
          alt="Media Poster"
          src={`https://image.tfmdb.org/t/p/w185${mediaDetail.thumbnailUrl}`}
        />
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
            {Boolean(mediaDetail.codec) && (
              <Tag color="orange">{mediaDetail.codec}</Tag>
            )}
            {Boolean(mediaDetail.audio) && (
              <Tag color="orange">{mediaDetail.audio}</Tag>
            )}
          </div>
          <div className="meta-item">
            {Boolean(mediaDetail.resolution) && (
              <Tag color="blue">
                {mediaDetail.resolution} {mediaDetail.quality}
              </Tag>
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
