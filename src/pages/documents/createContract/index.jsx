import * as React from "react";
import { useNavigate } from "react-router-dom";

import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import DocumentsService from "../../../services/DocumentsService";
import { Options } from "../../../utils/options";
import { CreatingPdf } from "../../../utils/pdf/crateContract";

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
    date: "",
    value: "",
    index: "",
    servicesContract: [],
  });

  const [userContract, setUserContract] = React.useState("");
  const [valueDecimal, setValueDecimal] = React.useState("");

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

  const handleChange = (event) => {
    setValues((prevState) => {
      const updatedValues = {
        ...prevState,
        [event.target.name]: event.target.value,
      };
      return updatedValues;
    });

    if (event.target.name === "value") {
      setValueDecimal(() => {
        let cleanInput = event.target.value.replace(/[^\d]/g, "");

        if (cleanInput.length > 2) {
          cleanInput = cleanInput.slice(0, -2) + "," + cleanInput.slice(-2);
        } else if (cleanInput.length === 2) {
          cleanInput = "," + cleanInput;
        }

        return cleanInput;
      });
    }

    if (event.target.value !== "") {
      setMessageError((prevState) => ({
        ...prevState,
        [event.target.name]: "",
      }));
    }
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
          <CustomInput.Input
            label="Data de Início"
            type="text"
            name="date"
            value={values.date}
            onChange={handleChange}
            errorText={messageError.date}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Valor"
            type="text"
            name="value"
            value={valueDecimal}
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
      <CreatingPdf />
    </Form.Root>
  );
}
