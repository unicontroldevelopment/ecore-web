import { Button } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import * as React from "react";
import Loading from "../../../components/animations/Loading";
import { Filter } from "../../../components/filter";
import { CustomInput } from "../../../components/input";
import { Table } from "../../../components/table";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import Utils from "../../../services/Utils";

export default function WorkingHours() {
  VerifyUserRole(["Master", "Administrador", "RH"]);

  dayjs.extend(customParseFormat);
  dayjs.extend(duration);

  const [date, setDate] = React.useState({
    initialDate: new Date(),
    endDate: new Date(),
  });
  const [workingDate, setWorkingDate] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const service = new Utils();

  React.useEffect(() => {
    console.log(workingDate);
  }, [workingDate]);

  const handleChange = (eventOrDate) => {
    setDate((prevState) => ({
      ...prevState,
      initialDate: eventOrDate ? dayjs(eventOrDate) : null,
    }));
  };

  const handleDateChange = (eventOrDate) => {
    setDate((prevState) => ({
      ...prevState,
      endDate: eventOrDate ? dayjs(eventOrDate) : null,
    }));
  };

  const searchData = async () => {
    setLoading(true);

    if (!date.initialDate || !date.endDate) {
      setLoading(false);
      return Toast.Error("Informe datas válidas!");
    }

    if (dayjs(date.initialDate).isAfter(dayjs(date.endDate))) {
      setLoading(false);
      return Toast.Error("A data inicial não pode ser maior que a data final!");
    }

    try {
      const response = await service.searchDate(date.initialDate, date.endDate);

      if (response.data.length === 0) {
        setLoading(false);
        return Toast.Error("Horários não encontrados para este período");
      }

      setWorkingDate(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const options = [
    {
      title: "Laudo",
      dataIndex: "cod_lau",
      key: "cod_lau",
    },
    {
      title: "Início",
      key: "ini_lau",
      dataIndex: "ini_lau",
      render: (text) => {
        const parsedDate = dayjs(text, [
          "DD/MM/YYYY HH:mm",
          "YYYY-MM-DD HH:mm:ss",
        ]);
        return parsedDate.isValid()
          ? parsedDate.format("DD/MM/YYYY HH:mm")
          : "Data inválida";
      },
    },
    {
      title: "Fim",
      key: "fim_lau",
      dataIndex: "fim_lau",
      render: (text) => {
        const parsedDate = dayjs(text, [
          "DD/MM/YYYY HH:mm",
          "YYYY-MM-DD HH:mm:ss",
        ]);
        return parsedDate.isValid()
          ? parsedDate.format("DD/MM/YYYY HH:mm")
          : "Data inválida";
      },
    },
    {
      title: "Duração",
      dataIndex: "duracao",
      key: "duracao",
      render: (_, record) => {
        const startDate = dayjs(record.ini_lau, [
          "DD/MM/YYYY HH:mm",
          "YYYY-MM-DD HH:mm:ss",
        ]);
        const endDate = dayjs(record.fim_lau, [
          "DD/MM/YYYY HH:mm",
          "YYYY-MM-DD HH:mm:ss",
        ]);

        if (!startDate.isValid() || !endDate.isValid()) {
          return "Data inválida";
        }

        const diff = dayjs.duration(endDate.diff(startDate));

        const days = diff.days();
        const hours = diff.hours();
        const minutes = diff.minutes();

        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0 || days > 0) parts.push(`${hours}h`);
        parts.push(`${minutes}m`);

        return parts.join(" ");
      },
    },
    {
      title: "Funcionário",
      dataIndex: "nom_adm",
      key: "nom_adm",
    },
    {
      title: "Cliente",
      dataIndex: "razao_social",
      key: "razao_social",
    },
  ];

  return (
    <>
      {loading && <Loading />}
      <Table.Root title="Horas Trabalhadas">
        <Filter.Fragment section="Filtro de Datas">
          <CustomInput.Root columnSize={6}>
            <CustomInput.DateInput
              label="Data Inicial"
              name="initialDate"
              onChange={handleChange}
              value={date.initialDate}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={6}>
            <CustomInput.DateInput
              label="Data Final"
              name="endDate"
              onChange={handleDateChange}
              value={date.endDate}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={6}>
            <Button type="primary" style={{ marginBottom: "7%"}} onClick={searchData}>Pesquisar</Button>
          </CustomInput.Root>
        </Filter.Fragment>
        <Table.TableClean columns={options} data={workingDate} key="cod_lau" pagination={true}/>
      </Table.Root>
    </>
  );
}
