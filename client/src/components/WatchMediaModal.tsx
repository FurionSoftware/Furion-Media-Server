import { Input, Modal } from "antd";
import Form from "antd/lib/form/Form";
import Axios from "axios";
import React, { Fragment, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import MediaListItem from "../models/MediaListItem";
import ReactPlayer from "react-player";

const SModal = styled(Modal)`
	& .ant-modal-content {
		height: calc(100vh - 20px);
		top: 0 !important;
	}
	&.ant-modal {
		top: 10px !important;
		padding-bottom: 0;
	}
`;

interface Props {
	mediaItem: MediaListItem;
	open: boolean;
	onClose: () => void;
}
function WatchMediaModal(props: Props) {
	const [videoUrl, setVideoUrl] = useState("");
	const videoRef = useRef<HTMLVideoElement>(null);
	const updateProgressReady = useRef(true);
	useEffect(() => {
		const interval = setInterval(() => {
			updateProgressReady.current = true;
		}, 5000);
		if (props.open) {
			Axios.get("/media/filedata", {
				params: {
					filePath: props.mediaItem.filePath,
				},
				responseType: "blob",
			}).then((response) => {
				const blob = new Blob([response.data]);
				setVideoUrl(window.URL.createObjectURL(blob));
			});
		}
		return () => {
			clearInterval(interval);
		};
	}, [props.open]);

	function onDuration(duration: number) {
		if (!props.mediaItem.duration) {
			Axios.post(`/media/initialduration/${props.mediaItem.id}`, null, {
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
			Axios.post(
				`/media/updateplayedseconds/${props.mediaItem.id}`,
				null,
				{
					params: {
						playedSeconds: state.playedSeconds,
					},
				}
			).then(() => {
				updateProgressReady.current = false;
			});
		}
	}

	return (
		<Fragment>
			{props.open && (
				<SModal
					width="100%"
					footer={null}
					destroyOnClose
					visible
					title={`Edit ${props.mediaItem.title}`}
					onCancel={props.onClose}
				>
					<ReactPlayer
						onProgress={onProgress}
						onDuration={onDuration}
						width="100%"
						height="100%"
						style={{ marginTop: -25 }}
						controls
						url={videoUrl}
					></ReactPlayer>
					<google-cast-launcher></google-cast-launcher>
				</SModal>
			)}
		</Fragment>
	);
}

export default WatchMediaModal;
