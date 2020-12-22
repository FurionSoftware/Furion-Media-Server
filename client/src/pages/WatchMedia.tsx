import { Button, Modal, PageHeader, Row, Typography } from "antd";
import Axios from "axios";
import moment from "moment";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import PageContainer from "../components/PageContainer";
import MediaDetail from "../models/MediaDetail";
import VideoPlayer from "../components/VideoPlayer";

const SContainer = styled.div`
  padding-top: 10px;
  padding-left: 20px;
  padding-right: 20px;
  width: 100%;
  height: 100%;
`;

const STitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface Params {
  mediaId: string;
}

function WatchMedia() {
  const { mediaId } = useParams<Params>();
  const [mediaItem, setMediaItem] = useState<MediaDetail>({} as MediaDetail);
  const interval = useRef(0);
  const [currentDuration, setCurrentDuration] = useState(0);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    Axios.get<MediaDetail>(`/media/detail/${+mediaId}`).then((response) => {
      setMediaItem(response.data);

      if (response.data.durationPlayed > 30) {
        setConfirmOpen(true);
      } else {
        setPlaying(true);
      }
    });
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  function handleRestartClick() {
    setPlaying(true);
    setConfirmOpen(false);
  }

  function getDurationString(durationPlayed: number) {
    const duration = moment().startOf("day").seconds(durationPlayed);
    let outputString;
    if (duration.hours() >= 1) {
      outputString = duration.format("HH:mm:ss");
    } else {
      outputString = duration.format("mm:ss");
    }
    return outputString;
  }

  function handleResumeClick() {
    setConfirmOpen(false);
    setCurrentDuration(mediaItem.durationPlayed);
    setPlaying(true);
  }

  return (
    <SContainer>
      <PageContainer
        style={{ height: "100%" }}
        loading={!Boolean(mediaItem.id)}
      >
        {mediaItem.id > 0 && (
          <>
            <Modal
              destroyOnClose
              footer={false}
              centered
              visible={confirmOpen}
              onCancel={handleRestartClick}
            >
              <Typography.Title level={3}>
                Continue where you left off?
              </Typography.Title>
              <Row justify="end" style={{ paddingTop: 20 }}>
                <Button
                  type="default"
                  size="large"
                  onClick={handleRestartClick}
                >
                  Start from beginning
                </Button>
                <Button
                  size="large"
                  style={{ marginLeft: 10 }}
                  onClick={handleResumeClick}
                  type="primary"
                >
                  Resume from {getDurationString(mediaItem.durationPlayed)}
                </Button>
              </Row>
            </Modal>
            <STitleRow>
              <Typography.Title level={2}>{mediaItem.title}</Typography.Title>
              <div style={{ height: 50, width: 50 }}>
                <google-cast-launcher></google-cast-launcher>
              </div>
            </STitleRow>
            <VideoPlayer
              mediaItem={mediaItem}
              playOnLoad={playing}
              initialDuration={currentDuration}
            />
          </>
        )}
      </PageContainer>
    </SContainer>
  );
}

export default WatchMedia;
