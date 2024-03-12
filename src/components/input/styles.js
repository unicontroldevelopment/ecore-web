import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  flex-direction: column;
`;

export const ErrorContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  margin-top: 5px;
  flex-direction: row;
  color: red;
  font-size: 12px;
  width: 100%;
`;
