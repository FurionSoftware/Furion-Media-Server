import { PlayCircleOutlined } from "@ant-design/icons";
import { Button, Modal, PageHeader, Row, Typography } from "antd";
import Grid from "antd/lib/card/Grid";
import Axios from "axios";
import moment from "moment";
import React, { Fragment, useEffect, useRef, useState } from "react";
import Moment from "react-moment";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import PageContainer from "../components/PageContainer";
import MediaListItem from "../models/MediaListItem";

const SContainer = styled.div`
    padding-top: 10px;
    padding-left: 20px;
    padding-right: 20px;
    width: 100%;
    height: 100%;
`;

const SReactPlayer = styled(ReactPlayer)`
    & video:focus {
        outline: none;
    }
    & video {
        //height: auto !important;
    }
`;

const STitleRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const SVideoContainer = styled.div`
    position: relative;
`;

const SCastOverlay = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(128, 128, 128, 0.5);
    cursor: pointer;
    color: white;
`;

interface Params {
    mediaId: string;
}

function WatchMedia() {
    const { mediaId } = useParams<Params>();
    const [mediaItem, setMediaItem] = useState<MediaListItem>({} as MediaListItem);
    const updateProgressReady = useRef(false);
    const [playing, setPlaying] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const videoRef = useRef<ReactPlayer>(null);
    const interval = useRef(0);
    const currentDuration = useRef(0);
    const [isCasting, setIsCasting] = useState(false);
    useEffect(() => {
        cast.framework.CastContext.getInstance().addEventListener(cast.framework.CastContextEventType.SESSION_STATE_CHANGED, (state: any) => {
            if (state.sessionState === "SESSION_STARTED") {
                const mediaInfo = new chrome.cast.media.MediaInfo(`http://192.168.1.112:8000/api/media/mediadata/${mediaId}`, "video/mp4");
                const req = new chrome.cast.media.LoadRequest(mediaInfo);
                req.autoplay = true;
                req.currentTime = currentDuration.current;

                const session = state.session;
                session
                    .loadMedia(req)
                    .then((response: any) => {
                        setIsCasting(true);
                    })
                    .catch((error: any) => {
                        console.log(error);
                    });
            }
            if (state.sessionState === "SESSION_ENDED") {
                const mediaSession = state.session.getMediaSession();
                if (mediaSession) {
                    videoRef?.current?.seekTo(mediaSession.currentTime);
                }
                setPlaying(true);
                setIsCasting(false);
            }
        });
        Axios.get<MediaListItem>(`/media/item/${+mediaId}`).then((response) => {
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

    function onDuration(duration: number) {
        if (!mediaItem.duration) {
            Axios.post(`/media/initialduration/${mediaItem.id}`, null, {
                params: {
                    duration,
                },
            });
        }
    }

    function handleResumeClick() {
        if (videoRef.current) {
            videoRef.current.seekTo(mediaItem.durationPlayed);
            setPlaying(true);
            setConfirmOpen(false);
        }
    }

    function handleCloseClick() {
        if (videoRef.current) {
            videoRef.current.seekTo(mediaItem.durationPlayed);
            setConfirmOpen(false);
        }
    }

    function handleRestartClick() {
        setPlaying(true);
        setConfirmOpen(false);
    }

    function onProgress(state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) {
        if (updateProgressReady.current) {
            Axios.post(`/media/updateplayedseconds/${mediaItem.id}`, null, {
                params: {
                    playedSeconds: state.playedSeconds,
                },
            }).then(() => {
                updateProgressReady.current = false;
            });
        }
        currentDuration.current = state.playedSeconds;
    }

    function handleStart() {
        interval.current = setInterval(() => {
            updateProgressReady.current = true;
        }, 5000);
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

    return (
        <SContainer>
            <PageContainer loading={!Boolean(mediaItem.id)}>
                {mediaItem.id > 0 && (
                    <>
                        <Modal destroyOnClose footer={false} centered visible={confirmOpen} onCancel={handleCloseClick}>
                            <Typography.Title level={3}>Continue where you left off?</Typography.Title>
                            <Row justify="end" style={{ paddingTop: 20 }}>
                                <Button type="default" size="large" onClick={handleRestartClick}>
                                    Start from beginning
                                </Button>
                                <Button size="large" style={{ marginLeft: 10 }} onClick={handleResumeClick} type="primary">
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

                        <SVideoContainer>
                            <SReactPlayer
                                onStart={handleStart}
                                ref={videoRef}
                                playing={playing && !isCasting}
                                width="100%"
                                height="auto"
                                onProgress={onProgress}
                                onDuration={onDuration}
                                controls
                                url={`http://localhost:8000/api/media/mediadata/${mediaId}`}
                            ></SReactPlayer>
                            {isCasting && (
                                <SCastOverlay>
                                    You are currently casting. Click to stop
                                    <PlayCircleOutlined size={40} />
                                </SCastOverlay>
                            )}
                        </SVideoContainer>
                    </>
                )}
            </PageContainer>
        </SContainer>
    );
}

export default WatchMedia;
