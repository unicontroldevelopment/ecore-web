import { Button, Modal } from "antd";
import * as React from "react";
import { Filter } from "../../../components/filter";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input/index";
import { CustomModal } from "../../../components/modal";
import { Table } from "../../../components/table";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import EmployeeService from "../../../services/EmployeeService";
import { Options } from "../../../utils/options";

export default function ListEmployee() {
  VerifyUserRole(["Master", "Administrador", "RH"]);
  const [users, setUsers] = React.useState([]);
  const [selectUser, setSelectUser] = React.useState({
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
    emailPassword: "",
    discordEmail: "",
    discordPassword: "",
    notebookBrand: "",
    notebookName: "",
    notebookProperty: "",
    coolerProperty: "",
    officeVersion: "",
    windowsVersion: "",
  });
  const [isModalVisibleView, setIsModalVisibleView] = React.useState(false);
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = React.useState(false);
  const [filter, setFilter] = React.useState({
    name: "",
    role: "",
    department: "",
    company: "",
    unit: "",
  });

  const service = new EmployeeService();

  React.useEffect(() => {
    const fetchUsers = async () => {
      const request = await service.getEmployees(
        filter.role,
        filter.name,
        filter.department,
        filter.company,
        filter.unit
      );
      setUsers(request.data.listUsers);
    };
    fetchUsers();
  }, [filter]);

  const handleChange = (event) => {
    setSelectUser((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleChangeFilter = (event) => {
    setFilter((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const confirmDelete = async (e) => {
    try {
      const response = await service.delete(e.id);

      if (response.status === 200) {
        setUsers(users.filter((user) => user.id !== e.id));

        Toast.Success("Funcionário deletado com sucesso!");
      }
      return response;
    } catch (error) {
      return error;
    }
  };
  const cancelDelete = () => {
    return;
  };

  const confirmUpdate = async (updateData) => {
    try {
      const response = await service.update(updateData.id, updateData);

      if (response.status === 200) {
        const updatedData = users.map((user) =>
          user.id === updateData.id ? { ...user, ...updateData } : user
        );

        setUsers(updatedData);
        Toast.Success("Funcionário atualizado com sucesso!");

        setIsModalVisibleUpdate(false);
      }

      return response;
    } catch (error) {
      return error;
    }
  };

  const handleUpdate = (user) => {
    setSelectUser(user);
    setIsModalVisibleUpdate(true);
  };

  const handleView = (user) => {
    setSelectUser(user);
    setIsModalVisibleView(true);
  };

  const options = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Perfil",
      key: "role",
      dataIndex: "role",
      render: (text, record) => <span>{record.role ?? "-"}</span>,
    },
    {
      title: "Setor",
      key: "department",
      dataIndex: "department",
      render: (text, record) => <span>{record.department ?? "-"}</span>,
    },
    {
      title: "Empresa",
      dataIndex: "company",
      key: "company",
      render: (text, record) => <span>{record.company ?? "-"}</span>,
    },
    {
      title: "Unidade",
      dataIndex: "unit",
      key: "unit",
      render: (text, record) => <span>{record.unit ?? "-"}</span>,
    },
  ];

  return (
    <Table.Root title="Lista de funcionários" columnSize={6}>
      <Filter.Fragment section="Filtros">
        <Filter.FilterInput
          label="Nome"
          name="name"
          value={filter.name}
          onChange={handleChangeFilter}
        />
        <Filter.Select
          label="Perfil"
          name="role"
          value={filter.role}
          onChange={handleChangeFilter}
          options={Options.Roles()}
        />
        <Filter.Select
          label="Setor"
          name="department"
          value={filter.department}
          onChange={handleChangeFilter}
          options={Options.Departments()}
        />
        <Filter.Select
          label="Empresas"
          name="company"
          value={filter.company}
          onChange={handleChangeFilter}
          options={Options.Companies()}
        />
        <Filter.Select
          label="Unidade"
          name="unit"
          value={filter.unit}
          onChange={handleChangeFilter}
          options={Options.Units()}
        />
      </Filter.Fragment>
      <Table.Table
        data={users}
        columns={options}
        onView={handleView}
        onUpdate={handleUpdate}
        confirm={confirmDelete}
        cancel={cancelDelete}
      />
      {isModalVisibleView && (
        <Modal
          title="Detalhes do Funcionário"
          open={isModalVisibleView}
          centered
          width={1000}
          onCancel={() => setIsModalVisibleView(false)}
          footer={[
            <Button key="back" onClick={() => setIsModalVisibleView(false)}>
              Voltar
            </Button>,
          ]}
        >
          <CustomModal.Info label="Nome" value={selectUser.name} />
          <CustomModal.Info label="Senha" value={selectUser.password} />
          <CustomModal.Info label="Perfil" value={selectUser.role} />
          <CustomModal.Info label="Setor" value={selectUser.department} />
          <CustomModal.Info label="Empresa" value={selectUser.company} />
          <CustomModal.Info label="Unidade" value={selectUser.unit} />
          <CustomModal.Info
            label="Usuário rede"
            value={selectUser.networkUser}
          />
          <CustomModal.Info
            label="Senha rede"
            value={selectUser.networkPassword}
          />
          <CustomModal.Info label="Email" value={selectUser.email} />
          <CustomModal.Info
            label="Senha e-mail"
            value={selectUser.emailPassword}
          />
          <CustomModal.Info
            label="E-mail discord"
            value={selectUser.discordEmail}
          />
          <CustomModal.Info
            label="Senha discord"
            value={selectUser.discordPassword}
          />
          <CustomModal.Info
            label="Marca Notebook"
            value={selectUser.notebookBrand}
          />
          <CustomModal.Info
            label="Nome Notebook"
            value={selectUser.notebookName}
          />
          <CustomModal.Info
            label="Patrimônio notebook"
            value={selectUser.notebookProperty}
          />
          <CustomModal.Info
            label="Patrimônio cooler"
            value={selectUser.coolerProperty}
          />
          <CustomModal.Info
            label="Versão office"
            value={selectUser.officeVersion}
          />
          <CustomModal.Info
            label="Versão windows"
            value={selectUser.windowsVersion}
          />
        </Modal>
      )}
      {isModalVisibleUpdate && (
        <Modal
          title="Editar usuário"
          open={isModalVisibleUpdate}
          centered
          style={{ top: 20 }}
          onCancel={() => setIsModalVisibleUpdate(false)}
          width={1200}
          footer={[
            <Button
              key="submit"
              type="primary"
              onClick={() => confirmUpdate(selectUser)}
            >
              Atualizar
            </Button>,
            <Button key="back" onClick={() => setIsModalVisibleUpdate(false)}>
              Voltar
            </Button>,
          ]}
        >
          <Form.Fragment section="Dados do Colaborador">
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Nome Completo"
                type="text"
                name="name"
                value={selectUser.name}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Select
                label="Selecione um setor"
                name="department"
                value={selectUser.department}
                onChange={handleChange}
                options={Options.Departments()}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Select
                label="Selecione uma empresa"
                name="company"
                value={selectUser.company}
                onChange={handleChange}
                options={Options.Companies()}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Select
                label="Selecione uma unidade"
                name="unit"
                value={selectUser.unit}
                onChange={handleChange}
                options={Options.Units()}
              />
            </CustomInput.Root>
          </Form.Fragment>
          <Form.Fragment section="Acesso Ecore Web">
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Usuário (E-mail)"
                type="text"
                name="user"
                value={selectUser.email}
                disabled={true}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Select
                label="Perfil"
                name="role"
                value={selectUser.role}
                onChange={handleChange}
                options={Options.Roles()}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Senha"
                type="text"
                name="password"
                value={selectUser.password}
                onChange={handleChange}
              />
            </CustomInput.Root>
          </Form.Fragment>
          <Form.Fragment section="E-mail">
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="E-mail"
                type="text"
                name="email"
                value={selectUser.email}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Senha e-mail"
                type="text"
                name="emailPassword"
                value={selectUser.emailPassword}
                onChange={handleChange}
              />
            </CustomInput.Root>
          </Form.Fragment>
          <Form.Fragment section="Acesso à rede">
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Usuário rede"
                type="text"
                name="networkUser"
                value={selectUser.networkUser}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Senha rede"
                type="text"
                name="networkPassword"
                value={selectUser.networkPassword}
                onChange={handleChange}
              />
            </CustomInput.Root>
          </Form.Fragment>
          <Form.Fragment section="Discord">
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="E-mail discord"
                type="text"
                name="discordEmail"
                value={selectUser.discordEmail}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Senha discord"
                type="text"
                name="discordPassword"
                value={selectUser.discordPassword}
                onChange={handleChange}
              />
            </CustomInput.Root>
          </Form.Fragment>
          <Form.Fragment section="Notebook">
            <CustomInput.Root columnSize={6}>
              <CustomInput.Select
                label="Marca Notebook"
                name="notebookBrand"
                value={selectUser.notebookBrand}
                onChange={handleChange}
                options={Options.NotebookBrands()}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Nome Notebook"
                type="text"
                name="notebookName"
                value={selectUser.notebookName}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Patrimônio Notebook"
                type="text"
                name="notebookProperty"
                value={selectUser.notebookProperty}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Patrimônio cooler"
                type="text"
                name="coolerProperty"
                value={selectUser.coolerProperty}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Select
                label="Versão Office"
                name="officeVersion"
                value={selectUser.officeVersion}
                onChange={handleChange}
                options={Options.OfficeVersions()}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Select
                label="Versão sistema operacional"
                name="windowsVersion"
                value={selectUser.windowsVersion}
                onChange={handleChange}
                options={Options.OSVersions()}
              />
            </CustomInput.Root>
          </Form.Fragment>
        </Modal>
      )}
    </Table.Root>
  );
}
