import styled from "styled-components";

export const SVideoContainer = styled.div`
  position: relative;
`;

export const SVideo = styled.video`
  max-height: 89vh;
  outline: none;
  background-color: black;
  &::cue {
    font-family: Arial, serif;
  }
`;

export const SCastOverlay = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  font-size: 20px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  cursor: pointer;
  color: white;
  &:hover {
    background-color: #272727;
  }
  & .anticon {
    font-size: 100px;
    margin-bottom: 20px;
  }
`;
