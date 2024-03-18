import * as React from "react";
import Lottie from "lottie-react";
import denied from "../../assets/lootie/denied.json";
import { CenteredDiv, TextContainer } from "./styles";
import { Typography } from "antd";
import { UserTypeContext } from "../../contexts/UserTypeContext";

const { Title } = Typography;

export default function AccessDenied() {
  const userTypeContext = React.useContext(UserTypeContext);

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
          Seu perfil de usuário ({userTypeContext.userType}) não tem permissão
          para acessar essa página.
        </Title>
      </TextContainer>
    </CenteredDiv>
  );
}
