import { SyncOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { TextField } from "@mui/material";
import { Button, DatePicker, Modal, Space, Tag, Tooltip } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MdAddCircle, MdRemoveCircle } from "react-icons/md";
import Loading from "../../../components/animations/Loading";
import FilterComponent from "../../../components/order-list/FilterComponent";
import { Table } from "../../../components/table";
import { Toast } from "../../../components/toasts";
import Utils from "../../../services/Utils";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [openModalProduto, setOpenModalProduto] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [textFields, setTextFields] = useState({ 0: "" });
  const [data, setData] = useState(null);
  const [object, setObject] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [filterState, setFilterState] = useState({
    requestedBy: "",
    franchise: "",
    status: "",
  });
  const service = new Utils();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await service.buscaPedidos();

        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const refreshOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await service.buscaPedidos();
      setOrders(response.data);
    } catch (error) {
      console.error("Error refreshing orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterChange = useCallback((event) => {
    const { name, value } = event.target;
    setFilterState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilterState({
      requestedBy: "",
      franchise: "",
      status: "",
    });
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      return (
        (filterState.requestedBy === "" ||
          order.nome
            .toLowerCase()
            .includes(filterState.requestedBy.toLowerCase())) &&
        (filterState.franchise === "" ||
          order.franquia
            .toLowerCase()
            .includes(filterState.franchise.toLowerCase())) &&
        (filterState.status === "" ||
          order.nome_status.toLowerCase() === filterState.status.toLowerCase())
      );
    });
  }, [orders, filterState]);

  const statusesList = ["CANCELADO", "SOLICITADO", "COMPRADO", "FINALIZADO"];

  const showModal = async (type, record) => {
    if (type === "changeStatus") {
      if (
        record.nome_status === "Cancelado" ||
        record.nome_status === "Finalizado"
      ) {
        Toast.Error(
          `Não é possível alterar o status de um pedido ${record.nome_status.toLowerCase()}`
        );
      } else {
        setSelectedOrder(record);
        setIsModalVisible(true);
      }
    } else if (type === "viewProducts") {
      setOpenModalProduto(true);
      setLoading(true);
      try {
        const response = await service.buscaProdutosPedidos(record.id);
        setProdutos(response.data);
      } catch (error) {
        Toast.Error("Erro ao carregar os produtos do pedido");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setData(null);
  };

  const handleChangeData = (date, dateString) => {
    const formattedDate = moment(dateString, "DD/MM/YYYY").format("YYYY-MM-DD");
    setData(formattedDate);
  };

  const handleInputChange = (index, value) => {
    setTextFields((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const addTextField = useCallback(() => {
    setTextFields((prev) => ({ ...prev, [Object.keys(prev).length]: "" }));
  }, []);

  const removeTextField = useCallback(() => {
    setTextFields((prev) => {
      const newFields = { ...prev };
      delete newFields[Object.keys(newFields).length - 1];
      return newFields;
    });
  }, []);

  const MemoizedTextField = React.memo(
    ({ index, value, onChange }) => (
      <TextField
        style={{
          width: "100%",
          marginBottom: "10px",
        }}
        label="Número Nota Fiscal"
        variant="outlined"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(index, e.target.value)}
      />
    ),
    (prevProps, nextProps) => prevProps.value === nextProps.value
  );

  const renderModalContent = () => {
    if (selectedOrder?.nome_status === "Solicitado") {
      return (
        <>
          <DatePicker
            style={{ width: "100%", marginBottom: "10px" }}
            format="DD/MM/YYYY"
            placeholder="Selecione a data"
            value={data ? moment(data) : null}
            onChange={handleChangeData}
          />
          <Button
            type="primary"
            style={{
              width: "100%",
              marginBottom: "10px",
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
            }}
            onClick={async () => {
              if (!data) {
                Toast.Error("Preencha todos os campos");
                return;
              }

              try {
                setLoading(true);
                const response = await service.compradoPedido(
                  selectedOrder.id,
                  data
                );

                Toast.Success("Pedido atualizado com sucesso");
                setObject({});
                setConcat("");
                setData(null);
                setIsModalVisible(false);

                // Refresh orders after status update
                await refreshOrders();
              } catch (error) {
                console.error("Erro ao alterar status do pedido:", error);
                Toast.Error(
                  "Erro ao alterar status do pedido: " + error.message
                );
              } finally {
                setLoading(false);
              }
            }}
          >
            Alterar Status do Pedido
          </Button>
          <Button
            danger
            style={{
              width: "100%",
            }}
            onClick={async () => {
              try {
                setLoading(true);
                await service.canceladoPedido(selectedOrder.id);

                Toast.Success("Pedido cancelado com sucesso");
                setObject("");
                setConcat("");
                setData(null);
                setIsModalVisible(false);

                // Refresh orders after status update
                await refreshOrders();
              } catch (error) {
                console.error("Erro ao alterar status do pedido:", error);
                Toast.Error(
                  "Erro ao alterar status do pedido: " + error.message
                );
              } finally {
                setLoading(false);
              }
            }}
          >
            Cancelar Solicitação
          </Button>
        </>
      );
    } else if (selectedOrder?.nome_status === "Comprado") {
      return (
        <>
          {Object.entries(textFields).map(([index, value]) => (
            <MemoizedTextField
              key={index}
              index={index}
              value={value}
              onChange={handleInputChange}
            />
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <MdRemoveCircle
              size={25}
              color="#d13737"
              cursor="pointer"
              onClick={removeTextField}
            />
            <MdAddCircle
              size={25}
              color="#3992ff"
              cursor="pointer"
              onClick={addTextField}
            />
          </div>
          <Button
            style={{
              width: "100%",
              marginTop: "1.5rem",
              padding: "0.4rem",
              backgroundColor: "#168500",
              cursor: "pointer",
              color: "white",
              fontSize: "1rem",
              fontWeight: 300,
              borderRadius: "5px",
              transition: "all 0.3s ease",
              height: "40px",
            }}
            hover={{
              backgroundColor: "#1eb300",
            }}
            type="submit"
            onClick={async () => {
              const notasFiscais = Object.values(textFields).join("/");
              try {
                setLoading(true);
                await service.finalizarPedido(selectedOrder.id, notasFiscais);
                Toast.Success("Pedido finalizado com sucesso");
                setIsModalVisible(false);

                // Refresh orders after status update
                await refreshOrders();
              } catch (error) {
                Toast.Error("Erro ao finalizar o pedido: " + error.message);
              } finally {
                setLoading(false);
              }
            }}
          >
            Finalizar Solicitação
          </Button>
        </>
      );
    }
  };

  const verifyColor = (status) => {
    switch (status) {
      case "Solicitado":
        return "#f6dd00";
      case "Comprado":
        return "#3992ff";
      case "Finalizado":
        return "#3ebf2d";
      case "Cancelado":
        return "#d13737";
      default:
        return "#000000";
    }
  };

  const columns = [
    {
      title: "Franquia",
      dataIndex: "franquia",
      key: "franquia",
      ellipsis: {
        showTitle: false,
      },
      render: (franquia) => (
        <Tooltip placement="bottomLeft" title={franquia}>
          {franquia.length > 24 ? `${franquia.slice(0, 24)}...` : franquia}
        </Tooltip>
      ),
    },
    {
      title: "Solicitador Por",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Status",
      dataIndex: "nome_status",
      key: "nome_status",
      render: (status) => (
        <Tag color={verifyColor(status)} key={status}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Data da NF",
      dataIndex: "data_nota_fiscal",
      key: "data_nota_fiscal",
      render: (date) =>
        date === null ? <p>-</p> : moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Número NF",
      dataIndex: "numero_nota_fiscal",
      key: "numero_nota_fiscal",
      render: (number) => (number != null ? number.toString() : "-"),
    },
    {
      title: "Data do Pedido",
      dataIndex: "data_solicitacao",
      key: "data_solicitacao",
      render: (date) => {
        if (date && typeof date === "string") {
          return moment(date).format("DD/MM/YYYY");
        }
        return "-";
      },
    },
    {
      title: "Ações",
      key: "acoes",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Alterar Status">
            <Button
              icon={<SyncOutlined />}
              onClick={() => showModal("changeStatus", record)}
            />
          </Tooltip>
          <Tooltip title="Ver Produtos">
            <Button
              icon={<UnorderedListOutlined />}
              onClick={() => showModal("viewProducts", record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      {loading && <Loading />}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Lista de Pedidos
      </h1>
      <FilterComponent
        filter={filterState}
        onFilterChange={handleFilterChange}
        statuses={statusesList}
        onClearFilters={handleClearFilters}
      />
      <Table.TableClean
        data={filteredOrders}
        columns={columns}
        pagination={true}
      />
      <Modal
        title="Alterar Status do Pedido"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {renderModalContent()}
      </Modal>
      <Modal
        title="Lista de Produtos"
        open={openModalProduto}
        onCancel={() => {
          setOpenModalProduto(false);
        }}
        footer={null}
      >
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              marginBottom: "20px",
              fontWeight: "bold",
            }}
          >
            <h4>Quantidade</h4>
            <h4 style={{ textAlign: "center" }}>Produto</h4>
            <h4 style={{ textAlign: "end" }}>Unidade/Tamanho</h4>
          </div>
          {produtos.map((produto, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                borderBottom: "1px solid #ccc",
                marginBottom: "10px",
                paddingBottom: "10px",
              }}
            >
              <p>{produto.quantidade}</p>
              <Tooltip title={produto.nome}>
                <p style={{ textAlign: "center" }}>
                  {produto.nome.length > 15
                    ? `${produto.nome.substring(0, 15)}...`
                    : produto.nome}
                </p>
              </Tooltip>
              <p style={{ textAlign: "end" }}>{produto.unidade}</p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
