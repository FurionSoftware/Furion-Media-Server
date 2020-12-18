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
      setMediaDetail(response.data);
    });
  }, []);

  return (
    <SPageContainer>
      <div style={{ display: "flex" }}>
        <img
          style={{ paddingRight: 10 }}
          alt="Media Poster"
          src={`https://image.tmdb.org/t/p/w185${mediaDetail.thumbnailUrl}`}
        />
        <SVideoMeta>
          <Typography.Title level={3}>{mediaDetail.title}</Typography.Title>
          <span className="meta-item">{mediaDetail.duration}</span>
          <div className="meta-item">
            {Boolean(mediaDetail.codec) && (
              <Tag color="blue">{mediaDetail.codec}</Tag>
            )}
            {Boolean(mediaDetail.audio) && (
              <Tag color="blue">{mediaDetail.audio}</Tag>
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
