import styled from "styled-components";
import PageContainer from "../components/PageContainer";
import { Tag } from "antd";
import MediaCard from "../components/MediaCard";

export const SPageContainer = styled(PageContainer)`
  padding: 20px;
`;

export const SVideoMeta = styled.div`
  display: flex;
  flex-direction: column;
  & .meta-item {
    padding-bottom: 5px;
    &.duration {
      font-size: 16px;
    }
  }
`;

export const SResolutionTag = styled(Tag)`
  font-size: 14px !important;
`;

export const SMediaCard = styled(MediaCard)`
  margin-right: 10px !important;
`;
