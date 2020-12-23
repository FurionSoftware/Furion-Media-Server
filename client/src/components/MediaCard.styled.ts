import styled from "styled-components";
import { Card, Progress } from "antd";

export const SCard = styled(Card)`
  & .ant-card-meta-title {
    max-height: 100px;
  }
`;

export const SImageContainer = styled.div`
  width: 180px !important;
  height: 180px !important;
  & img {
    object-fit: cover !important;
    object-position: top !important;
    width: 100% !important;
    height: 100% !important;
    background-color: lightgray;
  }
`;

export const SCardMeta = styled(Card.Meta)`
  font-size: 14px !important;
`;

export const SProgress = styled(Progress)`
  & .ant-progress-inner {
    margin-top: -20px !important;
    border-radius: 0;
  }
`;
