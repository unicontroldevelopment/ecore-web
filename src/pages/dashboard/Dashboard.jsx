import {
  FileOutlined,
  FileProtectOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Progress,
  Row,
  Space,
  Statistic,
  Typography,
} from "antd";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import dayjs from "dayjs";
import { Line } from "react-chartjs-2";
import { Container, Heading } from "./styles";

const { Title, Paragraph } = Typography;
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Dashboard = () => {
  const dataValues = [20, 35, 45, 25, 75, 81, 89];

  const getMonths = () => {
    const currentMonth = dayjs();
    const months = [];
    for (let i = -2; i <= 4; i++) {
      months.push(currentMonth.add(i, "month").format("MMMM YYYY"));
    }
    return months;
  };

  const months = getMonths();

  const data = {
    labels: months,
    datasets: [
      {
        label: "Contratos",
        data: dataValues,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <Container style={{ width: "100%", height: "100%" }}>
      <Space
        direction="vertical"
        size="large"
        style={{ width: "100%", height: "100%" }}
      >
        <Card>
          <Heading>Bem-vindo ao Ecore Web 2.0!</Heading>
          <Paragraph>
            Aqui você tem acesso rápido às suas ferramentas e métricas
            importantes. Use o menu lateral para navegar entre as diferentes
            funcionalidades do sistema.
          </Paragraph>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Funcionários Cadastrados"
                value={23}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
              <Progress percent={75} showInfo={false} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Documentos Gerados"
                value={523}
                prefix={<FileOutlined />}
                valueStyle={{ color: "#cf1322" }}
              />
              <Progress percent={60} showInfo={false} status="active" />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Contratos Realizados"
                value={89}
                prefix={<FileProtectOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
              <Progress percent={40} showInfo={false} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Eficiência Geral"
                value={88}
                suffix="%"
                prefix={<PieChartOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
              <Progress
                percent={88}
                showInfo={false}
                status="active"
                strokeColor="#722ed1"
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Title level={4}>Atividades Recentes</Title>
          <ul>
            <li>Jennifer atualizou o contrato #1234</li>
            <li>Guilherme criou um novo formulário</li>
            <li>Gislaine cadastrou 3 novos funcionários</li>
          </ul>
        </Card>

        <Card>
          <Title level={4}>Contratos gerados</Title>
          <Line data={data} options={options}/>
        </Card>

        <Row gutter={16}>
          <Col span={24}>
            <Card title="Feedback">
              <Input.TextArea
                placeholder="Deixe seu feedback"
                rows={4}
                className="mb-3"
              />
              <Button type="primary">Enviar</Button>
            </Card>
          </Col>
        </Row>
      </Space>
    </Container>
  );
};

export default Dashboard;
