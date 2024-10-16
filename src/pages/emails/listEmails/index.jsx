import { Button, Modal } from "antd";
import debounce from "lodash/debounce";
import * as React from "react";
import { Filter } from "../../../components/filter";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input/index";
import { CustomModal } from "../../../components/modal";
import { Table } from "../../../components/table";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import EmailService from "../../../services/EmailService";
import { Options } from "../../../utils/options";

export default function ListEmails() {
  VerifyUserRole(["Master", "Administrador"]);

  const [users, setUsers] = React.useState([]);
  const [filteredUsers, setFilteredUsers] = React.useState([]);
  const [selectUser, setSelectUser] = React.useState({
    email: "",
    password: "",
    type: "",
    Redirects: [],
  });
  const [isModalVisibleView, setIsModalVisibleView] = React.useState(false);
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = React.useState(false);
  const [filter, setFilter] = React.useState({
    group: "",
    email: "",
  });

  const service = new EmailService();

  const fetchUsers = React.useCallback(async () => {
    const request = await service.getEmails(filter.group);
    setUsers(request.data.listUsers);
    setFilteredUsers(request.data.listUsers);
  }, [filter.group]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEmailFilterChange = debounce((value) => {
    setFilter((prevState) => ({
      ...prevState,
      email: value,
    }));

    const filtered = users.filter((user) =>
      user.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, 300);

  const handleAddClick = () => {
    setSelectUser((prevValue) => ({
      ...prevValue,
      Redirects: [...prevValue.Redirects, { id: Date.now(), email: "" }],
    }));
  };

  const handleRedirectChange = (id, field, value) => {
    setSelectUser((prevValue) => ({
      ...prevValue,
      Redirects: prevValue.Redirects.map((redirect) =>
        redirect.id === id ? { ...redirect, [field]: value } : redirect
      ),
    }));
  };

  const handleDeleteRedirect = (id) => {
    setSelectUser((prevValue) => ({
      ...prevValue,
      Redirects: prevValue.Redirects.filter((redirect) => redirect.id !== id),
    }));
  };

  const handleChange = (event) => {
    setSelectUser((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const confirmDelete = async (e) => {
    try {
      const response = await service.delete(e.id);

      if (response.status === 200) {
        setUsers(users.filter((user) => user.id !== e.id));
        Toast.Success("E-mail deletado com sucesso!");
      }
      return response;
    } catch (error) {
      return error;
    }
  };

  const confirmUpdate = async (updateData) => {
    try {
      const response = await service.update(updateData.id, updateData);

      if (response.status === 200) {
        const updatedData = users.map((user) =>
          user.id === updateData.id ? { ...user, ...updateData } : user
        );
        setUsers(updatedData);
        setFilteredUsers(updatedData);
        Toast.Success("E-mail atualizado com sucesso!");
        setIsModalVisibleUpdate(false);
      }
      return response;
    } catch (error) {
      return error;
    }
  };

  const handleChangeFilter = (event) => {
    setFilter((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleUpdate = (user) => {
    setSelectUser(user);
    setIsModalVisibleUpdate(true);
  };

  const handleView = (user) => {
    setSelectUser(user);
    setIsModalVisibleView(true);
  };

  const columns = [
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Senha",
      key: "password",
      dataIndex: "password",
      sorter: (a, b) => a.password - b.password,
      render: (text, record) => <span>{record.password ?? "-"}</span>,
    },
  ];

  return (
    <Table.Root title="Lista de E-mails do Grupo" columnSize={6}>
      <Filter.Fragment section="Filtro">
        <CustomInput.Root columnSize={12}>
          <Filter.FilterInput
            label="Filtrar por E-mail"
            name="emailFilter"
            onChange={(e) => handleEmailFilterChange(e.target.value)}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={12}>
          <Filter.Select
            label="Perfil"
            name="group"
            value={filter.group}
            onChange={handleChangeFilter}
            options={Options.EmailType()}
          />
        </CustomInput.Root>
      </Filter.Fragment>
      <Table.Table
        data={filteredUsers}
        columns={columns}
        onView={handleView}
        onUpdate={handleUpdate}
        confirm={confirmDelete}
      />
      {isModalVisibleView && (
        <Modal
          title="Direcionamentos do E-mail"
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
          {selectUser.Redirects && selectUser.Redirects.length > 0 ? (
            selectUser.Redirects.map((redirect, index) => (
              <CustomModal.Info
                key={index}
                label={`Direcionamento Nº${index + 1}`}
                value={redirect.email}
              />
            ))
          ) : (
            <CustomModal.Info
              label="Direcionamentos"
              value="Nenhum redirecionamento encontrado"
            />
          )}
        </Modal>
      )}
      {isModalVisibleUpdate && (
        <Modal
          title="Editar E-mail"
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
          <Form.Fragment section="Dados do E-mail">
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
                label="Senha"
                type="text"
                name="password"
                value={selectUser.password}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Select
                label="Selecione um Tipo"
                name="type"
                value={selectUser.type}
                onChange={handleChange}
                options={Options.EmailType()}
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
              {selectUser.Redirects.map((redirect, index) => (
                <CustomInput.LongExpanded
                  key={redirect.id}
                  label={`Direcionamento Nº${index + 1}`}
                  value={redirect.email}
                  onChange={(e) =>
                    handleRedirectChange(redirect.id, "email", e.target.value)
                  }
                  onDelete={() => handleDeleteRedirect(redirect.id)}
                />
              ))}
            </div>
          </Form.Fragment>
        </Modal>
      )}
    </Table.Root>
  );
}
