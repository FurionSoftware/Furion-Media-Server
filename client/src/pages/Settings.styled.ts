import styled from "styled-components";
import PageContainer from "../components/PageContainer";

export const SPageContainer = styled(PageContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 50%;
  margin-left: auto;
  margin-right: auto;
  padding-top: 10px;
  @media screen and (max-width: 1179px) {
    max-width: 99%;
  }
`;
