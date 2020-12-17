import { Col, Row } from "antd";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import PageContainer from "../components/PageContainer";
import MediaDetail from "../models/MediaDetail";

const SPageContainer = styled(PageContainer)`
	padding: 20px;
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
			<Row gutter={10}>
				<Col span={4}>
					<img
						width="100%"
						alt="Media Poster"
						src={`https://image.tmdb.org/t/p/w185${mediaDetail.thumbnailUrl}`}
					/>
				</Col>
				<Col>
					<Row>
						<Col>{mediaDetail.title}</Col>
					</Row>
					<Row>
						<Col>{mediaDetail.duration}</Col>
					</Row>
				</Col>
			</Row>
		</SPageContainer>
	);
}

export default MediaDetails;
