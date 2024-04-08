import { Button, Modal } from "antd";
import * as React from "react";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input/index";
import { Table } from "../../../components/table";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import DocumentsService from "../../../services/DocumentsService";
import { formatMoney } from "../../../utils/formats/formatMoney";
import { Options } from "../../../utils/options";
import { ViewerPDF } from "../../../utils/pdf/crateContract";

export default function ManageContracts() {
  VerifyUserRole(["Master", "Administrador", "RH"]);
  const [contracts, setContracts] = React.useState([]);
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
    clauses: [],
  });

  const [selectedDescriptions, setSelectedDescriptions] = React.useState([]);
  const [valueMoney, setValueMoney] = React.useState("");
  const [isModalVisibleView, setIsModalVisibleView] = React.useState(false);
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = React.useState(false);

  const service = new DocumentsService();

  React.useEffect(() => {
    const fetchcontracts = async () => {
      try {
        const request = await service.getContracts("");
        const dataContracts = request.data.listContracts;

        const updatedContracts = dataContracts.map((contract) => {
          return {
            ...contract,
            clauses: contract.clauses.map((clause) => ({
              ...clause,
              isExpanded: false,
            })),
          };
        });

        setContracts(updatedContracts);

        const dataServices = await service.getServices();
        const updatedServices = dataServices.data.listUsers.map(
          (service) => service.description
        );

        setServices(updatedServices);
      } catch (error) {
        console.error("Erro ao buscar contratos ou serviços:", error);
      }
    };
    fetchcontracts();
  }, []);

  const descriptionToIdMap = services.reduce((acc, service) => {
    acc[service.description] = service.id;
    return acc;
  }, {});

  function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

  React.useEffect(() => {
    const newSelectedIds = selectedDescriptions.map(
      (desc) => descriptionToIdMap[desc]
    );

    if (!arraysAreEqual(selectUser.servicesContract, newSelectedIds)) {
      setSelectUser((prevValues) => ({
        ...prevValues,
        servicesContract: newSelectedIds,
      }));
    }
  }, [selectedDescriptions]);

  const handleAddClick = () => {
    setSelectUser((prevContract) => ({
      ...prevContract,
      clauses: [
        ...prevContract.clauses,
        { id: Date.now(), text: "", isExpanded: false },
      ],
    }));
  };

  const handleDeleteClause = (id) => {
    setSelectUser((prevUser) => ({
      ...prevUser,
      clauses: prevUser.clauses.filter((clause) => clause.id !== id),
    }));
  };

  const toggleExpand = (id) => {
    setSelectUser((prevUser) => ({
      ...prevUser,
      clauses: prevUser.clauses.map((clause) =>
        clause.id === id
          ? { ...clause, isExpanded: !clause.isExpanded }
          : clause
      ),
    }));
  };

  const handleClauseChange = (id, newText) => {
    setSelectUser((prevValues) => ({
      ...prevValues,
      clauses: prevValues.clauses.map((clause) =>
        clause.id === id ? { ...clause, text: newText } : clause
      ),
    }));
  };

  const removeMask = (maskedValue) => {
    return maskedValue.replace(/[.,]/g, "");
  };

  const handleValueChange = (event) => {
    const { name, value } = event.target;

    const unmaskedValue = removeMask(value);

    setSelectUser((prevState) => ({
      ...prevState,
      [name]: unmaskedValue,
    }));

    setValueMoney(formatMoney(value));
  };

  const handleServiceChange = (selectedDescriptions) => {
    const descriptions = selectedDescriptions.target.value;

    setSelectedDescriptions(descriptions);
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
        setContracts(contracts.filter((user) => user.id !== e.id));

        Toast.Success("Contrato deletado com sucesso!");
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
        const updatedData = contracts.map((user) =>
          user.id === updateData.id ? { ...user, ...updateData } : user
        );

        setContracts(updatedData);
        Toast.Success("Contrato atualizado com sucesso!");

        setIsModalVisibleUpdate(false);
      }

      return response;
    } catch (error) {
      return error;
    }
  };

  const handleUpdate = (user) => {
    setSelectUser((prevUser) => ({ ...prevUser, ...user }));
    setIsModalVisibleUpdate(true);
  };

  const handleView = (user) => {
    setSelectUser((prevUser) => ({ ...prevUser, ...user }));
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
        data={contracts}
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
              options={Options.Companies()}
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
                name="value"
                value={valueMoney}
                onChange={handleValueChange}
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
              value={selectedDescriptions}
              onChange={handleServiceChange}
              multiple={true}
              options={services}
            />
          </Form.Fragment>
          <Form.Fragment section="Clausulas">
            <div style={{ width: "100%" }}>
              <Button
                variant="contained"
                style={{ marginBottom: "20px" }}
                color="primary"
                onClick={handleAddClick}
              >
                Adicionar Cláusula
              </Button>
              {selectUser.clauses.map((clause, index) => (
                <CustomInput.LongText
                  key={clause.id}
                  label={`Cláusula Nº${index + 1}`}
                  value={clause.description}
                  isExpanded={clause.isExpanded}
                  onChange={(e) =>
                    handleClauseChange(clause.id, e.target.value)
                  }
                  onExpandToggle={() => toggleExpand(clause.id)}
                  onDelete={() => handleDeleteClause(clause.id)}
                />
              ))}
            </div>
          </Form.Fragment>
        </Modal>
      )}
    </Table.Root>
  );
}
