import * as React from "react";
import { Filter } from "../../../components/filter";
import { CustomInput } from "../../../components/input/index";
import { Table } from "../../../components/table";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import { Options } from "../../../utils/options";

export default function StockMovements() {
  VerifyUserRole(["Master", "Administrador", "Operacional"]);
  const [filter, setFilter] = React.useState({
    name: "",
  });

  const userOptions = Options.Users()

  const handleChangeFilter = (event) => {
    setFilter((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const options = [
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
      title: "Tipo",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Unidade",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Placa",
      dataIndex: "plate",
      key: "plate",
    },
    {
      title: "Valor",
      dataIndex: "baseValue",
      key: "baseValue",
    },
    {
      title: "Número NF",
      dataIndex: "numberNF",
      key: "numberNF",
    },
    {
      title: "Data",
      dataIndex: "updated",
      key: "updated",
    },
  ];

  return (
    <Table.Root title="Lista de Movimentações">
      <Filter.Fragment section="Tipo de Item">
        <CustomInput.Root columnSize={24}>
        <Filter.Select
          label="Tipo"
          name="role"
          value={filter.role}
          onChange={handleChangeFilter}
          options={Options.Roles()}
        />
      </CustomInput.Root>
      </Filter.Fragment>
      <Table.TableClean data={userOptions} columns={options} />
    </Table.Root>
  );
}
