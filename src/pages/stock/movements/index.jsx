import * as React from "react";
import { Filter } from "../../../components/filter";
import { CustomInput } from "../../../components/input/index";
import { Table } from "../../../components/table";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import AGCService from "../../../services/AGCService";
import { Options } from "../../../utils/options";

export default function StockMovements() {
  VerifyUserRole(["Master", "Administrador", "Operacional"]);
  const [stockMovements, setStockMovements] = React.useState([]);
  const [filteredStockMovements, setFilteredStockMovements] = React.useState([]);
  const [filter, setFilter] = React.useState({
    type: "",
  });
  const service = new AGCService()

  React.useEffect(() => {
    const fetchStockMovements = async () => {
      const response = await service.buscaInsumosMovimentacao();
      setStockMovements(response.data);
      setFilteredStockMovements(response.data);
    };
    fetchStockMovements();
  }, []);

  React.useEffect(() => {
    const filteredMovements = stockMovements.filter(movement => 
      filter.type === "" || movement.descricao_tipo === filter.type
    );
    setFilteredStockMovements(filteredMovements);
  }, [filter, stockMovements]);

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
      dataIndex: "nome_insumo",
      key: "nome_insumo",
    },
    {
      title: "Operador",
      dataIndex: "nome_operador",
      key: "nome_operador",
    },
    {
      title: "Quantidade",
      dataIndex: "quantidade",
      key: "quantidade",
    },
    {
      title: "Tipo",
      dataIndex: "descricao_tipo",
      key: "descricao_tipo",
    },
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
    },
  ];

  return (
    <Table.Root title="Lista de Movimentações">
      <Filter.Fragment section="Tipo de Item">
        <CustomInput.Root columnSize={24}>
        <Filter.Select
          label="Tipo"
          name="type"
          value={filter.type}
          onChange={handleChangeFilter}
          options={Options.StockMovement()}
        />
      </CustomInput.Root>
      </Filter.Fragment>
      <Table.TableClean data={filteredStockMovements} columns={options} />
    </Table.Root>
  );
}
