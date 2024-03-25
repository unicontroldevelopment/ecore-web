import { Button, Modal } from "antd";
import * as React from "react";
import { Filter } from "../../../components/filter";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input/index";
import { CustomModal } from "../../../components/modal";
import { Table } from "../../../components/table";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import ServerAccessService from "../../../services/ServerAccessService";
import { Options } from "../../../utils/options";

export default function ListServerAccess() {
  VerifyUserRole(["Master", "Administrador", "RH"]);
  const [users, setUsers] = React.useState([]);
  const [selectUser, setSelectUser] = React.useState({
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
  const [isModalVisibleView, setIsModalVisibleView] = React.useState(false);
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = React.useState(false);
  const [filter, setFilter] = React.useState({
    name: "",
  });

  const service = new ServerAccessService();

  React.useEffect(() => {
    const fetchUsers = async () => {
      const request = await service.getServerAccess(
        filter.name,
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
          title="Permissões de Pastas"
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
          <CustomModal.Boolean label="Fitolog" value={selectUser.fitolog} />
          <CustomModal.Boolean label="Comercial" value={selectUser.commercial} />
          <CustomModal.Boolean label="Administrativo" value={selectUser.administrative} />
          <CustomModal.Boolean label="RH" value={selectUser.humanResources} />
          <CustomModal.Boolean label="Técnico" value={selectUser.technician} />
          <CustomModal.Boolean
            label="Newsis"
            value={selectUser.newsis}
          />
          <CustomModal.Boolean
            label="Marketing"
            value={selectUser.marketing}
          />
          <CustomModal.Boolean label="Projetos" value={selectUser.projects} />
          <CustomModal.Boolean
            label="Controle Gestão"
            value={selectUser.managementControl}
          />
          <CustomModal.Boolean
            label="Treinamentos"
            value={selectUser.trainings}
          />
          <CustomModal.Boolean
            label="TI"
            value={selectUser.it}
          />
          <CustomModal.Boolean
            label="Temp"
            value={selectUser.temp}
          />
          <CustomModal.Boolean
            label="Franquias"
            value={selectUser.franchises}
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
