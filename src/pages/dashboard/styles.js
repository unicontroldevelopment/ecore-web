import styled from 'styled-components';

export const Container = styled.div`
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 65vh;

  @media (max-width: 600px) {
    margin-top: 0rem;
    height: 40vh;
  }
`;

export const Paragraph = styled.p`
  font-size: 1.2rem;
  color: #000000;

  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;

export const Heading = styled.h1`
  color: #000000;

  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

export const CardStyle = styled.div`
  border-radius: 10px;
  box-shadow: 3px 3px 13px 0px rgba(50, 50, 50, 0.22);
  padding: 30px;
  margin: 20px;
  width: 550px;
  transition: all 0.3s ease-out;
  border-left: 5px solid #33ae40;
  background-color: white;

  &:hover {
    transform: translateY(-10px);
    cursor: pointer;

    @media (max-width: 600px) {
      transform: translateY(0px);
    }
  }
`;
