import { SendOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import * as React from "react";
import { Filter } from "../../../components/filter";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input/index";
import { Table } from "../../../components/table";
import { ActionsContainer } from "../../../components/table/styles";
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
    contracts_Service: [],
    clauses: [],
  });
  const [filter, setFilter] = React.useState({
    name: "",
  });
  const [valueMoney, setValueMoney] = React.useState("");
  const [isModalVisibleView, setIsModalVisibleView] = React.useState(false);
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = React.useState(false);

  const service = new DocumentsService();

  React.useEffect(() => {
    const fetchcontracts = async () => {
      try {
        const request = await service.getContracts(filter.name);
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

        setServices(dataServices.data.listUsers);
      } catch (error) {
        console.error("Erro ao buscar contratos ou serviços:", error);
      }
    };
    fetchcontracts();
  }, [filter]);

  React.useEffect(() => {
    console.log("Contrato:", selectUser);
  }, [selectUser]);

  const handleChangeFilter = (event) => {
    setFilter((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleAddClick = () => {
    setSelectUser((prevContract) => ({
      ...prevContract,
      clauses: [
        ...prevContract.clauses,
        { id: Date.now(), description: "", isExpanded: false },
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
        clause.id === id ? { ...clause, description: newText } : clause
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

  const handleServiceChange = (event) => {
    const { value } = event.target; // 'value' é o array das descrições dos serviços selecionados
  
    setSelectUser((prevState) => {
      // Filtra os serviços que estão atualmente selecionados
      const updatedContractsService = prevState.contracts_Service
        .filter(contractService =>
          value.includes(contractService.Services.description)
        )
        .map(contractService => ({
          ...contractService,
          service_id: contractService.Services.id, // Mantém o service_id original
          contract_id: prevState.id // Adiciona o contract_id do selectUser
        }));
  
      // Adiciona novos serviços que foram selecionados e ainda não estão na lista
      value.forEach(description => {
        if (!updatedContractsService.some(cs => cs.Services.description === description)) {
          const serviceToAdd = services.find(s => s.description === description);
          if (serviceToAdd) {
            updatedContractsService.push({
              contract_id: prevState.id,
              service_id: serviceToAdd.id,
              Services: { ...serviceToAdd, description: serviceToAdd.description }
            });
          }
        }
      });
  
      // Retorna o estado atualizado
      return {
        ...prevState,
        contracts_Service: updatedContractsService
      };
    });
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
      const clausesToSend = updateData.clauses.map((clause) => ({
        description: clause.text,
      }));

      const dataToSend = {
        ...updateData,
        clauses: clausesToSend,
      };

      const response = await service.updateContract(updateData.id, dataToSend);

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
      Toast.Error(error)
      return error;
    }
  };

  const handleUpdate = (selectedUser) => {

    setSelectUser(selectedUser);
  
    if (selectedUser.value) {
      setValueMoney(formatMoney(selectedUser.value));
    }
  
    setIsModalVisibleUpdate(true);
  };

  const handleView = (user) => {
    setSelectUser((prevUser) => ({ ...prevUser, ...user }));
    setIsModalVisibleView(true);
  };

  const options = [
    {
      title: "Cliente",
      dataIndex: "name",
      key: "name",
    },
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
    {
      title: "Controle Assinatura",
      key: "actions",
      width: 150,
      render: () => (
        <ActionsContainer>
          <Button
            title="Enviar para Assinatura!"
            style={{ backgroundColor: "#3f8ece", color: "#fff" }}
            shape="circle"
            icon={<SendOutlined />}
          />
          <Button
            title="Receber Assinatura!"
            style={{ backgroundColor: "#36db6a", color: "#fff" }}
            shape="circle"
          />
          <Button
            title="Deletar Assinatura"
            style={{ backgroundColor: "#da4444", color: "#fff" }}
            shape="circle"
          />
          <Button
            title="Gerar Aditivo"
            style={{ backgroundColor: "#da4444", color: "#fff" }}
            shape="circle"
          />
        </ActionsContainer>
      ),
    },
  ];

  return (
    <Table.Root title="Lista de Contratos" columnSize={6}>
      <Filter.Fragment section="Filtro">
        <Filter.FilterInput
          label="Nome do Cliente"
          name="name"
          onChange={handleChangeFilter}
          value={filter.name}
        />
      </Filter.Fragment>
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
                name="complement"
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
              name="tecSignature"
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
              <CustomInput.DateInput
                label="Data de Início"
                name="date"
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
                name="index"
                value={selectUser.index}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Select
              label="Serviços"
              name="contracts_Service"
              value={selectUser.contracts_Service.map((service) => service.Services.description)}
              onChange={handleServiceChange}
              multiple={true}
              options={services.map((service) => service.description)}
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
