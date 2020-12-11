import { PageHeader } from "antd";
import Axios from "axios";
import React, { Fragment, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import MediaListItem from "../models/MediaListItem";

const SContainer = styled.div`
	padding-top: 10px;
	padding-left: 20px;
	padding-right: 20px;
	width: 100%;
	height: 100%;
`;

interface Params {
	mediaId: string;
}

function WatchMedia() {
	const { mediaId } = useParams<Params>();
	const [videoUrl, setVideoUrl] = useState("");
	const [mediaItem, setMediaItem] = useState<MediaListItem>(
		{} as MediaListItem
	);
	const updateProgressReady = useRef(true);
	useEffect(() => {
		const interval = setInterval(() => {
			updateProgressReady.current = true;
		}, 5000);
		Axios.get(`/media/mediadata/${+mediaId}`, {
			responseType: "blob",
		}).then((response) => {
			const blob = new Blob([response.data]);
			setVideoUrl(window.URL.createObjectURL(blob));
		});
		Axios.get<MediaListItem>(`/media/item/${+mediaId}`).then((response) => {
			setMediaItem(response.data);
		});
		return () => {
			clearInterval(interval);
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

	function onProgress(state: {
		played: number;
		playedSeconds: number;
		loaded: number;
		loadedSeconds: number;
	}) {
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

	return (
		<SContainer>
			<ReactPlayer
				width="100%"
				height="100%"
				onProgress={onProgress}
				onDuration={onDuration}
				controls
				url={videoUrl}
			></ReactPlayer>
			<google-cast-launcher></google-cast-launcher>
		</SContainer>
	);
}

export default WatchMedia;
