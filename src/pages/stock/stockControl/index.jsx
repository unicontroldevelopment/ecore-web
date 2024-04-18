import {
  EllipsisOutlined,
  MinusOutlined,
  PlusOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import * as React from "react";
import { Filter } from "../../../components/filter";
import { CustomInput } from "../../../components/input/index";
import { Table } from "../../../components/table";
import { ActionsContainer } from "../../../components/table/styles";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import { Options } from "../../../utils/options";

export default function StockControl() {
  VerifyUserRole(["Master", "Administrador", "RH"]);
  const [filter, setFilter] = React.useState({
    type: "",
    unit: "",
  });
  const [columns, setColumns] = React.useState([]);
  const [unitType, setUnitType] = React.useState();
  const [data, setData] = React.useState();

  const handleChangeFilter = (event) => {
    const selectedRole = event.target.value;
    setFilter((prevState) => ({
      ...prevState,
      [event.target.name]: selectedRole,
    }));

    if (selectedRole === "Produtos" && unitType) {
      const products = Options.Users()
      const filterProducts = products.filter(product => product.unit === unitType)
      setData(filterProducts);
      setColumns(optionsProduct);
    } else if (selectedRole === "Uniformes e EPI's") {
      const products = Options.EPIs()
      const filterProducts = products.filter(product => product.unit === unitType)
      setData(filterProducts);
      setColumns(optionsEPI);
    }
  };

  const handleUnit = (event) => {
    setUnitType(event.target.value)
    setFilter((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));

  }

  const optionsProduct = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Medida",
      dataIndex: "unitOfMeasurement",
      key: "unitOfMeasurement",
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
      render: () => (
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
          />
          <Button
            title="Transferir"
            style={{ backgroundColor: "#00BFFF", color: "#fff" }}
            icon={<SwapOutlined />}
            shape="circle"
          />
          <Button
            title="Editar"
            style={{ backgroundColor: "#708090", color: "#fff" }}
            icon={<EllipsisOutlined />}
            shape="circle"
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
      render: () => (
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
          />
          <Button
            title="Transferir"
            style={{ backgroundColor: "#00BFFF", color: "#fff" }}
            icon={<SwapOutlined />}
            shape="circle"
          />
          <Button
            title="Editar"
            style={{ backgroundColor: "#708090", color: "#fff" }}
            icon={<EllipsisOutlined />}
            shape="circle"
          />
        </ActionsContainer>
      ),
    },
  ];

  return (
    <Table.Root title="Lista de Movimentações">
      <Filter.Fragment section="Tipo de Item">
        <CustomInput.Root columnSize={12}>
          <Filter.Select
            label="Unidade"
            name="unit"
            value={filter.unit}
            onChange={handleUnit}
            options={Options.Units()}
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
  );
}
