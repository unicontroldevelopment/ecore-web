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
} from "chart.js";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Loading from "../../components/animations/Loading";
import DocumentsService from "../../services/DocumentsService";
import { Container, Heading } from "./styles";

const { Title, Paragraph } = Typography;
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState([]);
  const [monthlyContracts, setMonthlyContracts] = useState([]);
  const documentService = new DocumentsService();

  const fetchDashboardData = async () => {
    try {
      const response = await documentService.getDashboardStats();
      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
    }
  };

  const fetchMonthlyContracts = async () => {
    try {
      const response = await documentService.getMonthlyContracts();
      if (response.status === 200) {
        setMonthlyContracts(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar contratos mensais:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchDashboardData(), fetchMonthlyContracts()]);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const efficiency =
    dashboardData.totalContracts > 0
      ? Math.round(
          (dashboardData.contractsWithD4Sign / dashboardData.totalContracts) *
            100
        )
      : 0;

  const getMonths = () => {
    const currentMonth = dayjs();
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push(currentMonth.month(i).format("MMMM"));
    }
    return months;
  };

  const months = getMonths();

  const data = {
    labels: months,
    datasets: [
      {
        label: "Contratos",
        data: months.map((_, index) => {
          const monthData = monthlyContracts.find(
            (item) => item.month === index + 1
          );
          return monthData ? monthData.count : 0;
        }),
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
    {isLoading && <Loading />}
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
                  value={dashboardData.totalEmployees}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
                <Progress percent={100} showInfo={false} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Documentos Gerados"
                  value={dashboardData.totalContracts}
                  prefix={<FileOutlined />}
                  valueStyle={{ color: "#cf1322" }}
                />
                <Progress percent={100} showInfo={false} status="active" />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Contratos Realizados"
                  value={dashboardData.contractsWithD4Sign}
                  prefix={<FileProtectOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
                <Progress percent={100} showInfo={false} status="active" />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Eficiência Geral"
                  value={efficiency}
                  suffix="%"
                  prefix={<PieChartOutlined />}
                  valueStyle={{ color: "#722ed1" }}
                />
                <Progress
                  percent={efficiency}
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
            <Line data={data} options={options} />
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
    </>
  );
};

export default Dashboard;
