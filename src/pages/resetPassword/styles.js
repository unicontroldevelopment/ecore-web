import styled from "styled-components";

export const RightDiv = styled.div`
  height: 100%;
  width: 65%;
  position: fixed;
  z-index: 1;
  top: 0;
  overflow-x: none;
  overflow-y: none;
  right: 0;
  display: grid;
  place-items: center;

  img {
    width: 50%;
    height: 20%;
  }
`;

export const LeftDiv = styled.div`
  height: 100%;
  width: 35%;
  position: fixed;
  z-index: 1;
  top: 0;
  overflow-x: none;
  overflow-y: none;
  left: 0;
  background-color: #4168b0;
`;

export const CenteredDiv = styled.div`
  width: 75%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffff;
  padding: 20px;
  border-radius: 10px;
`;

export const Title = styled.h3`
  text-align: center;
  margin-bottom: 10px;
`;

export const Subtitle = styled.h4`
  text-align: center;
  margin-bottom: 10px;
`;
