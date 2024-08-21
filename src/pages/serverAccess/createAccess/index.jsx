import * as React from "react";
import { useNavigate } from "react-router-dom";

import { Form } from "../../../components/form";
import { CustomSwitch } from "../../../components/switch";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import EmployeeService from "../../../services/EmployeeService";
import ServerAccessService from "../../../services/ServerAccessService";

export default function CreateAccess() {
  VerifyUserRole(["Master", "Administrador"]);
  const navigate = useNavigate();
  const service = new ServerAccessService();
  const employeeService = new EmployeeService();

  const [employees, setEmployees] = React.useState([]);
  const [valueName, setValueName] = React.useState("");
  const [employeesNames, setEmployeesNames] = React.useState([]);
  const [messageError, setMessageError] = React.useState("");
  const [values, setValues] = React.useState({
    fitolog: false,
    commercial: false,
    administrative: false,
    humanResources: false,
    technician: false,
    newsis: false,
    marketing: false,
    projects: false,
    managementControl: false,
    trainings: false,
    it: false,
    temp: false,
    franchises: false,
    employeeId: "",
  });

  React.useEffect(() => {
    const fetchUsers = async () => {
        const allEmployeesRequest = await employeeService.getEmployees();
        const allEmployees = allEmployeesRequest.data.listUsers;

        const registeredAccessRequest = await service.getServerAccess();
        const registeredAccess = registeredAccessRequest.data.listUsers;

        const registeredIds = new Set(registeredAccess.map(user => user.ServerAccess[0].employeeInfoId));

        const unregisteredEmployees = allEmployees.filter(
          user => !registeredIds.has(user.id)
        );

        const employeeOptions = await unregisteredEmployees.map(user => user.name);

      setEmployees(unregisteredEmployees);
      setEmployeesNames(employeeOptions);
    };
    fetchUsers();
  }, []);

  const areRequiredFieldsFilled = () => {
    if (!valueName) {
      setMessageError("Este campo é obrigatório");
      return false;
    }
    setMessageError("");
    return true;
  };

  const handleChange = async (event) => {
    try {
      setValues((prevState) => {
        const employeeInfoId = employees.find((user) => user.name === event.target.value);
        const updatedValues = {
          ...prevState,
          [event.target.name]: employeeInfoId.id,
        };
        setValueName(event.target.value);
        return updatedValues;
      });
      if (event.target.value !== "") {
        setMessageError("");
      }
    } catch (error) {
      return error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isAllFieldsFilled = areRequiredFieldsFilled();
  
    if (!isAllFieldsFilled) {
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
      title="Cadastrar Acessos ao Servidor"
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
    >
      <Form.Fragment section="Lista de Funcionários">
        <CustomSwitch.Select
          label="Funcionários"
          name="employeeInfoId"
          value={valueName}
          onChange={handleChange}
          options={employeesNames}
          errorText={messageError}
        />
      </Form.Fragment>
      <Form.Fragment section="Acessos as Pastas">
        <CustomSwitch.Root columnSize={12}>
          <CustomSwitch.Switch
            label="Fitolog"
            enabled={values.fitolog}
            permissionName="fitolog"
            onChange={(checked) => {
              setValues({ ...values, fitolog: checked });
            }}
          />
        </CustomSwitch.Root>
        <CustomSwitch.Root columnSize={12}>
          <CustomSwitch.Switch
            label="Comercial"
            enabled={values.commercial}
            permissionName="commercial"
            onChange={(checked) => {
              setValues({ ...values, commercial: checked });
            }}
          />
        </CustomSwitch.Root>
        <CustomSwitch.Root columnSize={12}>
          <CustomSwitch.Switch
            label="Administrativo"
            enabled={values.administrative}
            permissionName="administrative"
            onChange={(checked) => {
              setValues({ ...values, administrative: checked });
            }}
          />
        </CustomSwitch.Root>
        <CustomSwitch.Root columnSize={12}>
          <CustomSwitch.Switch
            label="RH"
            enabled={values.humanResources}
            permissionName="humanResources"
            onChange={(checked) => {
              setValues({ ...values, humanResources: checked });
            }}
          />
        </CustomSwitch.Root>
        <CustomSwitch.Root columnSize={12}>
          <CustomSwitch.Switch
            label="Técnico"
            enabled={values.technician}
            permissionName="technician"
            onChange={(checked) => {
              setValues({ ...values, technician: checked });
            }}
          />
        </CustomSwitch.Root>
        <CustomSwitch.Root columnSize={12}>
          <CustomSwitch.Switch
            label="Newsis"
            enabled={values.newsis}
            permissionName="newsis"
            onChange={(checked) => {
              setValues({ ...values, newsis: checked });
            }}
          />
        </CustomSwitch.Root>
        <CustomSwitch.Root columnSize={12}>
          <CustomSwitch.Switch
            label="Marketing"
            enabled={values.marketing}
            permissionName="marketing"
            onChange={(checked) => {
              setValues({ ...values, marketing: checked });
            }}
          />
        </CustomSwitch.Root>
        <CustomSwitch.Root columnSize={12}>
          <CustomSwitch.Switch
            label="Projetos"
            enabled={values.projects}
            permissionName="projects"
            onChange={(checked) => {
              setValues({ ...values, projects: checked });
            }}
          />
        </CustomSwitch.Root>
        <CustomSwitch.Root columnSize={12}>
          <CustomSwitch.Switch
            label="Controle Gestão"
            enabled={values.managementControl}
            permissionName="managementControl"
            onChange={(checked) => {
              setValues({ ...values, managementControl: checked });
            }}
          />
        </CustomSwitch.Root>
        <CustomSwitch.Root columnSize={12}>
          <CustomSwitch.Switch
            label="Treinamentos"
            enabled={values.trainings}
            permissionName="trainings"
            onChange={(checked) => {
              setValues({ ...values, trainings: checked });
            }}
          />
        </CustomSwitch.Root>
        <CustomSwitch.Root columnSize={12}>
          <CustomSwitch.Switch
            label="TI"
            enabled={values.it}
            permissionName="it"
            onChange={(checked) => {
              setValues({ ...values, it: checked });
            }}
          />
        </CustomSwitch.Root>
        <CustomSwitch.Root columnSize={12}>
          <CustomSwitch.Switch
            label="Temp"
            enabled={values.temp}
            permissionName="temp"
            onChange={(checked) => {
              setValues({ ...values, temp: checked });
            }}
          />
        </CustomSwitch.Root>
        <CustomSwitch.Root columnSize={12}>
          <CustomSwitch.Switch
            label="Franquias"
            enabled={values.franchises}
            permissionName="franchises"
            onChange={(checked) => {
              setValues({ ...values, franchises: checked });
            }}
          />
        </CustomSwitch.Root>
      </Form.Fragment>
    </Form.Root>
  );
}
