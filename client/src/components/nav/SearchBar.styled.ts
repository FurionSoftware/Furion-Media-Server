import styled from "styled-components";
import { AutoComplete, Typography } from "antd";

export const SAutoComplete = styled(AutoComplete)`
  //flex-grow: 1;
  width: 50%;
`;

export const SItemContainer = styled.div`
  display: flex;
  padding: 10px;
  height: 155px;
  text-overflow: ellipsis;
`;

export const SThumbnail = styled.img`
  width: 100px;
  padding-right: 10px;
`;

export const SMediaInfo = styled.div`
  display: flex;
  flex-direction: column;
  text-overflow: ellipsis;
`;

export const SOverview = styled(Typography.Paragraph)`
  margin-bottom: 0;
`;

export const SDuration = styled.span`
  font-weight: 600;
`;
