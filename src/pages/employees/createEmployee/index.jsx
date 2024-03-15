import { Button, Row } from "antd";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { CustomInput } from "../../../components/input/index";
import toastInfo from "../../../components/toasts/toastInfo";
import toastSuccess from "../../../components/toasts/toastSuccess";
import toastError from "../../../components/toasts/toastError";
import FormDivider from "../../../components/FormDivider";
import UserService from "../../../services/UserService";
import { Options } from "../../../utils/options";

export default function CreateEmployee() {
  const navigate = useNavigate();
  const userRegister = new UserService();

  const [values, setValues] = React.useState({
    name: "",
    role: "",
    password: "",
    passwordConfirmation: "",
    department: "",
    company: "",
    unit: "",
    networkUser: "",
    networkPassword: "",
    email: "",
    passwordEmail: "",
    discordEmail: "",
    discordPassword: "",
    notebookBrand: "",
    notebookName: "",
    notebookProperty: "",
    coolerProperty: "",
    officeVersion: "",
    windowsVersion: "",
  });

  const [messageError, setMessageError] = React.useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleChange = (event) => {
    setValues((prevState) => {
      const updatedValues = {
        ...prevState,
        [event.target.name]: event.target.value,
      };
      if (
        event.target.name === "password" ||
        event.target.name === "passwordConfirmation"
      ) {
        verifyPasswords(
          updatedValues.password,
          updatedValues.passwordConfirmation
        );
      }
      return updatedValues;
    });

    if (event.target.value !== "") {
      setMessageError((prevState) => ({
        ...prevState,
        [event.target.name]: "",
      }));
    }
  };

  const verifyPasswords = (password, passwordConfirmation) => {
    const errorMessage = "As senhas não conferem!";

    if (password === passwordConfirmation) {
      setMessageError((prevState) => ({
        ...prevState,
        password: "",
        passwordConfirmation: "",
      }));
    } else {
      setMessageError({
        ...messageError,
        password: errorMessage,
        passwordConfirmation: errorMessage,
      });
    }
  };

  const areRequiredFieldsFilled = () => {
    const requiredFields = [
      "name",
      "email",
      "password",
      "passwordConfirmation",
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
      toastInfo("Preencha os campos obrigatórios!");
      return;
    }

    const response = await userRegister.create(values);

    if (response.request.status === 500) {
      toastError("Colaborador já cadastrado!");
      return;
    } else {
      toastSuccess("Colaborador cadastrado com sucesso!");
      navigate("/dashboard");
    }
  };

  return (
    <>
      <FormDivider title="Dados do Colaborador" />
      <Row gutter={[12, 12]}>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Nome Completo"
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            errorText={messageError.name}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Select
            label="Selecione um setor"
            name="department"
            value={values.department}
            onChange={handleChange}
            options={Options.Departments()}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Select
            label="Selecione uma empresa"
            name="company"
            value={values.company}
            onChange={handleChange}
            options={Options.Companies()}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Select
            label="Selecione uma unidade"
            name="unit"
            value={values.unit}
            onChange={handleChange}
            options={Options.Units()}
          />
        </CustomInput.Root>
      </Row>
      <FormDivider title="Acesso Ecore Web" />
      <Row gutter={[12, 12]}>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Select
            label="Perfil"
            name="role"
            value={values.role}
            onChange={handleChange}
            options={Options.Roles()}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Senha"
            type="text"
            name="password"
            value={values.password}
            onChange={handleChange}
            errorText={messageError.password}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Confirmação de Senha"
            type="text"
            name="passwordConfirmation"
            value={values.passwordConfirmation}
            onChange={handleChange}
            errorText={messageError.passwordConfirmation}
          />
        </CustomInput.Root>
      </Row>
      <FormDivider title="E-mail" />
      <Row gutter={[12, 12]}>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="E-mail"
            type="text"
            name="email"
            value={values.email}
            onChange={handleChange}
            errorText={messageError.email}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Senha e-mail"
            type="text"
            name="passwordEmail"
            value={values.passwordEmail}
            onChange={(e) => {
              setValues({ ...values, [e.target.name]: e.target.value });
            }}
          />
        </CustomInput.Root>
      </Row>
      <FormDivider title="Acesso à rede" />
      <Row gutter={[12, 12]}>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Usuário rede"
            type="text"
            name="networkUser"
            value={values.networkUser}
            onChange={(e) => {
              setValues({ ...values, [e.target.name]: e.target.value });
            }}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Senha rede"
            type="text"
            name="networkPassword"
            value={values.networkPassword}
            onChange={(e) => {
              setValues({ ...values, [e.target.name]: e.target.value });
            }}
          />
        </CustomInput.Root>
      </Row>
      <FormDivider title="Discord" />
      <Row gutter={[12, 12]}>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="E-mail discord"
            type="text"
            name="discordEmail"
            value={values.discordEmail}
            onChange={(e) => {
              setValues({ ...values, [e.target.name]: e.target.value });
            }}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Senha discord"
            type="text"
            name="discordPassword"
            value={values.discordPassword}
            onChange={(e) => {
              setValues({ ...values, [e.target.name]: e.target.value });
            }}
          />
        </CustomInput.Root>
      </Row>
      <FormDivider title="Notebook" />
      <Row gutter={[12, 12]}>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Select
            label="Marca Notebook"
            name="notebookBrand"
            value={values.notebookBrand}
            onChange={handleChange}
            options={Options.NotebookBrands()}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Nome Notebook"
            type="text"
            name="notebookName"
            value={values.notebookName}
            onChange={(e) => {
              setValues({ ...values, [e.target.name]: e.target.value });
            }}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Patrimônio Notebook"
            type="text"
            name="notebookProperty"
            value={values.notebookProperty}
            onChange={(e) => {
              setValues({ ...values, [e.target.name]: e.target.value });
            }}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Patrimônio cooler"
            type="text"
            name="coolerProperty"
            value={values.coolerProperty}
            onChange={(e) => {
              setValues({ ...values, [e.target.name]: e.target.value });
            }}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Select
            label="Versão Office"
            name="officeVersion"
            value={values.officeVersion}
            onChange={handleChange}
            options={Options.OfficeVersions()}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Select
            label="Versão sistema operacional"
            name="windowsVersion"
            value={values.windowsVersion}
            onChange={handleChange}
            options={Options.OSVersions()}
          />
        </CustomInput.Root>
      </Row>
      <Button type="primary" onClick={handleSubmit}>
        Cadastrar
      </Button>
      <Button type="primary" onClick={() => navigate("/dashboard")}>
        Cancelar
      </Button>
    </>
  );
}
