import {
  EditOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  message,
} from "antd";
import { useEffect, useState } from "react";
import AGCService from "../../../services/AGCService";

const { Option } = Select;

// Customized Table columns

const StockControl = () => {
  const [stock, setStock] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [form] = Form.useForm();
  const service = new AGCService();

  const operadores = [
    {
      cod_adm: 2265,
      nom_adm: "Charles Luis da Rosa Gaspary",
    },
    {
      cod_adm: 2331,
      nom_adm: "Rodinei Costa de Rezendes",
    },
  ];

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      const response = await service.buscaInsumos();
      console.log(response);

      setStock(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados do estoque:", error);
      message.error("Falha ao carregar dados do estoque");
    }
  };

  const showModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setIsModalVisible(true);
    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (modalType === "add") {
      } else if (modalType === "edit") {
      } else if (modalType === "entrada") {
      } else if (modalType === "saida") {
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchStockData();
      message.success("Operação realizada com sucesso");
    } catch (error) {
      console.error("Erro na operação:", error);
      message.error("Falha na operação");
    }
  };

  const columns = [
    { title: "Nome", dataIndex: "nom_ins", key: "nom_ins" },
    { title: "Quantidade", dataIndex: "quantidade", key: "quantidade" },
    { title: "Valor", dataIndex: "valor", key: "valor" },
    { title: "Nota Fiscal", dataIndex: "nota_fiscal", key: "nota_fiscal" },
    {
      title: "Ações",
      key: "acoes",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal("edit", record)}
          >
            Editar
          </Button>
          <Button
            icon={<ImportOutlined />}
            onClick={() => showModal("entrada", record)}
          >
            Entrada
          </Button>
          <Button
            icon={<ExportOutlined />}
            onClick={() => showModal("saida", record)}
          >
            Saída
          </Button>
        </Space>
      ),
    },
  ];

  const getModalTitle = () => {
    switch (modalType) {
      case "add":
        return "Cadastrar Produto";
      case "edit":
        return "Editar Produto";
      case "entrada":
        return "Entrada de Produto";
      case "saida":
        return "Saída de Produto";
      default:
        return "";
    }
  };

  return (
    <div>
      <h1>Controle de Estoque</h1>
      <Button
        type="primary"
        onClick={() => showModal("add")}
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
      >
        Cadastrar Produto
      </Button>
      <Table dataSource={stock} columns={columns} rowKey="id" />

      <Modal
        title={getModalTitle()}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          {modalType !== "saida" && modalType !== "entrada" && (
            <>
              <Form.Item name="nome" label="Nome" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="tipo" label="Tipo" rules={[{ required: true }]}>
                <Select>
                  <Option value="desratização">Desratização</Option>
                  {/* Adicione mais opções conforme necessário */}
                </Select>
              </Form.Item>
              <Form.Item
                name="valor"
                label="Valor"
                rules={[{ required: true }]}
              >
                <Input type="number" step="0.01" />
              </Form.Item>
              <Form.Item name="nota_fiscal" label="Nota Fiscal">
                <Input />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="quantidade"
            label="Quantidade"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="operador"
            label="Operador"
            rules={[{ required: true }]}
          >
            <Select>
              {operadores.map((operador) => (
                <Option key={operador.cod_adm} value={operador.cod_adm}>
                  {operador.nom_adm}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {modalType === "add" ? "Cadastrar" : "Confirmar"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StockControl;
