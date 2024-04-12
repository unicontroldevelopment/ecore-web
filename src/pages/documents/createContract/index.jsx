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
import { Formats } from "../../../utils/formats";
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
    tecSignature: "",
    contractNumber: "",
    date: dayjs(),
    value: "",
    index: "",
    servicesContract: [],
    clauses: [
      { id: 0, text: `${ClauseOne()}`, isExpanded: false },
      { id: 1, text: "", isExpanded: false },
      { id: 2, text: `${ClauseThree()}`, isExpanded: false },
      { id: 3, text: `${ClauseFour()}`, isExpanded: false },
      { id: 4, text: `${ClauseFive()}`, isExpanded: false },
      { id: 5, text: `${ClauseSix()}`, isExpanded: false },
    ],
    propouse: "",
  });

  const [selectedDescriptions, setSelectedDescriptions] = React.useState([]);
  const [valueMoney, setValueMoney] = React.useState("");
  const [formatCpfOrCnpj, setFormatCpfOrCnpj] = React.useState("");
  const [formatCep, setFormatCep] = React.useState("");

  const [messageError, setMessageError] = React.useState({
    name: "",
    cpfcnpj: "",
    cep: "",
    road: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    tecSignature: "",
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
        clause.id === 1
          ? { ...clause, text: ClauseTwo(Formats.Money(prevValues.value)) }
          : clause
      ),
    }));
  }, [values.value]);

  const servicesDesc = services.map(service => service.description);

  React.useEffect(() => {
    const fetchServices = async () => {
      const dataServices = await service.getServices();

      setServices(() => {
        const updatedServices = dataServices.data.listServices.map(service => ({
          id: service.id,
          description: service.description
        }))
        return updatedServices;
      });
    };

    fetchServices();
  }, []);

  const descriptionToIdMap = services.reduce((acc, service) => {
    acc[service.description] = service.id;
    return acc;
  }, {});

  function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

  React.useEffect(() => {
    const newSelectedIds = selectedDescriptions.map(desc => descriptionToIdMap[desc]);
  
    if (!arraysAreEqual(values.servicesContract, newSelectedIds)) {
      setValues(prevValues => ({
        ...prevValues,
        servicesContract: newSelectedIds,
      }));
    }
  }, [selectedDescriptions]);

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
    setValues((prevContract) => ({
      ...prevContract,
      clauses: prevContract.clauses.filter((clause) => clause.id !== id),
    }));
  };

  const toggleExpand = (id) => {
    setValues((prevContract) => ({
      ...prevContract,
      clauses: prevContract.clauses.map((clause) =>
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

  const removeMask = (maskedValue) => {
    return maskedValue.replace(/[.,]/g, '');
  };

  const handleFormatsChange = (event) => {
    const { name, value } = event.target;
  
    const unmaskedValue = removeMask(value);
  
    if(name === "cpfcnpj") {
      setValues((prevState) => ({
        ...prevState,
        [name]: unmaskedValue,
      }));
    
      setFormatCpfOrCnpj(Formats.CpfCnpj(value));
    } else if(name === "value"){
      setValues((prevState) => ({
        ...prevState,
        [name]: unmaskedValue,
      }));
    
      setValueMoney(Formats.Money(value));
    } else if (name === "cep"){
      setValues((prevState) => ({
        ...prevState,
        [name]: unmaskedValue,
      }));
    
      setFormatCep(Formats.Cep(value));
    }

  }

  const handleServiceChange = (selectedDescriptions) => {
    const descriptions = selectedDescriptions.target.value

    setSelectedDescriptions(descriptions);
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
    setValues((prevValues) => ({
      ...prevValues,
      propouse: fileInfo,
    }));
  };

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

    const clausesToSend = values.clauses.map(clause => ({
      description: clause.text
    }));

    const dataToSend = {
      ...values,
      clauses: clausesToSend,
    };

    const response = await service.createContract(dataToSend);

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
            value={formatCpfOrCnpj}
            onChange={handleFormatsChange}
            errorText={messageError.cpfcnpj}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="CEP"
            type="text"
            name="cep"
            value={formatCep}
            onChange={handleFormatsChange}
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
          name="tecSignature"
          value={values.tecSignature}
          options={Options.Companies()}
          onChange={handleChange}
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
            value={valueMoney}
            onChange={handleFormatsChange}
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
          value={selectedDescriptions}
          onChange={handleServiceChange}
          multiple={true}
          options={servicesDesc}
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
        <CustomInput.Upload onFileUpload={handleFileUpload} />
      </Form.Fragment>
    </Form.Root>
  );
}
