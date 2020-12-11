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
    useEffect(() => {
        cast.framework.CastContext.getInstance().addEventListener(cast.framework.CastContextEventType.CAST_STATE_CHANGED, (state: any) => {
            if (state.castState === "CONNECTED") {
                const mediaInfo = new chrome.cast.media.MediaInfo(`https://localhost:44327/api/media/mediadata/${mediaId}`, "video/mp4");
                const req = new chrome.cast.media.LoadRequest(mediaInfo);

                const session = cast.framework.CastContext.getInstance().getCurrentSession();
                console.log(session);
                session
                    .loadMedia(req)
                    .then((response: any) => {
                        console.log(response);
                    })
                    .catch((error: any) => {
                        console.log(error);
                    });
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
    }

    function handleStart() {
        setTimeout(() => {
            interval.current = setInterval(() => {
                updateProgressReady.current = true;
            }, 5000);
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
                        <SReactPlayer
                            onStart={handleStart}
                            ref={videoRef}
                            playing={playing}
                            width="100%"
                            height="100%"
                            onProgress={onProgress}
                            onDuration={onDuration}
                            controls
                            url={`https://localhost:44327/api/media/mediadata/${mediaId}`}
                        ></SReactPlayer>
                    </>
                )}
            </PageContainer>

            <google-cast-launcher></google-cast-launcher>
        </SContainer>
    );
}

export default WatchMedia;
