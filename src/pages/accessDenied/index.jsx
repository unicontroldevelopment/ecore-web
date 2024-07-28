import { Typography } from "antd";
import Lottie from "lottie-react";
import denied from "../../assets/lootie/denied.json";
import { CenteredDiv, TextContainer } from "./styles";

const { Title } = Typography;

export default function AccessDenied() {

  return (
    <CenteredDiv>
      <Lottie
        animationData={denied}
        loop={true}
        style={{
          width: "250px",
        }}
      />
      <TextContainer>
        <Title level={2}>Acesso Negado!</Title>
        <Title level={5}>
          Seu perfil de usuário não tem permissão
          para acessar essa página.
        </Title>
      </TextContainer>
    </CenteredDiv>
  );
}
