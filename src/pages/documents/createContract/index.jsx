import { Button } from "antd";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import DocumentsService from "../../../services/DocumentsService";
import {
  ClauseFive,
  ClauseFour,
  ClauseOne,
  ClauseSix,
  ClauseThree,
  ClauseTwo,
} from "../../../utils/clauses/clauses";
import { formatMoney } from "../../../utils/formats/formatMoney";
import { Options } from "../../../utils/options";

export default function CreateContract() {
  VerifyUserRole(["Master", "Administrador", "RH"]);
  const navigate = useNavigate();
  const service = new DocumentsService();
  const [services, setServices] = React.useState([]);
  const [values, setValues] = React.useState({
    status: "Aguardando..",
    name: "",
    cpfcnpj: "",
    cep: "",
    road: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    contractNumber: "",
    date: dayjs(),
    value: "",
    index: "",
    servicesContract: [],
    clauses: [
      { id: 1, text: `${ClauseOne()}`, isExpanded: false },
      { id: 2, text: "", isExpanded: false },
      { id: 3, text: `${ClauseThree()}`, isExpanded: false },
      { id: 4, text: `${ClauseFour()}`, isExpanded: false },
      { id: 5, text: `${ClauseFive()}`, isExpanded: false },
      { id: 6, text: `${ClauseSix()}`, isExpanded: false },
    ],
    propouse: "",
  });

  const [userContract, setUserContract] = React.useState("");

  const [messageError, setMessageError] = React.useState({
    name: "",
    cpfcnpj: "",
    cep: "",
    road: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    contractNumber: "",
    date: "",
    value: "",
    index: "",
    servicesContract: "",
  });

  React.useEffect(() => {
    setValues((prevValues) => ({
      ...prevValues,
      clauses: prevValues.clauses.map((clause) =>
        clause.id === 2
          ? { ...clause, text: ClauseTwo(formatMoney(prevValues.value)) }
          : clause
      ),
    }));
  }, [values.value]);

  React.useEffect(() => {
    const fetchServices = async () => {
      const dataServices = await service.getServices();

      setServices(() => {
        const updatedServices = dataServices.data.listUsers.map(
          (service) => service.description
        );
        return updatedServices;
      });
    };

    fetchServices();
  }, []);

  const handleAddClick = () => {
    setValues((prevContract) => ({
      ...prevContract,
      clauses: [
        ...prevContract.clauses,
        { id: Date.now(), text: "", isExpanded: false },
      ],
    }));
  };

  const handleDeleteClause = (id) => {
    setValues((prevUser) => ({
      ...prevUser,
      clauses: prevUser.clauses.filter((clause) => clause.id !== id),
    }));
  };

  const toggleExpand = (id) => {
    setValues((prevUser) => ({
      ...prevUser,
      clauses: prevUser.clauses.map((clause) =>
        clause.id === id
          ? { ...clause, isExpanded: !clause.isExpanded }
          : clause
      ),
    }));
  };

  const handleClauseChange = (id, newText) => {
    setValues((prevValues) => ({
      ...prevValues,
      clauses: prevValues.clauses.map((clause) =>
        clause.id === id ? { ...clause, text: newText } : clause
      ),
    }));
  };

  const handleChange = (eventOrDate, dateString) => {
    if (eventOrDate.target) {
      const { name, value } = eventOrDate.target;

      setValues((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      if (value !== "") {
        setMessageError((prevState) => ({
          ...prevState,
          [name]: "",
        }));
      }
    } else {
      setValues((prevState) => ({
        ...prevState,
        date: eventOrDate ? dayjs(eventOrDate) : null,
      }));

      if (dateString !== "") {
        setMessageError((prevState) => ({
          ...prevState,
          date: "",
        }));
      }
    }
  };

  const handleFileUpload = (fileInfo) => {
    setValues(prevValues => ({
      ...prevValues,
      propouse: fileInfo,
    }));
  };

  React.useEffect(() => {
    console.log("Clausulas:", values.clauses);
  }, [values.clauses])

  const areRequiredFieldsFilled = () => {
    const requiredFields = [
      "name",
      "cpfcnpj",
      "cep",
      "road",
      "number",
      "neighborhood",
      "city",
      "state",
      "contractNumber",
      "date",
      "value",
      "index",
      "servicesContract",
    ];
    let newErrors = {};
    let isAllFieldsFilled = true;

    for (const field of requiredFields) {
      if (!values[field]) {
        newErrors[field] = "Este campo é obrigatório";
        isAllFieldsFilled = false;
      } else {
        newErrors[field] = "";
      }
    }

    setMessageError(newErrors);
    return isAllFieldsFilled;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emptyField = areRequiredFieldsFilled();

    if (!emptyField) {
      Toast.Info("Preencha os campos obrigatórios!");
      return;
    }

    const response = await service.createContract(values);

    if (response.request.status === 500) {
      Toast.Error("Contrato já cadastrado!");
      return;
    } else {
      Toast.Success("Contrato cadastrado com sucesso!");
      navigate("/dashboard");
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <Form.Root
      title="Gerar Novo Contrato"
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
    >
      <Form.Fragment section="Contratante">
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Nome"
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            errorText={messageError.name}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="CPF ou CNPJ"
            type="text"
            name="cpfcnpj"
            value={values.cpfcnpj}
            onChange={handleChange}
            errorText={messageError.cpfcnpj}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="CEP"
            type="text"
            name="cep"
            value={values.cep}
            onChange={handleChange}
            errorText={messageError.cep}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Rua"
            type="text"
            name="road"
            value={values.road}
            onChange={handleChange}
            errorText={messageError.road}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={3}>
          <CustomInput.Input
            label="Número"
            type="text"
            name="number"
            value={values.number}
            onChange={handleChange}
            errorText={messageError.number}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={3}>
          <CustomInput.Input
            label="Complemento"
            type="text"
            name="neighborhood"
            value={values.complement}
            onChange={handleChange}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Bairro"
            type="text"
            name="neighborhood"
            value={values.neighborhood}
            onChange={handleChange}
            errorText={messageError.neighborhood}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Cidade"
            type="text"
            name="city"
            value={values.city}
            onChange={handleChange}
            errorText={messageError.city}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="UF"
            type="text"
            name="state"
            value={values.state}
            onChange={handleChange}
            errorText={messageError.state}
          />
        </CustomInput.Root>
      </Form.Fragment>
      <Form.Fragment section="Contratado">
        <CustomInput.Select
          label="Assinaturas"
          name="servicesContract"
          value={userContract}
          options={Options.Companies()}
          onChange={(e) => {
            setUserContract(e.target.value);
          }}
        />
      </Form.Fragment>
      <Form.Fragment section="Contrato">
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Número"
            type="text"
            name="contractNumber"
            value={values.contractNumber}
            onChange={handleChange}
            errorText={messageError.contractNumber}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.DateInput
            label="Data"
            name="date"
            value={values.date}
            onChange={handleChange}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Valor"
            type="text"
            name="value"
            value={formatMoney(values.value)}
            onChange={handleChange}
            errorText={messageError.value}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Índice"
            type="text"
            name="index"
            value={values.index}
            onChange={handleChange}
            errorText={messageError.index}
          />
        </CustomInput.Root>
        <CustomInput.Select
          label="Serviços"
          name="servicesContract"
          value={values.servicesContract}
          onChange={handleChange}
          multiple={true}
          options={services}
        />
      </Form.Fragment>
      <Form.Fragment section="Cláusulas">
        <div style={{ width: "100%" }}>
          <Button
            variant="contained"
            style={{ marginBottom: "20px" }}
            color="primary"
            onClick={handleAddClick}
          >
            Adicionar Cláusula
          </Button>
          {values.clauses.map((clause, index) => (
            <CustomInput.LongText
              key={clause.id}
              label={`Cláusula Nº${index + 1}`}
              value={clause.text}
              isExpanded={clause.isExpanded}
              onChange={(e) => handleClauseChange(clause.id, e.target.value)}
              onExpandToggle={() => toggleExpand(clause.id)}
              onDelete={() => handleDeleteClause(clause.id)}
            />
          ))}
        </div>
      </Form.Fragment>
      <Form.Fragment section="Proposta">
        <CustomInput.Upload onFileUpload={handleFileUpload}/>
      </Form.Fragment>
    </Form.Root>
  );
}
