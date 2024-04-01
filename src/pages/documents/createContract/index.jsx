import * as React from "react";
import { useNavigate } from "react-router-dom";

import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import DocumentsService from "../../../services/DocumentsService";
import { Options } from "../../../utils/options";

export default function CreateContract() {
  VerifyUserRole(["Master", "Administrador", "RH"]);
  const navigate = useNavigate();
  const service = new DocumentsService();
  const [services, setServices] = React.useState([]);
  const [values, setValues] = React.useState({
    name: "",
    cpfCnpj: "",
    cep: "",
    road: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const [userContract, setUserContract] = React.useState(null);

  const [contract, setContract] = React.useState({
    numberContract: "",
    dateContract: "",
    valueContract: "",
    indexContract: "",
    servicesContract: [],
  });

  const [messageError, setMessageError] = React.useState({
    name: "",
    cpfCnpj: "",
    cep: "",
    road: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    numberContract: "",
    dateContract: "",
    valueContract: "",
    indexContract: "",
    servicesContract: "",
  });

  const handleChange = (event) => {
    setValues((prevState) => {
      const updatedValues = {
        ...prevState,
        [event.target.name]: event.target.value,
      };
      return updatedValues;
    });

    if (event.target.value !== "") {
      setMessageError((prevState) => ({
        ...prevState,
        [event.target.name]: "",
      }));
    }
  };

  const handleContractChange = (event) => {
    setContract((prevState) => {
      const updatedValues = {
        ...prevState,
        [event.target.name]: event.target.value,
      };
      return updatedValues;
    });

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
      "cpfCnpj",
      "cep",
      "road",
      "number",
      "neighborhood",
      "city",
      "state",
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

    const response = await service.createService(values);

    if (response.request.status === 500) {
      Toast.Error("Serviço já cadastrado!");
      return;
    } else {
      Toast.Success("Colaborador cadastrado com sucesso!");
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
            name="description"
            value={values.name}
            onChange={handleChange}
            errorText={messageError.name}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="CPF ou CNPJ"
            type="text"
            name="cpfCnpj"
            value={values.cpfCnpj}
            onChange={handleChange}
            errorText={messageError.cpfCnpj}
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
        <CustomInput.Root columnSize={6}>
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
          {" "}
          <CustomInput.Input
            label="Número"
            type="text"
            name="numberContract"
            value={contract.numberContract}
            onChange={handleContractChange}
            errorText={messageError.numberContract}
          />
        </CustomInput.Root>

        <CustomInput.Root columnSize={6}>
          {" "}
          <CustomInput.Input
            label="Data de Início"
            type="text"
            name="dateContract"
            value={contract.dateContract}
            onChange={handleContractChange}
            errorText={messageError.dateContract}
          />
        </CustomInput.Root>

        <CustomInput.Root columnSize={6}>
          {" "}
          <CustomInput.Input
            label="Valor"
            type="text"
            name="valueContract"
            value={contract.valueContract}
            onChange={handleContractChange}
            errorText={messageError.valueContract}
          />
        </CustomInput.Root>

        <CustomInput.Root columnSize={6}>
          {" "}
          <CustomInput.Input
            label="Índice"
            type="text"
            name="indexContract"
            value={contract.indexContract}
            onChange={handleContractChange}
            errorText={messageError.indexContract}
          />
        </CustomInput.Root>
          <CustomInput.Select
            label="Serviços"
            name="servicesContract"
            onChange={handleContractChange}
            multiple={true}
            options={Options.Roles()}
            value={contract.servicesContract}
          />
      </Form.Fragment>
    </Form.Root>
  );
}
