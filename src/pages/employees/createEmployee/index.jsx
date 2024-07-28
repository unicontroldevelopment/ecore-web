import dayjs from "dayjs";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input/index";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import EmployeeService from "../../../services/EmployeeService";
import { Formats } from "../../../utils/formats";
import { Options } from "../../../utils/options";

export default function CreateEmployee() {
  VerifyUserRole(["Master", "Administrador", "RH"]);
  const navigate = useNavigate();
  const service = new EmployeeService();

  const [values, setValues] = React.useState({
    name: "",
    birthday: dayjs(),
    cpf: "",
    ctps: "",
    serie: "",
    office: "",
    cbo: "",
    education: "",
    maritalStatus: "",
    nationality: "",
    pis: "",
    rg: "",
    cep: "",
    road: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    level: "",
    department: "",
    company: "",
    costCenter: "",
    dateAdmission: dayjs(),
    dateResignation: null,
    initialWage: null,
    currentWage: null,
  });
  const [valueMoney, setValueMoney] = React.useState("");
  const [currentMoney, setCurrentMoney] = React.useState("");
  const [formatCpfOrCnpj, setFormatCpfOrCnpj] = React.useState("");
  const [formatCep, setFormatCep] = React.useState("");

  const [messageError, setMessageError] = React.useState({
    name: "",
    cpf: "",
  });

  const handleChange = (event) => {
    if (event.target) {
        const { name, value } = event.target;
        setValues((prevState) => ({
          ...prevState,
          [name]: value,
        }));
    
        if (event.target.value !== "") {
            setMessageError((prevState) => ({
              ...prevState,
              [event.target.name]: "",
            }));
          }
      } else {
        setValues((prevState) => ({
            ...prevState,
            birthday: event ? dayjs(event) : null,
          }));
      }
  };

  const handleDateAdmission = (event) => {
    setValues((prevState) => ({
        ...prevState,
        dateAdmission: event ? dayjs(event) : null,
      }));
  }

  const handleDateResignation = (event) => {
    setValues((prevState) => ({
        ...prevState,
        dateResignation: event ? dayjs(event) : null,
      }));
  }

  const areRequiredFieldsFilled = () => {
    const requiredFields = [
      "name",
      "cpf",
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

  const removeMask = (maskedValue) => {
    return maskedValue.replace(/[.,]/g, "");
  };

  const handleFormatsChange = (event) => {
    const { name, value } = event.target;

    const unmaskedValue = removeMask(value);

    if (name === "cpf") {
      setValues((prevState) => ({
        ...prevState,
        [name]: unmaskedValue,
      }));

      setFormatCpfOrCnpj(Formats.CpfCnpj(value));
    } else if (name === "initialWage") {
      setValues((prevState) => ({
        ...prevState,
        [name]: unmaskedValue,
      }));

      setValueMoney(Formats.Money(value));
    } else if (name === "cep") {
      setValues((prevState) => ({
        ...prevState,
        [name]: unmaskedValue,
      }));

      setFormatCep(Formats.Cep(value));
    } else if (name === "currentWage") {
      setValues((prevState) => ({
        ...prevState,
        [name]: unmaskedValue,
      }));

      setCurrentMoney(Formats.Money(value));
    } 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emptyField = areRequiredFieldsFilled();

    if (!emptyField) {
      Toast.Info("Preencha os campos obrigatórios!");
      return;
    }

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
      title="Cadastrar Funcionário"
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
    >
      <Form.Fragment section="Dados do Colaborador">
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
          <CustomInput.DateInput
          label="Data de Nascimento"
          name="birthday"
          onChange={handleChange}
          value={values.birthday}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
          label="CPF"
          name="cpf"
          value={formatCpfOrCnpj}
          onChange={handleFormatsChange}
          errorText={messageError.cpf}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
          label="CTPS"
          name="ctps"
          value={values.ctps}
          onChange={handleChange}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Série"
            type="text"
            name="serie"
            value={values.serie}
            onChange={handleChange}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Select
            label="Cargo"
            type="text"
            name="office"
            value={values.office}
            onChange={handleChange}
            options={Options.Office()}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="CBO nº"
            name="cbo"
            value={values.cbo}
            onChange={handleChange}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Select
            label="Escolaridade"
            type="text"
            name="education"
            value={values.education}
            onChange={handleChange}
            options={Options.Education()}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Select
            label="Estado Civil"
            type="text"
            name="maritalStatus"
            value={values.maritalStatus}
            onChange={handleChange}
            options={Options.MaritalStatus()}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Nacionalidade"
            type="text"
            name="nationality"
            value={values.nationality}
            onChange={handleChange}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="PIS"
            type="text"
            name="pis"
            value={values.pis}
            onChange={handleChange}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="RG"
            type="text"
            name="rg"
            value={values.rg}
            onChange={handleChange}
          />
        </CustomInput.Root>
      </Form.Fragment>
      <Form.Fragment section="Endereço do Colaborador">
      <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="CEP"
            type="text"
            name="cep"
            value={formatCep}
            onChange={handleFormatsChange}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Rua"
            type="text"
            name="road"
            value={values.road}
            onChange={handleChange}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Número"
            type="text"
            name="number"
            value={values.number}
            onChange={handleChange}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Complemento"
            type="text"
            name="complement"
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
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Cidade"
            type="text"
            name="city"
            value={values.city}
            onChange={handleChange}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="UF"
            type="text"
            name="state"
            value={values.state}
            onChange={handleChange}
          />
        </CustomInput.Root>
      </Form.Fragment>
      <Form.Fragment section="Dados da Função">
        <CustomInput.Root columnSize={6}>
          <CustomInput.Select
            label="Nível"
            type="text"
            name="level"
            value={values.level}
            onChange={handleChange}
            options={Options.Level()}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Select
            label="Departamento"
            name="department"
            value={values.department}
            onChange={handleChange}
            options={Options.Departments()}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Select
            label="Empresa"
            name="company"
            value={values.company}
            onChange={handleChange}
            options={Options.Companies()}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Select
            label="Centro de Custo"
            name="costCenter"
            value={values.costCenter}
            onChange={handleChange}
            options={Options.CostCenter()}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.DateInput
            label="Data de Admissão"
            name="dateAdmission"
            value={values.dateAdmission}
            onChange={handleDateAdmission}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.DateInput
            label="Data de Demissão"
            name="dateResignation"
            value={values.dateResignation}
            onChange={handleDateResignation}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Salário Inicial"
            type="text"
            name="initialWage"
            value={valueMoney}
            onChange={handleFormatsChange}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Salário Atual"
            type="text"
            name="currentWage"
            value={currentMoney}
            onChange={handleFormatsChange}
          />
        </CustomInput.Root>
      </Form.Fragment>
    </Form.Root>
  );
}
