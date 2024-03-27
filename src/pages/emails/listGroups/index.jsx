import { Button, Modal } from "antd";
import * as React from "react";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input/index";
import { CustomModal } from "../../../components/modal";
import { Table } from "../../../components/table";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import EmailService from "../../../services/EmailService";
import { Options } from "../../../utils/options";

export default function ListGroup() {
  VerifyUserRole(["Master", "Administrador", "RH"]);
  const [users, setUsers] = React.useState([]);
  const [selectUser, setSelectUser] = React.useState({
    email: "",
    password: "",
    type: "",
  });
  const [isModalVisibleView, setIsModalVisibleView] = React.useState(false);
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = React.useState(false);

  const service = new EmailService();

  React.useEffect(() => {
    const fetchUsers = async () => {
      const request = await service.getEmails( "Grupo" );
      setUsers(request.data.listUsers);
    };
    fetchUsers();
  }, []);

  React.useEffect(() => {
    console.log(users);
  }, [users])

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
        Toast.Success("E-mail atualizado com sucesso!");

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
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Senha",
      key: "password",
      dataIndex: "password",
      render: (text, record) => <span>{record.password ?? "-"}</span>,
    },
  ];

  return (
    <Table.Root title="Lista de E-mails do Grupo" columnSize={6}>
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
          title="Direcionametos do E-mail"
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
          <CustomModal.Info label="Direcionamentos" value={"Teste"} />
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
        </Modal>
      )}
    </Table.Root>
  );
}
