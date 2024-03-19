import { Modal } from "antd";
import * as React from "react";
import { Filter } from "../../../components/filter";
import { Table } from "../../../components/table";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import EmployeeService from "../../../services/EmployeeService";
import { Options } from "../../../utils/options";

export default function ListEmployee() {
  VerifyUserRole(["Master", "Administrador", "RH"]);
  const [users, setUsers] = React.useState([]);
  const [filteredUsers, setFilteredUsers] = React.useState([]);
  const [selectUser, setSelectUser] = React.useState(null);
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
        <Filter.CustomInput
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
          title="Detalhes do Usuário"
          open={isModalVisible}
          onOk={() => setIsModalVisible(false)}
          onCancel={() => setIsModalVisible(false)}
        >
          <p>Nome: {selectUser?.name}</p>
          <p>Senha: {selectUser?.password}</p>
          <p>E-mail: {selectUser?.email}</p>
          <p>Senha E-mail: {selectUser?.passwordEmail}</p>
          <p>Setor: {selectUser?.department}</p>
          <p>Empresa: {selectUser?.company}</p>
          <p>Unidade: {selectUser?.unit}</p>
          <p>Usuário Rede: {selectUser?.networkUser}</p>
          <p>Senha Rede: {selectUser?.networkPassword}</p>
          <p>E-mail Discord: {selectUser?.discordEmail}</p>
          <p>Senha Discord: {selectUser?.discordPassword}</p>
        </Modal>
      )}
    </Table.Root>
  );
}
