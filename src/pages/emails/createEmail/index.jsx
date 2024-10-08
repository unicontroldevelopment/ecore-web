import * as React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "antd";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import EmailService from "../../../services/EmailService";
import { Options } from "../../../utils/options";

export default function CreateEmail() {
  VerifyUserRole(["Master", "Administrador"]);
  const navigate = useNavigate();
  const service = new EmailService();

  const [values, setValues] = React.useState({
    type: "",
    email: "",
    password: "",
    passwordConfirmation: "",
   redirects: [],
  });

  const [messageError, setMessageError] = React.useState({
    type: "",
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

  const handleAddClick = () => {
    setValues((prevValue) => ({
      ...prevValue,
      redirects: [
        ...prevValue.redirects,
        { currentId: Date.now(), email: ""},
      ],
    }));
  };

  const handleDeleteRedirect = (id) => {
    setValues((prevValue) => ({
      ...prevValue,
      redirects: prevValue.redirects.filter((redirect) => redirect.currentId !== id),
    }));
  };

  const handleRedirectChange = (id, newText) => {
    setValues((prevValues) => ({
      ...prevValues,
      redirects: prevValues.redirects.map((redirect) =>
        redirect.currentId === id ? { ...redirect, email: newText } : redirect
      ),
    }));
  };

  const areRequiredFieldsFilled = () => {
    const requiredFields = [
      "email",
      "type",
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
      Toast.Info("Preencha os campos obrigatórios!");
      return;
    }

    console.log(values);

    const response = await service.create(values);

    if (response.request.status === 500) {
      Toast.Error("Colaborador já cadastrado!");
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
      title="Cadastrar E-mail"
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
    >
      <Form.Fragment section="Tipo de E-mail">
        <CustomInput.Select
          label="Tipo"
          name="type"
          options={Options.EmailType()}
          value={values.type}
          onChange={handleChange}
          errorText={messageError.type}
        />
      </Form.Fragment>
      <Form.Fragment section="Dados do E-mail">
        <CustomInput.Root columnSize={12}>
          <CustomInput.Input
            label="Email"
            type="text"
            name="email"
            value={values.email}
            onChange={handleChange}
            errorText={messageError.email}
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
            label="Confirmação da senha"
            type="text"
            name="passwordConfirmation"
            value={values.passwordConfirmation}
            onChange={handleChange}
            errorText={messageError.passwordConfirmation}
          />
        </CustomInput.Root>
      </Form.Fragment>
      <Form.Fragment section="Direcionamentos">
      <div style={{ width: "100%" }}>
              <Button
                variant="contained"
                style={{ marginBottom: "20px" }}
                color="primary"
                onClick={handleAddClick}
              >
                Adicionar Redirecionamento
              </Button>
              {values.redirects.map((redirect, index) => (
                <CustomInput.LongExpanded
                  key={redirect.currentId}
                  label={`Direcionamento Nº${index + 1}`}
                  value={redirect.email}
                  onChange={(e) =>
                    handleRedirectChange(redirect.currentId, e.target.value)
                  }
                  onDelete={() => handleDeleteRedirect(redirect.currentId)}
                />
              ))}
            </div>
      </Form.Fragment>
    </Form.Root>
  );
}
