import styled from 'styled-components';

export const Container = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;  /* Mudança para empilhar verticalmente */
  justify-content: flex-start;  /* Alinhamento para o topo */
  align-items: center;
  padding: 2rem;  /* Adicionando um espaçamento interno */
  margin: 0 auto;  /* Centraliza o Container */
  max-width: 1200px; /* Largura máxima para o container */

  @media (max-width: 600px) {
    margin-top: 0rem;
    padding: 1rem; /* Ajustando o padding para telas menores */
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
  width: 100%;  /* Ajusta a largura do cartão para 100% */
  max-width: 550px; /* Largura máxima para evitar que fique muito largo */
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
