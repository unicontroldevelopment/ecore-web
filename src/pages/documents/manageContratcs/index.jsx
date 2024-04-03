import { Button, Modal } from "antd";
import * as React from "react";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input/index";
import { Table } from "../../../components/table";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import DocumentsService from "../../../services/DocumentsService";
import { ViewerPDF } from "../../../utils/pdf/crateContract";

export default function ManageContracts() {
  VerifyUserRole(["Master", "Administrador", "RH"]);
  const [users, setUsers] = React.useState([]);
  const [services, setServices] = React.useState([]);
  const [selectUser, setSelectUser] = React.useState({
    status: "",
    name: "",
    cpfcnpj: "",
    cep: "",
    road: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    tecSignature: "",
    contractNumber: "",
    date: "",
    value: "",
    index: "",
    servicesContract: [],
  });

  const [isModalVisibleView, setIsModalVisibleView] = React.useState(false);
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = React.useState(false);

  const service = new DocumentsService();

  React.useEffect(() => {
    const fetchUsers = async () => {
      const request = await service.getContracts("");
      setUsers(request.data.listContracts);
      console.log(request.data.listContracts);

      const dataServices = await service.getServices();

      setServices(() => {
        const updatedServices = dataServices.data.listUsers.map(
          (service) => service.description
        );
        return updatedServices;
      });
    };
    fetchUsers();
  }, []);

  const [textFields, setTextFields] = React.useState([]);

  const handleAddClick = () => {
      setTextFields(prevFields => [...prevFields, { id: Date.now(), isExpanded: false }]);
  };

  const toggleExpand = (id) => {
      setTextFields(prevFields => 
          prevFields.map(field => 
              field.id === id ? { ...field, isExpanded: !field.isExpanded } : field
          )
      );
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
        Toast.Success("Contrato atualizado com sucesso!");

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
      title: "Nº Contrato",
      dataIndex: "contractNumber",
      key: "contractNumber",
    },
    {
      title: "Status",
      key: "staus",
      dataIndex: "status",
      render: (text, record) => <span>{record.status ?? "-"}</span>,
    },
  ];

  return (
    <Table.Root title="Lista de Contratos" columnSize={6}>
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
          title="Visualizar Documento"
          open={isModalVisibleView}
          centered
          width={1050}
          onCancel={() => setIsModalVisibleView(false)}
          footer={[
            <Button key="back" onClick={() => setIsModalVisibleView(false)}>
              Voltar
            </Button>,
          ]}
        >
          <ViewerPDF
            name={selectUser.name}
            cpfCnpj={selectUser.cpfcnpj}
            cep={selectUser.cep}
            road={selectUser.road}
            number={selectUser.number}
            complement={selectUser.complement}
            neighborhood={selectUser.neighborhood}
            city={selectUser.city}
            state={selectUser.state}
            numberContract={selectUser.numberContract}
            dateContract={selectUser.date}
            valueContract={selectUser.value}
            indexContract={selectUser.index}
          />
        </Modal>
      )}
      {isModalVisibleUpdate && (
        <Modal
          title="Editar Contrato"
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
          <Form.Fragment section="Contratante">
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Nome"
                type="text"
                name="name"
                value={selectUser.name}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="CPF ou CNPJ"
                type="text"
                name="cpfCnpj"
                value={selectUser.cpfcnpj}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="CEP"
                type="text"
                name="cep"
                value={selectUser.cep}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Rua"
                type="text"
                name="road"
                value={selectUser.road}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={3}>
              <CustomInput.Input
                label="Número"
                type="text"
                name="number"
                value={selectUser.number}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={3}>
              <CustomInput.Input
                label="Complemento"
                type="text"
                name="neighborhood"
                value={selectUser.complement}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Bairro"
                type="text"
                name="neighborhood"
                value={selectUser.neighborhood}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Cidade"
                type="text"
                name="city"
                value={selectUser.city}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="UF"
                type="text"
                name="state"
                value={selectUser.state}
                onChange={handleChange}
              />
            </CustomInput.Root>
          </Form.Fragment>
          <Form.Fragment section="Contratado">
            <CustomInput.Select
              label="Assinaturas"
              name="servicesContract"
              value={selectUser.tecSignature}
              options={["Augusto", "Leandro"]}
              onChange={handleChange}
            />
          </Form.Fragment>
          <Form.Fragment section="Contrato">
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Número"
                type="text"
                name="contractNumber"
                value={selectUser.contractNumber}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Data de Início"
                type="text"
                name="dateContract"
                value={selectUser.date}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Valor"
                type="text"
                name="valueContract"
                value={selectUser.value}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Índice"
                type="text"
                name="indexContract"
                value={selectUser.index}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Select
          label="Serviços"
          name="servicesContract"
          value={services}
          onChange={handleChange}
          multiple={true}
          options={services}
        />
          </Form.Fragment>
          <Form.Fragment section="Clausulas">
          <CustomInput.LongText label="Clausulá Nº1"
            />
            <CustomInput.LongText
            />
            <CustomInput.LongText
            />
            <CustomInput.LongText
            />
          </Form.Fragment>
          <div>
            <Button variant="contained" color="primary" onClick={handleAddClick}>
                Adicionar Campo de Texto
            </Button>

            {textFields.map(field => (
                <CustomInput.LongText
                    key={field.id}
                    isExpanded={field.isExpanded}
                    onExpandToggle={() => toggleExpand(field.id)}
                />
            ))}
        </div>
        </Modal>
      )}
    </Table.Root>
  );
}
