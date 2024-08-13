import { Card, Col, Row, Statistic } from "antd";
import { CardStyle, Container, Heading, Paragraph } from "./styles";

const Dashboard = () => {
  return (
    <div>
    <Container>
        <CardStyle>
          <Heading>Bem vindo ao Ecore Web 2.0!</Heading>
          <Paragraph>
            Aqui você pode acessar suas ferramentas de maneira muito mais fácil.
          </Paragraph>
          <Paragraph>
            É só escolher a opção desejada no menu ao lado e aproveitar as ferramentas!
          </Paragraph>
        </CardStyle>
      </Container>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Funcionários Cadastrados" value={0} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Documentos Gerados" value={0} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Contratos Realizados" value={0} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
