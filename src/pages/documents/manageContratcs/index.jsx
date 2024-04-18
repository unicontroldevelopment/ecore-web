import { SendOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import dayjs from "dayjs";
import * as React from "react";
import { Filter } from "../../../components/filter";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input/index";
import { Table } from "../../../components/table";
import { ActionsContainer } from "../../../components/table/styles";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import DocumentsService from "../../../services/DocumentsService";
import { Formats } from "../../../utils/formats";
import { Options } from "../../../utils/options";
import { ViewerPDF } from "../../../utils/pdf/createContract";
import { MyViewerReajustment } from "../../../utils/pdf/readjustment";

export default function ManageContracts() {
  VerifyUserRole(["Master", "Administrador", "RH"]);
  const [contracts, setContracts] = React.useState([]);
  const [services, setServices] = React.useState([]);
  const [showViewer, setShowViewer] = React.useState(false);
  const [reajustment, setReajustment] = React.useState({
    newValue: "",
    newIndex: "",
  });
  const [selectContract, setSelectContract] = React.useState({
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
  const [isModalVisibleReajustment, setIsModalVisibleReajustment] =
    React.useState(false);

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

        setServices(dataServices.data.listServices);
      } catch (error) {
        console.error("Erro ao buscar contratos ou serviços:", error);
      }
    };
    fetchcontracts();
  }, [filter]);

  const handleChangeFilter = (event) => {
    setFilter((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleAddClick = () => {
    setSelectContract((prevContract) => ({
      ...prevContract,
      clauses: [
        ...prevContract.clauses,
        { currentId: Date.now(), description: "", isExpanded: false },
      ],
    }));
  };

  const handleDeleteClause = (id) => {
    setSelectContract((prevContract) => ({
      ...prevContract,
      clauses: prevContract.clauses.filter((clause) => clause.id !== id),
    }));
  };

  const toggleExpand = (id) => {
    setSelectContract((prevContract) => ({
      ...prevContract,
      clauses: prevContract.clauses.map((clause) =>
        clause.id === id
          ? { ...clause, isExpanded: !clause.isExpanded }
          : clause
      ),
    }));
  };

  const handleClauseChange = (id, newText) => {
    setSelectContract((prevValues) => ({
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

    setSelectContract((prevState) => ({
      ...prevState,
      [name]: unmaskedValue,
    }));

    setValueMoney(Formats.Money(value));
  };

  const handleServiceChange = (event) => {
    const { value } = event.target;

    setSelectContract((prevState) => {
      const updatedContractsService = prevState.contracts_Service
        .filter((contractService) =>
          value.includes(contractService.Services.description)
        )
        .map((contractService) => ({
          ...contractService,
          service_id: contractService.Services.id,
          contract_id: prevState.id,
        }));

      value.forEach((description) => {
        if (
          !updatedContractsService.some(
            (cs) => cs.Services.description === description
          )
        ) {
          const serviceToAdd = services.find(
            (s) => s.description === description
          );
          if (serviceToAdd) {
            updatedContractsService.push({
              contract_id: prevState.id,
              service_id: serviceToAdd.id,
              Services: {
                ...serviceToAdd,
                description: serviceToAdd.description,
              },
            });
          }
        }
      });

      return {
        ...prevState,
        contracts_Service: updatedContractsService,
      };
    });
  };

  const handleChange = (eventOrDate) => {
    if (eventOrDate.target) {
      const { name, value } = eventOrDate.target;

      setSelectContract((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setSelectContract((prevState) => ({
        ...prevState,
        date: eventOrDate ? dayjs(eventOrDate) : null,
      }));
    }
  };

  const confirmDelete = async (e) => {
    try {
      const response = await service.delete(e.id);

      if (response.status === 200) {
        setContracts(contracts.filter((contract) => contract.id !== e.id));

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
      const response = await service.updateContract(updateData.id, updateData);

      if (response.status === 200) {
        const updatedData = contracts.map((contract) =>
          contract.id === updateData.id
            ? { ...contract, ...updateData }
            : contract
        );

        setContracts(updatedData);
        Toast.Success("Contrato atualizado com sucesso!");

        setIsModalVisibleUpdate(false);
      }

      return response;
    } catch (error) {
      Toast.Error(error);
      return error;
    }
  };

  const handleUpdate = (contract) => {
    const updatedContractsService = contract.clauses.map((service) => ({
      ...service,
      currentId: service.id,
    }));

    setSelectContract({
      ...contract,
      clauses: updatedContractsService,
    });

    if (contract.value) {
      setValueMoney(Formats.Money(contract.value));
    }

    setIsModalVisibleUpdate(true);
  };

  const handleView = (contract) => {
    setSelectContract((prevContract) => ({ ...prevContract, ...contract }));
    setIsModalVisibleView(true);
  };

  const handleReajustment = (contract) => {
    setSelectContract((prevContract) => ({ ...prevContract, ...contract }));
    console.log(contract);
    setIsModalVisibleReajustment(true);
  };

  const handleReajustmentValues = (event) => {
    const { name, value } = event.target;
    setReajustment((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleButtonClick = () => {
    setShowViewer(true);
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
      render: (text, record) => (
        <ActionsContainer>
          <Button
            title="Enviar para Assinatura!"
            style={{ backgroundColor: "#c8afd5", color: "#fff" }}
            shape="circle"
            icon={<SendOutlined />}
          />
          <Button
            title="Receber Assinatura!"
            style={{ backgroundColor: "#f8c3d7", color: "#fff" }}
            shape="circle"
          />
          <Button
            title="Deletar Assinatura"
            style={{ backgroundColor: "#ff9292", color: "#fff" }}
            shape="circle"
          />
          <Button
            title="Gerar Reajuste"
            onClick={() => handleReajustment(record)}
            style={{ backgroundColor: "#c7dab6", color: "#fff" }}
            shape="circle"
          />
        </ActionsContainer>
      ),
    },
    {
      title: "Aditivo/Reajuste",
      key: "actions",
      width: 150,
      render: (text, record) => (
        <ActionsContainer>
          <Button
            title="Gerar Aditivo"
            style={{ backgroundColor: "#b8daf7", color: "#fff" }}
            shape="circle"
            icon={<SendOutlined />}
          />
          <Button
            title="Gerar Reajuste"
            onClick={() => handleReajustment(record)}
            style={{ backgroundColor: "#f4e59a", color: "#fff" }}
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
      <CustomInput.Upload/>
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
            name={selectContract.name}
            cpfCnpj={selectContract.cpfcnpj}
            cep={selectContract.cep}
            road={selectContract.road}
            number={selectContract.number}
            complement={selectContract.complement}
            neighborhood={selectContract.neighborhood}
            city={selectContract.city}
            state={selectContract.state}
            numberContract={selectContract.numberContract}
            dateContract={selectContract.date}
            valueContract={selectContract.value}
            indexContract={selectContract.index}
            services={selectContract.contracts_Service}
            clauses={selectContract.clauses}
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
              onClick={() => confirmUpdate(selectContract)}
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
                value={selectContract.name}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="CPF ou CNPJ"
                type="text"
                name="cpfCnpj"
                value={selectContract.cpfcnpj}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="CEP"
                type="text"
                name="cep"
                value={selectContract.cep}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Rua"
                type="text"
                name="road"
                value={selectContract.road}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={3}>
              <CustomInput.Input
                label="Número"
                type="text"
                name="number"
                value={selectContract.number}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={3}>
              <CustomInput.Input
                label="Complemento"
                type="text"
                name="complement"
                value={selectContract.complement}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Bairro"
                type="text"
                name="neighborhood"
                value={selectContract.neighborhood}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Cidade"
                type="text"
                name="city"
                value={selectContract.city}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="UF"
                type="text"
                name="state"
                value={selectContract.state}
                onChange={handleChange}
              />
            </CustomInput.Root>
          </Form.Fragment>
          <Form.Fragment section="Contratado">
            <CustomInput.Select
              label="Assinaturas"
              name="tecSignature"
              value={selectContract.tecSignature}
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
                value={selectContract.contractNumber}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.DateInput
                label="Data de Início"
                value={selectContract.date}
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
                value={selectContract.index}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Select
              label="Serviços"
              name="contracts_Service"
              value={selectContract.contracts_Service.map(
                (service) => service.Services.description
              )}
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
              {selectContract.clauses.map((clause, index) => (
                <CustomInput.LongText
                  key={clause.currentId}
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
      {isModalVisibleReajustment && (
        <Modal
          title="Visualizar Documento"
          open={isModalVisibleReajustment}
          centered
          width={1050}
          onCancel={() => setIsModalVisibleReajustment(false)}
          footer={[
            <Button
              key="back"
              onClick={() => setIsModalVisibleReajustment(false)}
            >
              Voltar
            </Button>,
          ]}
        >
          <CustomInput.Input
            label="Novo Valor de Contrato"
            name="newValue"
            value={reajustment.newValue}
            onChange={handleReajustmentValues}
          />
          <CustomInput.Input
            label="Novo Indice"
            name="newIndex"
            value={reajustment.newIndex}
            onChange={handleReajustmentValues}
          />
          <Button
            onClick={handleButtonClick}
            disabled={!reajustment.newValue || !reajustment.newIndex}
          >
            Visualizar
          </Button>

          {showViewer && (
            <MyViewerReajustment
              name={selectContract.name}
              valueContract={selectContract.value}
              newIndex={reajustment.newIndex}
              newValue={reajustment.newValue}
            />
          )}
        </Modal>
      )}
    </Table.Root>
  );
}
