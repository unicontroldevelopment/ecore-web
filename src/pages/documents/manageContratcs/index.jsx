import { SendOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Upload, message } from "antd";
import dayjs from "dayjs";
import { PDFDocument } from "pdf-lib";
import * as React from "react";
import { Filter } from "../../../components/filter";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input/index";
import { Table } from "../../../components/table";
import { ActionsContainer } from "../../../components/table/styles";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import ContractSignService from "../../../services/ContractSignService";
import DocumentsService from "../../../services/DocumentsService";
import { Formats } from "../../../utils/formats";
import { MyDocument } from "../../../utils/pdf/createContract";
import { MyViewerReajustment } from "../../../utils/pdf/readjustment";

export default function ManageContracts() {
  VerifyUserRole(["Master", "Administrador", "RH"]);
  const [contracts, setContracts] = React.useState([]);
  const [services, setServices] = React.useState([]);
  const [signs, setSigns] = React.useState([]);
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
    signOnContract: [],
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
  const [uploadedPDF, setUploadedPDF] = React.useState(null);
  const [mergedPDF, setMergedPDF] = React.useState(null);
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = React.useState(false);
  const [isModalVisibleReajustment, setIsModalVisibleReajustment] =
    React.useState(false);

  const contractService = new ContractSignService();
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
        const signService = await contractService.getcontractSigns();

        setServices(dataServices.data.listServices);
        setSigns(signService.data.listUsers);
      } catch (error) {
        console.error("Erro ao buscar contratos ou serviços:", error);
      }
    };
    fetchcontracts();
  }, [filter]);

  React.useEffect(() => {
    console.log("Contratos", contracts);
  }, [contracts])

  React.useEffect(() => {
    console.log("Sign:", selectContract.tecSignature);
  }, [selectContract.tecSignature])


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

  const handleSignChange = (event) => {
    const { value } = event.target;
  
    setSelectContract((prevState) => {
      // Selecione o único técnico em tecSignature
      const tec = prevState.tecSignature;
  
      if (value.includes("MARCOS PAULO DE MORAIS DE ALMEIDA - IMUNIZADOR")) {
        // Encontra o técnico com base no socialReason selecionado
        const selectedTec = signs.find((sign) => sign.socialReason === "MARCOS PAULO DE MORAIS DE ALMEIDA - IMUNIZADOR");
        // Atualiza o objeto tecSignature com os dados completos do técnico encontrado
        return {
          ...prevState,
          tecSignature: {
            contract_id: prevState.id,
            sign_id: selectedTec.id,
            Contract_Signature: { ...selectedTec }
          }
        };
      }
  
      return prevState;
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

  const mergePDFs = async (uploadedPDFBytes, createdPDFBytes) => {
    const uploadedPDFDoc = uploadedPDFBytes
      ? await PDFDocument.load(uploadedPDFBytes)
      : null;
    const createdPDFDoc = await PDFDocument.load(createdPDFBytes);

    const mergedPDF = await PDFDocument.create();

    if (uploadedPDFDoc) {
      for (const pageNum of uploadedPDFDoc.getPageIndices()) {
        const [page] = await mergedPDF.copyPages(uploadedPDFDoc, [pageNum]);
        mergedPDF.addPage(page);
      }
    }

    for (const pageNum of createdPDFDoc.getPageIndices()) {
      const [page] = await mergedPDF.copyPages(createdPDFDoc, [pageNum]);
      mergedPDF.addPage(page);
    }

    const mergedPdfBytes = await mergedPDF.save();
    return new Blob([mergedPdfBytes], { type: "application/pdf" });
  };

  const handleView = async (contract) => {
    setSelectContract((prevContract) => ({ ...prevContract, ...contract }));
    const pdfByte = await MyDocument(contract);

    let mergedBlob;
    if (uploadedPDF) {
      const uploadedPDFDoc = await PDFDocument.load(uploadedPDF);
      const createdPDFDoc = await PDFDocument.load(pdfByte);
      mergedBlob = await mergePDFs(
        pdfByte,
        uploadedPDF,
        uploadedPDFDoc.getPageCount(),
        createdPDFDoc.getPageCount()
      );
    } else {
      const createdPDFDoc = await PDFDocument.load(pdfByte);

      const mergedPDF = await PDFDocument.create();
      for (const pageNum of createdPDFDoc.getPageIndices()) {
        const [page] = await mergedPDF.copyPages(createdPDFDoc, [pageNum]);
        mergedPDF.addPage(page);
      }

      const mergedPdfBytes = await mergedPDF.save();

      mergedBlob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    }

    const pdfUrl = URL.createObjectURL(mergedBlob);
    window.open(pdfUrl, "_blank");
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

  const handleUpload = async (event) => {
    if (
      !event ||
      !event.target ||
      !event.target.files ||
      event.target.files.length === 0
    ) {
      return;
    }
    const file = event.target.files[0];
    message.success(`Carregado ${event.target.files[0].name}`);
    if (!file) {
      message.error("Erro ao carregar arquivo!");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const bytes = new Uint8Array(e.target.result);
      setUploadedPDF(bytes);
    };
    reader.readAsArrayBuffer(file);
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
            style={{ backgroundColor: "#9400D3", color: "#fff" }}
            shape="circle"
            icon={<SendOutlined />}
          />
          <Button
            title="Receber Assinatura!"
            style={{ backgroundColor: "#FF1493", color: "#fff" }}
            shape="circle"
          />
          <Button
            title="Deletar Assinatura"
            style={{ backgroundColor: "#7B68EE", color: "#fff" }}
            shape="circle"
          />
        </ActionsContainer>
      ),
    },
    {
      title: "Aditivo/Reajuste/Proposta",
      key: "actions",
      width: 150,
      render: (text, record) => (
        <ActionsContainer>
          <Button
            title="Gerar Aditivo"
            style={{ backgroundColor: "#B0E0E6", color: "#fff" }}
            shape="circle"
            icon={<SendOutlined />}
          />
          <Button
            title="Gerar Reajuste"
            onClick={() => handleReajustment(record)}
            style={{ backgroundColor: "#FFFF00", color: "#fff" }}
            shape="circle"
          />
          <Upload
            beforeUpload={(file) => {
              handleUpload({ target: { files: [file] } });
              return false;
            }}
            accept=".pdf"
            maxCount={1}
            showUploadList={false}
          >
            <Button
              title="Anexar Proposta"
              onClick={() => handleUpload(record)}
              style={{ backgroundColor: "#ed9121", color: "#fff" }}
              shape="circle"
              icon={<UploadOutlined />}
            />
          </Upload>
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
              value={selectContract.signOnContract[0].Sign.socialReason}
              options={signs.map((sign) => sign.socialReason)}
              onChange={handleSignChange}
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
