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
    height: inherit;
`;

interface Params {
    name: string;
}
function Library() {
    let { name } = useParams<Params>();
    const library = useRef<LibraryPageDetail>({} as LibraryPageDetail);
    const [loading, setLoading] = useState(true);
    const [mediaItems, setMediaItems] = useState<MediaListItem[]>([]);
    const [recentMedia, setRecentMedia] = useState<MediaListItem[]>([]);
    const { librariesUpdated } = useSelector((state: RootState) => state.libraryReducer);
    name = name.split("_").join(" ");
    useEffect(() => {
        Axios.get<LibraryPageDetail>(`/libraries/${name}`).then((response) => {
            library.current = response.data;
            fetchMedia(response.data.id);
        });
    }, []);

    useEffect(() => {
        if ((library.current.id && librariesUpdated.id === library.current.id) || librariesUpdated.id <= 0) {
            fetchMedia(library.current.id);
        }
    }, [librariesUpdated]);

    function fetchMedia(libraryId: number) {
        setLoading(true);
        let allMediaDone = false;
        let recentMediaDone = false;
        Axios.get<MediaListItem[]>(`/media/allmedia/${libraryId}`).then((response) => {
            setMediaItems(response.data);
            allMediaDone = true;
            if (recentMediaDone) {
                setLoading(false);
            }
        });

        Axios.get<MediaListItem[]>(`/libraries/recentmedia/${libraryId}`).then((response) => {
            setRecentMedia(response.data);
            recentMediaDone = true;
            if (allMediaDone) {
                setLoading(false);
            }
        });
    }

    return (
        <SContainer>
            <PageContainer loading={loading}>
                <Typography.Title level={2}>{library.current.name}</Typography.Title>
                {recentMedia.length > 0 && (
                    <Fragment>
                        <Typography.Title level={3}>Continue Watching</Typography.Title>
                        <Row gutter={[30, 30]}>
                            <Fragment>
                                {recentMedia.map((item) => (
                                    <Col key={item.id}>
                                        <MediaCard mediaItem={item} />
                                    </Col>
                                ))}
                            </Fragment>
                        </Row>
                    </Fragment>
                )}
                <Typography.Title level={3}>All Media</Typography.Title>
                <Row gutter={[60, 30]}>
                    <Fragment>
                        {mediaItems.map((item) => (
                            <Col key={item.id}>
                                <MediaCard mediaItem={item} />
                            </Col>
                        ))}
                    </Fragment>
                </Row>
            </PageContainer>
        </SContainer>
    );
}

export default Library;
