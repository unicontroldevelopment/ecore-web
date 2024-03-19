import { Button, Modal } from "antd";
import * as React from "react";
import { Filter } from "../../../components/filter";
import { CustomModal } from "../../../components/modal";
import { Table } from "../../../components/table";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import EmployeeService from "../../../services/EmployeeService";
import { Options } from "../../../utils/options";

export default function ListEmployee() {
  VerifyUserRole(["Master", "Administrador", "RH"]);
  const [users, setUsers] = React.useState([]);
  const [filteredUsers, setFilteredUsers] = React.useState([]);
  const [selectUser, setSelectUser] = React.useState([]);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
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
      const request = await service.getUsers();

      setUsers(request.data.listUsers);
      setFilteredUsers(request.data.listUsers);
    };
    fetchUsers();
  }, []);


  const applyFilter = () => {
    const initialFilter = users;

    const filtered = initialFilter
      .filter((user) => user.name.includes(filter.name))
      .filter((user) => user.role.includes(filter.role))
      .filter((user) => user.department.includes(filter.department))
      .filter((user) => user.company.includes(filter.company))
      .filter((user) => user.unit.includes(filter.unit));

    setFilteredUsers(filtered);
  };

  React.useEffect(() => {
    applyFilter();
  }, [filter, users]);

  const handleChange = (event) => {
    setFilter((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const confirmDelete = async (e) => {
    try {
      const response = await service.delete(e.id);

      if (response.status === 200) {
        setUsers(filteredUsers.filter((user) => user.id !== e.id));
      }
      return response;
    } catch (error) {
      return error;
    }
  };
  const cancelDelete = () => {
    return;
  };

  const handleView = (user) => {
    setSelectUser(user);
    setIsModalVisible(true);
  };

  return (
    <Table.Root title="Lista de funcionários" columnSize={6}>
      <Filter.Fragment section="Filtro">
        <Filter.FilterInput
          label="Nome"
          name="name"
          value={filter.name}
          onChange={handleChange}
        />
        <Filter.Select
          label="Perfil"
          name="role"
          value={filter.role}
          onChange={handleChange}
          options={Options.Roles()}
        />
        <Filter.Select
          label="Setor"
          name="department"
          value={filter.department}
          onChange={handleChange}
          options={Options.Departments()}
        />
        <Filter.Select
          label="Empresas"
          name="company"
          value={filter.company}
          onChange={handleChange}
          options={Options.Companies()}
        />
        <Filter.Select
          label="Unidade"
          name="unit"
          value={filter.unit}
          onChange={handleChange}
          options={Options.Units()}
        />
      </Filter.Fragment>
      <Table.Table
        data={filteredUsers}
        onView={handleView}
        confirm={confirmDelete}
        cancel={cancelDelete}
      />
      {isModalVisible && (
        <Modal
          title="Detalhes do usuário"
          open={isModalVisible}
          centered
          width={1000}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="back" onClick={() => setIsModalVisible(false)}>
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
    </Table.Root>
  );
}
