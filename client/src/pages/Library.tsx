import { Col, Grid, Row, Typography } from "antd";
import Axios from "axios";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import MediaCard from "../components/MediaCard";
import PageContainer from "../components/PageContainer";
import Library from "../models/Library";
import LibraryPageDetail from "../models/LibraryPageDetail";
import MediaListItem from "../models/MediaListItem";
import { RootState } from "../store/store";

const SContainer = styled.div`
	padding-top: 10px;
	padding-left: 20px;
	padding-right: 20px;
`;

interface Params {
	name: string;
}
function Library() {
	let { name } = useParams<Params>();
	const library = useRef<LibraryPageDetail>({} as LibraryPageDetail);
	const [loading, setLoading] = useState(true);
	const [mediaItems, setMediaItems] = useState<MediaListItem[]>([]);
	const { librariesUpdated } = useSelector(
		(state: RootState) => state.libraryReducer
	);
	name = name.split("_").join(" ");
	useEffect(() => {
		Axios.get<LibraryPageDetail>(`/libraries/${name}`).then((response) => {
			library.current = response.data;
			fetchMedia(response.data.id);
		});
	}, []);

	useEffect(() => {
		if (
			(library.current.id &&
				librariesUpdated.id === library.current.id) ||
			librariesUpdated.id <= 0
		) {
			fetchMedia(library.current.id);
		}
	}, [librariesUpdated]);

	function fetchMedia(libraryId: number) {
		setLoading(true);
		Axios.get<MediaListItem[]>(`/media/allmedia/${libraryId}`).then(
			(response) => {
				setMediaItems(response.data);
				setLoading(false);
			}
		);
	}

	return (
		<SContainer>
			<PageContainer loading={loading}>
				<Typography.Title level={2}>
					{library.current.name}
				</Typography.Title>
				<div>
					<Row gutter={[30, 30]}>
						<Fragment>
							{mediaItems.map((item) => (
								<Col key={item.id} span={6}>
									<MediaCard mediaItem={item} />
								</Col>
							))}
						</Fragment>
					</Row>
				</div>
			</PageContainer>
		</SContainer>
	);
}

export default Library;
