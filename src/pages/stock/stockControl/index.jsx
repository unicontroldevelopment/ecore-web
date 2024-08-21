import {
  EllipsisOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Modal } from "antd";
import * as React from "react";
import { Filter } from "../../../components/filter";
import { CustomInput } from "../../../components/input/index";
import { Table } from "../../../components/table";
import { ActionsContainer } from "../../../components/table/styles";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import { Options } from "../../../utils/options";

export default function StockControl() {
  VerifyUserRole(["Master", "Administrador", "Operacional"]);
  const [filter, setFilter] = React.useState({
    type: "",
    name: "",
  });
  const [columns, setColumns] = React.useState([]);
  const [exitModal, setExitModal] = React.useState(false);
  const [enterModal, setEnderModal] = React.useState(false);
  const [editModal, setEditModal] = React.useState(false);
  const [selected, setSelected] = React.useState({});
  const [data, setData] = React.useState();

  const handleChangeFilter = (event) => {
    const selectedRole = event.target.value;
    setFilter((prevState) => ({
      ...prevState,
      [event.target.name]: selectedRole,
    }));

    if (selectedRole === "Produtos") {
      const products = Options.Users();
      setData(products);
      setColumns(optionsProduct);
    } else if (selectedRole === "Uniformes e EPI's") {
      const products = Options.EPIs();
      setData(products);
      setColumns(optionsEPI);
    }
  };

  const handleExitModal = (choice = null) => {
    setSelected(choice);
    setExitModal(true);
  };

  const handleEnterModal = (choice = null) => {
    setSelected(choice);
    setEnderModal(true);
  };

  const handleEditModal = (choice = null) => {
    console.log(choice);

    setSelected(choice);
    setEditModal(true);
  };

  const optionsProduct = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantidade",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Valor",
      dataIndex: "baseValue",
      key: "baseValue",
    },
    {
      title: "Ações",
      key: "actions",
      width: 150,
      render: (render) => (
        <ActionsContainer>
          <Button
            title="Entrada"
            style={{ backgroundColor: "#32CD32", color: "#fff" }}
            icon={<PlusOutlined />}
            shape="circle"
            onClick={handleEnterModal}
          />
          <Button
            title="Saida"
            style={{ backgroundColor: "#DC143C", color: "#fff" }}
            icon={<MinusOutlined />}
            shape="circle"
            onClick={handleExitModal}
          />
          <Button
            title="Editar"
            style={{ backgroundColor: "#00BFFF", color: "#fff" }}
            icon={<EllipsisOutlined />}
            shape="circle"
            onClick={() => handleEditModal(render)}
          />
        </ActionsContainer>
      ),
    },
  ];

  const optionsEPI = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tamanho",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Quantidade",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Valor",
      dataIndex: "baseValue",
      key: "baseValue",
    },
    {
      title: "Ações",
      key: "actions",
      width: 150,
      render: (render) => (
        <ActionsContainer>
          <Button
            title="Entrada"
            style={{ backgroundColor: "#32CD32", color: "#fff" }}
            icon={<PlusOutlined />}
            shape="circle"
          />
          <Button
            title="Saida"
            style={{ backgroundColor: "#DC143C", color: "#fff" }}
            icon={<MinusOutlined />}
            shape="circle"
            onClick={handleExitModal}
          />
          <Button
            title="Editar"
            style={{ backgroundColor: "#00BFFF", color: "#fff" }}
            icon={<EllipsisOutlined />}
            shape="circle"
          />
        </ActionsContainer>
      ),
    },
  ];

  return (
    <>
      <Table.Root title="Lista de Movimentações">
        <Filter.Fragment section="Tipo de Item">
          <CustomInput.Root columnSize={12}>
            <Filter.FilterInput
              label="Nome"
              name="name"
              type="text"
              value={filter.name}
              onChange={handleChangeFilter}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={12}>
            <Filter.Select
              label="Tipo"
              name="type"
              value={filter.type}
              onChange={handleChangeFilter}
              options={Options.Type()}
            />
          </CustomInput.Root>
        </Filter.Fragment>
        <Table.TableClean data={data} columns={columns} />
      </Table.Root>
      {exitModal && (
        <>
          <Modal
            title="Saida de Produto"
            open={exitModal}
            centered
            width={250}
            onCancel={() => setExitModal(false)}
            footer={[
              <Button type="primary" key="back" onClick={() => setExitModal(false)}>
              Criar
            </Button>,
              <Button key="back" onClick={() => setExitModal(false)}>
                Voltar
              </Button>,
            ]}
          >
            <CustomInput.Input
              label="Medida de Saida"
              name="quantity"
              type="text"
              value={"200ml"}
              disabled={true}
            />
            <CustomInput.Input
              label="Quantidade de Saida"
              name="unifOfExit"
              type="text"
              value={10}
            />
            <CustomInput.Input
              label="Operador"
              name="unifOfExit"
              type="text"
              value={"Charles"}
            />
          </Modal>
        </>
      )}
      {enterModal && (
        <>
          <Modal
            title="Entrada de Produto"
            open={enterModal}
            centered
            width={250}
            onCancel={() => setEnderModal(false)}
            footer={[
              <Button key="back" onClick={() => setEnderModal(false)}>
                Voltar
              </Button>,
            ]}
          >
            <CustomInput.Input
              label="Medida de Entrada"
              name="quantity"
              type="text"
              value={"5L"}
              disabled={true}
            />
            <CustomInput.Input
              label="Quantidade"
              name="quantity"
              type="text"
              value={5}
            />
            <CustomInput.Input
              label="Valor Pago"
              name="value"
              type="text"
              value={100}
            />
            <CustomInput.Input
              label="Nota Fiscal"
              name="noteNF"
              type="text"
              value={12345}
            />
          </Modal>
        </>
      )}
      {editModal && (
        <>
          <Modal
            title="Editar Produto"
            open={editModal}
            centered
            width={250}
            onCancel={() => setEditModal(false)}
            footer={[
              <Button key="back" onClick={() => setEditModal(false)}>
                Voltar
              </Button>,
            ]}
          >
            <CustomInput.Input
              label="Quantidade"
              name="quantity"
              type="text"
              value={5}
            />
            <CustomInput.Input
              label="Valor Pago"
              name="value"
              type="text"
              value={5}
            />
            <CustomInput.Input
              label="Nota Fiscal"
              name="noteNF"
              type="text"
              value={5}
            />
          </Modal>
        </>
      )}
    </>
  );
}
