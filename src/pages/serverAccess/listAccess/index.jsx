import { Button, Modal } from "antd";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Filter } from "../../../components/filter";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input";
import { CustomModal } from "../../../components/modal";
import { CustomSwitch } from "../../../components/switch";
import { Table } from "../../../components/table";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import ServerAccessService from "../../../services/ServerAccessService";

export default function ListServerAccess() {
  VerifyUserRole(["Master", "Administrador", "RH"]);
  const [users, setUsers] = React.useState([]);
  const [selectUser, setSelectUser] = React.useState(null);
  const [isModalVisibleView, setIsModalVisibleView] = React.useState(false);
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = React.useState(false);
  const [filter, setFilter] = React.useState({
    name: "",
  });

  const service = new ServerAccessService();

  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchUsers = async () => {
      const request = await service.getServerAccess(filter.name);

      setUsers(request.data.listUsers);
    };
    fetchUsers();
  }, [filter]);

  const handleChangeFilter = (event) => {
    setFilter((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const confirmDelete = async (e) => {
    try {
      const response = await service.delete(e.ServerAccess[0].id);

      if (response.status === 200) {
        setUsers(
          users.filter(
            (user) => user.ServerAccess[0].id !== e.ServerAccess[0].id
          )
        );

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
      const serverData = updateData.ServerAccess[0];
      const serverId = updateData.ServerAccess[0].id;

      const response = await service.update(serverId, serverData);

      if (response.status === 200) {
        const updatedData = users.map((user) =>
          user.ServerAccess[0].id === updateData.ServerAccess[0].id
            ? { ...user, ...updateData }
            : user
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

  const ButtonRegister = () => {
    navigate("/serveraccess/create");
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
        <CustomInput.Root columnSize={12}>
          <Filter.FilterInput
            label="Nome"
            name="name"
            value={filter.name}
            onChange={handleChangeFilter}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
        <Filter.Button label="Registar Novo Acesso" onClick={ButtonRegister} />
        </CustomInput.Root>
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
          <CustomModal.Boolean
            label="Fitolog"
            value={selectUser.ServerAccess[0].fitolog}
          />
          <CustomModal.Boolean
            label="Comercial"
            value={selectUser.ServerAccess[0].commercial}
          />
          <CustomModal.Boolean
            label="Administrativo"
            value={selectUser.ServerAccess[0].administrative}
          />
          <CustomModal.Boolean
            label="RH"
            value={selectUser.ServerAccess[0].humanResources}
          />
          <CustomModal.Boolean
            label="Técnico"
            value={selectUser.ServerAccess[0].technician}
          />
          <CustomModal.Boolean
            label="Newsis"
            value={selectUser.ServerAccess[0].newsis}
          />
          <CustomModal.Boolean
            label="Marketing"
            value={selectUser.ServerAccess[0].marketing}
          />
          <CustomModal.Boolean
            label="Projetos"
            value={selectUser.ServerAccess[0].projects}
          />
          <CustomModal.Boolean
            label="Controle Gestão"
            value={selectUser.ServerAccess[0].managementControl}
          />
          <CustomModal.Boolean
            label="Treinamentos"
            value={selectUser.ServerAccess[0].trainings}
          />
          <CustomModal.Boolean
            label="TI"
            value={selectUser.ServerAccess[0].it}
          />
          <CustomModal.Boolean
            label="Temp"
            value={selectUser.ServerAccess[0].temp}
          />
          <CustomModal.Boolean
            label="Franquias"
            value={selectUser.ServerAccess[0].franchises}
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
          <Form.Fragment section="Atualizar Lista de Acessos do Funcionário">
            <CustomSwitch.Root columnSize={12}>
              <CustomSwitch.Switch
                label="Fitolog"
                enabled={selectUser.ServerAccess[0].fitolog}
                permissionName="fitolog"
                onChange={(checked) => {
                  let updatedUser = { ...selectUser };
                  updatedUser.ServerAccess = updatedUser.ServerAccess.map(
                    (access, index) => {
                      if (index === 0) {
                        return { ...access, fitolog: checked };
                      }
                      return access;
                    }
                  );

                  setSelectUser(updatedUser);
                }}
              />
            </CustomSwitch.Root>
            <CustomSwitch.Root columnSize={12}>
              <CustomSwitch.Switch
                label="Comercial"
                enabled={selectUser.ServerAccess[0].commercial}
                permissionName="commercial"
                onChange={(checked) => {
                  let updatedUser = { ...selectUser };
                  updatedUser.ServerAccess = updatedUser.ServerAccess.map(
                    (access, index) => {
                      if (index === 0) {
                        return { ...access, commercial: checked };
                      }
                      return access;
                    }
                  );

                  setSelectUser(updatedUser);
                }}
              />
            </CustomSwitch.Root>
            <CustomSwitch.Root columnSize={12}>
              <CustomSwitch.Switch
                label="Administrativo"
                enabled={selectUser.ServerAccess[0].administrative}
                permissionName="administrative"
                onChange={(checked) => {
                  let updatedUser = { ...selectUser };
                  updatedUser.ServerAccess = updatedUser.ServerAccess.map(
                    (access, index) => {
                      if (index === 0) {
                        return { ...access, administrative: checked };
                      }
                      return access;
                    }
                  );

                  setSelectUser(updatedUser);
                }}
              />
            </CustomSwitch.Root>
            <CustomSwitch.Root columnSize={12}>
              <CustomSwitch.Switch
                label="RH"
                enabled={selectUser.ServerAccess[0].humanResources}
                permissionName="humanResources"
                onChange={(checked) => {
                  let updatedUser = { ...selectUser };
                  updatedUser.ServerAccess = updatedUser.ServerAccess.map(
                    (access, index) => {
                      if (index === 0) {
                        return { ...access, humanResources: checked };
                      }
                      return access;
                    }
                  );

                  setSelectUser(updatedUser);
                }}
              />
            </CustomSwitch.Root>
            <CustomSwitch.Root columnSize={12}>
              <CustomSwitch.Switch
                label="Técnico"
                enabled={selectUser.ServerAccess[0].technician}
                permissionName="technician"
                onChange={(checked) => {
                  let updatedUser = { ...selectUser };
                  updatedUser.ServerAccess = updatedUser.ServerAccess.map(
                    (access, index) => {
                      if (index === 0) {
                        return { ...access, technician: checked };
                      }
                      return access;
                    }
                  );

                  setSelectUser(updatedUser);
                }}
              />
            </CustomSwitch.Root>
            <CustomSwitch.Root columnSize={12}>
              <CustomSwitch.Switch
                label="Newsis"
                enabled={selectUser.ServerAccess[0].newsis}
                permissionName="newsis"
                onChange={(checked) => {
                  let updatedUser = { ...selectUser };
                  updatedUser.ServerAccess = updatedUser.ServerAccess.map(
                    (access, index) => {
                      if (index === 0) {
                        return { ...access, newsis: checked };
                      }
                      return access;
                    }
                  );

                  setSelectUser(updatedUser);
                }}
              />
            </CustomSwitch.Root>
            <CustomSwitch.Root columnSize={12}>
              <CustomSwitch.Switch
                label="Marketing"
                enabled={selectUser.ServerAccess[0].marketing}
                permissionName="marketing"
                onChange={(checked) => {
                  let updatedUser = { ...selectUser };
                  updatedUser.ServerAccess = updatedUser.ServerAccess.map(
                    (access, index) => {
                      if (index === 0) {
                        return { ...access, marketing: checked };
                      }
                      return access;
                    }
                  );

                  setSelectUser(updatedUser);
                }}
              />
            </CustomSwitch.Root>
            <CustomSwitch.Root columnSize={12}>
              <CustomSwitch.Switch
                label="Projetos"
                enabled={selectUser.ServerAccess[0].projects}
                permissionName="projects"
                onChange={(checked) => {
                  let updatedUser = { ...selectUser };
                  updatedUser.ServerAccess = updatedUser.ServerAccess.map(
                    (access, index) => {
                      if (index === 0) {
                        return { ...access, projects: checked };
                      }
                      return access;
                    }
                  );

                  setSelectUser(updatedUser);
                }}
              />
            </CustomSwitch.Root>
            <CustomSwitch.Root columnSize={12}>
              <CustomSwitch.Switch
                label="Controle Gestão"
                enabled={selectUser.ServerAccess[0].managementControl}
                permissionName="managementControl"
                onChange={(checked) => {
                  let updatedUser = { ...selectUser };
                  updatedUser.ServerAccess = updatedUser.ServerAccess.map(
                    (access, index) => {
                      if (index === 0) {
                        return { ...access, managementControl: checked };
                      }
                      return access;
                    }
                  );

                  setSelectUser(updatedUser);
                }}
              />
            </CustomSwitch.Root>
            <CustomSwitch.Root columnSize={12}>
              <CustomSwitch.Switch
                label="Treinamentos"
                enabled={selectUser.ServerAccess[0].trainings}
                permissionName="trainings"
                onChange={(checked) => {
                  let updatedUser = { ...selectUser };
                  updatedUser.ServerAccess = updatedUser.ServerAccess.map(
                    (access, index) => {
                      if (index === 0) {
                        return { ...access, trainings: checked };
                      }
                      return access;
                    }
                  );

                  setSelectUser(updatedUser);
                }}
              />
            </CustomSwitch.Root>
            <CustomSwitch.Root columnSize={12}>
              <CustomSwitch.Switch
                label="TI"
                enabled={selectUser.ServerAccess[0].it}
                permissionName="it"
                onChange={(checked) => {
                  let updatedUser = { ...selectUser };
                  updatedUser.ServerAccess = updatedUser.ServerAccess.map(
                    (access, index) => {
                      if (index === 0) {
                        return { ...access, it: checked };
                      }
                      return access;
                    }
                  );

                  setSelectUser(updatedUser);
                }}
              />
            </CustomSwitch.Root>
            <CustomSwitch.Root columnSize={12}>
              <CustomSwitch.Switch
                label="Temp"
                enabled={selectUser.ServerAccess[0].temp}
                permissionName="temp"
                onChange={(checked) => {
                  let updatedUser = { ...selectUser };
                  updatedUser.ServerAccess = updatedUser.ServerAccess.map(
                    (access, index) => {
                      if (index === 0) {
                        return { ...access, temp: checked };
                      }
                      return access;
                    }
                  );

                  setSelectUser(updatedUser);
                }}
              />
            </CustomSwitch.Root>
            <CustomSwitch.Root columnSize={12}>
              <CustomSwitch.Switch
                label="Franquias"
                enabled={selectUser.ServerAccess[0].franchises}
                permissionName="franchises"
                onChange={(checked) => {
                  let updatedUser = { ...selectUser };
                  updatedUser.ServerAccess = updatedUser.ServerAccess.map(
                    (access, index) => {
                      if (index === 0) {
                        return { ...access, franchises: checked };
                      }
                      return access;
                    }
                  );

                  setSelectUser(updatedUser);
                }}
              />
            </CustomSwitch.Root>
          </Form.Fragment>
        </Modal>
      )}
    </Table.Root>
  );
}
