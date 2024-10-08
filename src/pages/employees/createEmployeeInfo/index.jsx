import * as React from "react";
import { useNavigate } from "react-router-dom";

import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input/index";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import EmployeeService from "../../../services/EmployeeService";
import { Options } from "../../../utils/options";

export default function CreateEmployeeInfo() {
  VerifyUserRole(["Master", "Administrador"]);
  const navigate = useNavigate();
  const service = new EmployeeService();

  const [employees, setEmployees] = React.useState([]);
  const [values, setValues] = React.useState({
    name: "",
    role: [],
    password: "",
    passwordConfirmation: "",
    department: "",
    company: "",
    unit: "",
    networkUser: "",
    networkPassword: "",
    email: "",
    emailPassword: "",
    discordEmail: "",
    discordPassword: "",
    notebookBrand: "",
    notebookName: "",
    notebookProperty: "",
    coolerProperty: "",
    officeVersion: "",
    windowsVersion: "",
    employeeId: "",
  });
  const [messageError, setMessageError] = React.useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  React.useEffect(() => {
    const fetchUsers = async () => {
      const allEmployeesRequest = await service.getEmployees();
      const allEmployees = allEmployeesRequest.data.listUsers;

      const registeredInfoRequest = await service.getEmployeesInfo();
      const registeredInfo = registeredInfoRequest.data.listUsers;

      const registeredIds = new Set(registeredInfo.map(user => user.id));

      const unregisteredEmployees = allEmployees.filter(
        user => !registeredIds.has(user.id)
      );

      setEmployees(unregisteredEmployees);
    };
    fetchUsers();
  }, []);

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

  const handleSelectEmployee = (event) => {
    const selectedEmployee = employees.filter((employee) => employee.name === event.target.value)

    setValues((prevState) => {
      const updatedValues = {
        ...prevState,
        [event.target.name]: event.target.value,
        company: selectedEmployee[0].company,
        unit: selectedEmployee[0].costCenter,
        employeeId: selectedEmployee[0].id
      };
      return updatedValues;
    });
  }

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
      Toast.Info("Preencha os campos obrigatórios!");
      return;
    }

    const response = await service.createInfo(values);

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
        <CustomInput.Select
          label="Funcionário"
          name="name"
          value={values.name}
          options={employees.map((name) => name.name)}
          onChange={handleSelectEmployee}
        />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Select
            label="Perfil"
            name="department"
            value={values.department}
            onChange={handleChange}
            options={Options.Departments()}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Empresa"
            name="company"
            value={values.company}
            onChange={handleChange}
            disabled={true}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Unidade"
            name="unit"
            value={values.unit}
            onChange={handleChange}
            disabled={true}
          />
        </CustomInput.Root>
      </Form.Fragment>
      <Form.Fragment section="Acesso Ecore Web">
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Usuário (E-mail)"
            type="text"
            name="user"
            value={values.email}
            disabled={true}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Select
            label="Perfil"
            name="role"
            multiple
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
      </Form.Fragment>
      <Form.Fragment section="E-mail">
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
            name="emailPassword"
            value={values.emailPassword}
            onChange={(e) => {
              setValues({ ...values, [e.target.name]: e.target.value });
            }}
          />
        </CustomInput.Root>
      </Form.Fragment>
      <Form.Fragment section="Acesso à rede">
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
      </Form.Fragment>
      <Form.Fragment section="Discord">
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
      </Form.Fragment>
      <Form.Fragment section="Notebook">
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
      </Form.Fragment>
    </Form.Root>
  );
}
