import React, { useEffect, useRef, useState } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";
import Axios from "axios";
import MediaListItem from "../models/MediaListItem";
import { useParams } from "react-router-dom";
import MediaDetail from "../models/MediaDetail";
import ReactPlayer from "react-player";
import Script from "react-load-script";
import MediaSubtitle from "../models/MediaSubtitle";

const SVideoContainer = styled.div`
  position: relative;
`;

const SVideo = styled.video`
  max-height: 89vh;
  outline: none;
  background-color: black;
`;

const SCastOverlay = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  font-size: 20px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  cursor: pointer;
  color: white;
  &:hover {
    background-color: #272727;
  }
  & .anticon {
    font-size: 100px;
    margin-bottom: 20px;
  }
`;

interface Props {
  mediaItem: MediaListItem;
  playOnLoad: boolean;
  initialDuration: number;
}
export default function VideoPlayer(props: Props) {
  const updateProgressReady = useRef(false);
  const videoRef = useRef<HTMLVideoElement>({} as any);
  const interval = useRef(0);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isCasting, setIsCasting] = useState(false);
  const [subtitles, setSubtitles] = useState<MediaSubtitle[]>([]);

  useEffect(() => {
    Axios.get<MediaSubtitle[]>(
      `/media/subtitleinfo/${props.mediaItem.id}`
    ).then((response) => {
      setSubtitles(response.data);
    });
  }, []);

  useEffect(() => {
    interval.current = setInterval(() => {
      updateProgressReady.current = true;
    }, 3000);
    if (props.initialDuration > 0) {
      videoRef.current.currentTime = props.initialDuration;
    }
    return () => {
      clearInterval(interval.current);
    };
  }, [props.initialDuration]);
  useEffect(() => {
    if (props.playOnLoad) {
      videoRef.current.play();
    }
  }, [props.playOnLoad]);

  function onDuration(event: React.SyntheticEvent<HTMLVideoElement, Event>) {
    if (!props.mediaItem.duration) {
      Axios.post(`/media/initialduration/${props.mediaItem.id}`, null, {
        params: {
          duration: event.currentTarget.duration,
        },
      });
    }
    setTotalDuration(event.currentTarget.duration);
  }
  function initializeCastApi() {
    cast.framework.CastContext.getInstance().setOptions({
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
    });
    cast.framework.setLoggerLevel(cast.framework.LoggerLevel.DEBUG);
    cast.framework.CastContext.getInstance().addEventListener(
      cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      (state: any) => {
        if (state.sessionState === "SESSION_STARTED") {
          videoRef.current.pause();
          const mediaInfo = new chrome.cast.media.MediaInfo(
            `http://192.168.1.112:8000/api/media/mediadata/${props.mediaItem.id}`,
            "video/mp4"
          );
          const req = new chrome.cast.media.LoadRequest(mediaInfo);
          req.autoplay = true;
          req.currentTime = videoRef.current.currentTime;

          const session = state.session;
          session
            .loadMedia(req)
            .then((response: any) => {
              setIsCasting(true);
              videoRef.current?.pause();
              session.getMediaSession().addUpdateListener((active: boolean) => {
                updatePlayedSeconds(
                  session.getMediaSession().getEstimatedTime()
                );
              });
            })
            .catch((error: any) => {
              console.log(error);
            });
        }
        if (state.sessionState === "SESSION_ENDED") {
          const mediaSession = state.session.getMediaSession();
          if (mediaSession && videoRef.current) {
            videoRef.current.currentTime = mediaSession.getEstimatedTime();
          }
          videoRef.current?.play();
          setIsCasting(false);
        }
      }
    );
  }
  function afterScriptLoad() {
    window["__onGCastApiAvailable"] = function (isAvailable: any) {
      if (isAvailable) {
        initializeCastApi();
      }
    };
  }

  function endSession() {
    const mediaSession = cast.framework.CastContext.getInstance()
      .getCurrentSession()
      .getMediaSession();
    cast.framework.CastContext.getInstance().getCurrentSession().endSession();
    // mediaSession.getStatus().then(() => {
    //   videoRef.current.currentTime = mediaSession.getEstimatedTime();
    //
    //   videoRef.current.play();
    // })
  }

  function onProgress(event: React.SyntheticEvent<HTMLVideoElement, Event>) {
    if (updateProgressReady.current) {
      updatePlayedSeconds(event.currentTarget.currentTime);
    }
  }

  function updatePlayedSeconds(seconds: number) {
    Axios.post(`/media/updateplayedseconds/${props.mediaItem.id}`, null, {
      params: {
        playedSeconds: seconds,
      },
    }).then(() => {
      updateProgressReady.current = false;
    });
  }

  return (
    <SVideoContainer>
      <Script
        url="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1"
        onLoad={afterScriptLoad}
        onError={afterScriptLoad}
      />
      <SVideo
        crossOrigin="anonymous"
        width="100%"
        ref={videoRef}
        onTimeUpdate={onProgress}
        onDurationChange={onDuration}
        controls
      >
        <source
          src={`http://localhost:8000/api/getfile?filepath=${encodeURIComponent(
            props.mediaItem.filePath
          )}`}
        />
        {subtitles.map((sub) => (
          <track
            label={sub.language}
            kind="subtitles"
            srcLang={sub.language}
            key={sub.filePath}
            src={`http://localhost:8000/api/getfile?filepath=${encodeURIComponent(
              sub.filePath
            )}`}
          />
        ))}
      </SVideo>

      {isCasting && (
        <SCastOverlay onClick={endSession}>
          <PlayCircleOutlined />
          You are currently casting. Click to resume playback on this device
        </SCastOverlay>
      )}
    </SVideoContainer>
  );
}
