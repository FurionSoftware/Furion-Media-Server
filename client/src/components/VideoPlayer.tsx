import React, { useEffect, useRef, useState } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";
import Axios from "axios";
import MediaListItem from "../models/MediaListItem";
import { useParams } from "react-router-dom";
import MediaDetail from "../models/MediaDetail";
import ReactPlayer from "react-player";
import Script from "react-load-script";

const SVideoContainer = styled.div`
  position: relative;
  height: 100%;
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

  useEffect(() => {
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
          const mediaInfo = new chrome.cast.media.MediaInfo(
            `http://192.168.1.112:8000/api/media/mediadata/${props.mediaItem.id}`,
            "video/mp4"
          );
          const req = new chrome.cast.media.LoadRequest(mediaInfo);
          req.autoplay = true;
          req.currentTime = currentDuration;

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
            videoRef.current.currentTime = mediaSession.currentTime;
          }
          videoRef.current.play();
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

  function onProgress(event: React.SyntheticEvent<HTMLVideoElement, Event>) {
    if (updateProgressReady.current) {
      Axios.post(`/media/updateplayedseconds/${props.mediaItem.id}`, null, {
        params: {
          playedSeconds: event.currentTarget.currentTime,
        },
      }).then(() => {
        updateProgressReady.current = false;
      });
    }
    setCurrentDuration(event.currentTarget.currentTime);
  }

  function handleStart() {
    interval.current = setInterval(() => {
      updateProgressReady.current = true;
    }, 3000);
  }
  return (
    <SVideoContainer>
      <Script
        url="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1"
        onLoad={afterScriptLoad}
        onError={afterScriptLoad}
      />
      <video
        width="100%"
        height="100%"
        onPlay={handleStart}
        ref={videoRef}
        onTimeUpdate={onProgress}
        onDurationChange={onDuration}
        controls
      >
        <source
          src={`http://localhost:8000/api/media/mediadata/${props.mediaItem.id}`}
        />
      </video>

      {isCasting && (
        <SCastOverlay>
          You are currently casting. Click to resume playback on this device
          <PlayCircleOutlined size={40} />
        </SCastOverlay>
      )}
    </SVideoContainer>
  );
}
