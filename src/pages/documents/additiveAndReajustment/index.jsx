/* eslint-disable no-unused-vars */
import { ControlFilled } from "@ant-design/icons";
import { Button, Modal, Tabs, Upload } from "antd";
import Item from "antd/es/list/Item";
import dayjs from "dayjs";
import { PDFDocument } from "pdf-lib";
import * as React from "react";
import { useParams } from "react-router-dom";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input";
import { Table } from "../../../components/table";
import { ActionsContainer } from "../../../components/table/styles";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import AdditiveOrReajustmentService from "../../../services/AdditiveOrReajustmentService";
import DocumentsService from "../../../services/DocumentsService";
import Utils from "../../../services/Utils";
import {
  ClauseOneAdditive,
  ClauseThreeAdditive,
  ClauseTwoAdditive,
} from "../../../utils/clauses/additiveClauses";
import { Formats } from "../../../utils/formats";
import { Options } from "../../../utils/options";
import { Additive } from "../../../utils/pdf/additive";
import { Reajustment } from "../../../utils/pdf/reajustment";

export default function AdditiveAndReajustment() {
  VerifyUserRole(["Master", "Administrador", "Comercial"]);
  const { id } = useParams();
  const [contract, setContract] = React.useState({});
  const [additiveData, setAdditiveData] = React.useState([]);
  const [reajustmentData, setReajustmentData] = React.useState([]);
  const [currentTab, setCurrentTab] = React.useState("aditivos");
  const [selectAdditive, setSelectAdditive] = React.useState({});
  const [selectReajustment, setSelectReajustment] = React.useState({});
  const [additivePropouse, setAdditivePropouse] = React.useState(null);
  const [modalAdditive, setModalAdditive] = React.useState(false);
  const [modalUpdateAdditive, setModalUpdateAdditive] = React.useState(false);
  const [modalUpdateReajustment, setModalUpdateReajustment] =
    React.useState(false);
  const [modalReajustment, setModalReajustment] = React.useState(false);
  const [additive, setAdditive] = React.useState({
    contract_id: id,
    newValue: null,
    oldValue: null,
    clauses: [
      { id: 0, description: `${ClauseOneAdditive()}`, isExpanded: false },
      { id: 1, description: `${ClauseTwoAdditive()}`, isExpanded: false },
      { id: 2, description: `${ClauseThreeAdditive()}`, isExpanded: false },
    ],
  });
  const [reajustment, setReajustment] = React.useState({
    contract_id: id,
    value: null,
    index: null,
    type: "",
  });

  const extenseDate = new Date().getMonth() + 1;
  const contractService = new DocumentsService();
  const service = new AdditiveOrReajustmentService();
  const utilsService = new Utils();

  const fetchContract = async () => {
    const response = await contractService.getByIdAllInfo(id);

    const sortedData = response.data.user.additive.sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );

    const sortedDataReajustment = response.data.user.reajustment.sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );

    const updatedAdditives = sortedData.map((contract) => {
      return {
        ...contract,
        newValue: formatMoney(contract.newValue),
        oldValue: formatMoney(contract.oldValue),
        additive_Clauses: contract.additive_Clauses.map((clause) => ({
          ...clause,
          isExpanded: false,
        })),
      };
    });

    const updatedReajustments = sortedDataReajustment.map((contract) => {
      return {
        ...contract,
        value: formatMoney(contract.valueContract),
        index: contract.index,
        type: contract.type,
      };
    });

    setContract(response.data.user);
    setAdditiveData(updatedAdditives);
    setReajustmentData(updatedReajustments);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchContract()]);
    };
    fetchData();
  }, [id]);

  React.useEffect(() => {
    const Fetch = async () => {
      setAdditive((prevValues) => ({
        ...prevValues,
        clauses: prevValues.clauses.map((clause) =>
          clause.id === 1
            ? {
                ...clause,
                description: ClauseTwoAdditive(
                  additive.oldValue,
                  additive.newValue
                ),
              }
            : clause
        ),
      }));
    };
    Fetch();
  }, [additive.newValue, additive.oldValue]);

  const formatMoney = (value) => {
    if (value === undefined || value === null) return "";

    const formatter = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formatter.format(value);
  };

  const handleD4Sign = () => {
    console.log("D4sign");
  };

  const handleAddClick = () => {
    setAdditive((prevContract) => ({
      ...prevContract,
      clauses: [
        ...prevContract.clauses,
        { id: Date.now(), description: "", isExpanded: false },
      ],
    }));
  };

  const toggleExpandAdditive = (id) => {
    setAdditive((prevContract) => ({
      ...prevContract,
      clauses: prevContract.clauses.map((clause) =>
        clause.id === id
          ? { ...clause, isExpanded: !clause.isExpanded }
          : clause
      ),
    }));
  };

  const toggleExpandAdditiveUpdate = (id) => {
    setSelectAdditive((prevContract) => ({
      ...prevContract,
      additive_Clauses: prevContract.additive_Clauses.map((clause) =>
        clause.id === id
          ? { ...clause, isExpanded: !clause.isExpanded }
          : clause
      ),
    }));
  };

  const handleDeleteClause = (id) => {
    setAdditive((prevContract) => ({
      ...prevContract,
      clauses: prevContract.clauses.filter((clause) => clause.id !== id),
    }));
  };

  const handleDeleteClauseUpdate = (id) => {
    setSelectAdditive((prevContract) => ({
      ...prevContract,
      additive_Clauses: prevContract.additive_Clauses.filter(
        (clause) => clause.id !== id
      ),
    }));
  };

  const handleFileAdditiveChange = (e) => {
    const fileEvent = e.target.files[0];
    if (fileEvent) {
      setAdditivePropouse(fileEvent);
    }
  };

  const handleReajustmentValues = (event) => {
    const { name, value } = event.target;
    setReajustment((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleAdditiveValues = (event) => {
    const { name, value } = event.target;
    setAdditive((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClauseAdditiveChange = (id, newText) => {
    setAdditive((prevValues) => ({
      ...prevValues,
      clauses: prevValues.clauses.map((clause) =>
        clause.id === id ? { ...clause, description: newText } : clause
      ),
    }));
  };

  const handleClauseUpdateAdditiveChange = (id, newText) => {
    setSelectAdditive((prevValues) => ({
      ...prevValues,
      additive_Clauses: prevValues.additive_Clauses.map((clause) =>
        clause.id === id ? { ...clause, description: newText } : clause
      ),
    }));
  };

  const handleFormatAdditiveChange = (eventOrDate) => {
    if (eventOrDate.target) {
      const { name, value } = eventOrDate.target;
      if (name === "oldValue") {
        setAdditive((prevState) => ({
          ...prevState,
          [name]: Formats.Money(value),
        }));
      } else {
        setAdditive((prevState) => ({
          ...prevState,
          [name]: Formats.Money(value),
        }));
      }
    }
  };

  const handleFormatUpdateAdditiveChange = (eventOrDate) => {
    if (eventOrDate.target) {
      const { name, value } = eventOrDate.target;
      if (name === "oldValue") {
        setSelectAdditive((prevState) => ({
          ...prevState,
          [name]: Formats.Money(value),
        }));
      } else {
        setSelectAdditive((prevState) => ({
          ...prevState,
          [name]: Formats.Money(value),
        }));
      }
    }

  };

  const handleFormatReajustmentChange = (eventOrDate) => {
    if (eventOrDate.target) {
      const { name, value } = eventOrDate.target;
      setReajustment((prevState) => ({
        ...prevState,
        [name]: Formats.Money(value),
      }));
    }
  };

  const handleCreateAdditive = async () => {
    const formData = new FormData();
    formData.append("file", additivePropouse);

    const clausesToSend = additive.clauses.map((clause) => ({
      description: clause.description,
    }));

    const dataToSend = {
      ...additive,
      clauses: clausesToSend,
    };

    const response = await service.createAdditive(dataToSend);

    if (additivePropouse && response) {
      formData.append("id", response.data.contract.id);

      await utilsService.uploadAdditivePDF(formData);
      setAdditivePropouse(null);
    }

    if (response.request.status === 500) {
      Toast.Error("Erro ao criar aditivo!");
      setModalAdditive(false);
      return;
    } else {
      Toast.Success("Aditivo criado com sucesso!");
      await fetchContract();
      setModalAdditive(false);
    }
  };

  const mergePDFs = async (uploadedPDFDoc, createdPDFDoc, contract, type) => {
    const mergedPDF = await PDFDocument.create();
    mergedPDF.setTitle(`${type} - ${contract.name} ${contract.contractNumber}`);

    for (const pageNum of createdPDFDoc.getPageIndices()) {
      const [page] = await mergedPDF.copyPages(createdPDFDoc, [pageNum]);
      mergedPDF.addPage(page);
    }

    if (uploadedPDFDoc) {
      for (const pageNum of uploadedPDFDoc.getPageIndices()) {
        const [page] = await mergedPDF.copyPages(uploadedPDFDoc, [pageNum]);
        mergedPDF.addPage(page);
      }
    }

    const mergedPdfBytes = await mergedPDF.save();
    return new Blob([mergedPdfBytes], { type: "application/pdf" });
  };

  const viewReajustment = async (render) => {
    const pdfByte = await Reajustment(
      render.index,
      render.type,
      contract.signOnContract,
      render.value,
      contract.name,
      extenseDate
    );

    let mergedBlob;
    try {
      const createdPDFDoc = await PDFDocument.load(pdfByte);
      const mergedPDF = await PDFDocument.create();
      mergedPDF.setTitle(`Reajuste - ${contract.name}`);
      for (const pageNum of createdPDFDoc.getPageIndices()) {
        const [page] = await mergedPDF.copyPages(createdPDFDoc, [pageNum]);
        mergedPDF.addPage(page);
      }
      const mergedPdfBytes = await mergedPDF.save();
      mergedBlob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    } catch (error) {
      console.error("Error creating PDF: ", error);
      return;
    }

    const pdfUrl = URL.createObjectURL(mergedBlob);
    window.open(pdfUrl, "_blank");
  };

  const viewAdditive = async (render) => {
    const pdfByte = await Additive(
      contract.name,
      contract.cpfcnpj,
      contract.road,
      contract.number,
      contract.complement,
      contract.neighborhood,
      contract.city,
      contract.state,
      contract.signOnContract,
      render.additive_Clauses,
      extenseDate
    );

    let mergedBlob;

    if (render.propouse?.file.data) {
      const arrayBuffer = render.propouse?.file.data;
      const propouseData = new Uint8Array(arrayBuffer);
      try {
        const uploadedPDFDoc = await PDFDocument.load(propouseData);
        const createdPDFDoc = await PDFDocument.load(pdfByte);
        mergedBlob = await mergePDFs(
          uploadedPDFDoc,
          createdPDFDoc,
          contract,
          "Aditivo"
        );
      } catch (error) {
        console.error("Error loading PDFs: ", error);
        return;
      }
    } else {
      try {
        const createdPDFDoc = await PDFDocument.load(pdfByte);
        const mergedPDF = await PDFDocument.create();
        mergedPDF.setTitle(`Aditivo - ${contract.name}`);
        for (const pageNum of createdPDFDoc.getPageIndices()) {
          const [page] = await mergedPDF.copyPages(createdPDFDoc, [pageNum]);
          mergedPDF.addPage(page);
        }
        const mergedPdfBytes = await mergedPDF.save();
        mergedBlob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      } catch (error) {
        console.error("Error creating PDF: ", error);
        return;
      }
    }

    const pdfUrl = URL.createObjectURL(mergedBlob);
    window.open(pdfUrl, "_blank");

    setModalAdditive(false);
  };

  const handleCreateReajustment = async () => {
    try {
      const response = await service.createReajustment(reajustment);

      if (response.status === 201) {
        Toast.Success("Reajuste Criado com sucesso");
        setModalReajustment(false);
      } else {
        Toast.Error("Erro ao criar reajuste");
        setModalReajustment(false);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const handleModalAdditive = () => {
    setModalAdditive(true);
  };

  const handleModalReajustment = () => {
    setModalReajustment(true);
  };

  const handleUpdateAdditive = (additiveData) => {
    setSelectAdditive(additiveData);
    setModalUpdateAdditive(true);
  };

  const handleUpdateReajustment = (reajustmentData) => {
    setSelectReajustment(reajustmentData);
    setModalUpdateReajustment(true);
  };

  const handleUpdateAdditiveToBack = async (updateAdditive) => {
    try {
      const formData = new FormData();
      formData.append("file", additivePropouse);

      const { propouse, ...selectAdditive } = updateAdditive;

      const response = await service.updateAdditive(
        updateAdditive.id,
        selectAdditive
      );

      if (response.status === 200) {
        if (additivePropouse && response) {
          formData.append("id", updateAdditive.id);
          await utilsService.updateAdditivePDF(formData);
          setAdditivePropouse(null);
        }

        await fetchContract();
        Toast.Success("Contrato atualizado com sucesso!");
        setModalUpdateAdditive(false);
      }
      return response;
    } catch (error) {
      Toast.Error(error);
      return error;
    }
  };

  const handleUpdateReajustmentToBack = async (updateReajustmentData) => {
    try {
      const { valueContract, ...selectReajustment } = updateReajustmentData;

      const response = await service.updateReajustment(
        updateReajustmentData.id,
        selectReajustment
      );

      if (response.status === 200) {
        await fetchContract();
        Toast.Success("Reajuste atualizado com sucesso!");
        setModalUpdateReajustment(false);
      }
      return response;
    } catch (error) {
      Toast.Error(error);
      return error;
    }
  };

  const handleUpdateReajustmentValues = (e) => {
    if (e.target.name === "value") {
      const { name, value } = e.target;
      setSelectReajustment((prevState) => ({
        ...prevState,
        [name]: Formats.Money(value),
      }));
    } else {
      const { name, value } = e.target;
      setSelectReajustment((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const confirmDeleteAdditive = async (e) => {
    try {
      const response = await service.deleteAdditive(e.id);

      if (response.status === 200) {
        setAdditiveData(
          additiveData.filter((contract) => contract.id !== e.id)
        );

        Toast.Success("Aditivo deletado com sucesso!");
      }
      return response;
    } catch (error) {
      Toast.Error(error);
      return error;
    }
  };

  const cancelDeleteAdditive = () => {
    return;
  };

  const confirmDeleteReajustment = async (e) => {
    try {
      const response = await service.deleteReajustment(e.id);

      if (response.status === 200) {
        setReajustmentData(
          reajustmentData.filter((contract) => contract.id !== e.id)
        );

        Toast.Success("Reajuste deletado com sucesso!");
      }
      return response;
    } catch (error) {
      Toast.Error(error);
      return error;
    }
  };

  const cancelDeleteReajustment = () => {
    return;
  };

  const columnsAdditive = [
    {
      title: "Data",
      dataIndex: "created",
      key: "created",
      render: (text, row) =>
        row.created ? (
          <p>{dayjs(row.created).format("DD/MM/YYYY")}</p>
        ) : (
          <p>Data não disponível</p>
        ),
    },
    {
      title: "D4Sign",
      key: "d4sign",
      dataIndex: "d4sign",
      render: (text, record) => (
        <span>{record.d4sign ? "Cadastrado" : "Não Cadastrado"}</span>
      ),
    },
    {
      title: "Novo Valor",
      dataIndex: "newValue",
      key: "newValue",
      render: (text, row) =>
        row.newValue ? (
          <p>{`R$ ${row.newValue}`}</p>
        ) : (
          <p>Valor não disponível</p>
        ),
    },
    {
      title: "D4Sign",
      key: "actions",
      width: 150,
      render: (text, record) => (
        <ActionsContainer>
          <Button
            title="Controle D4Sign"
            style={{ backgroundColor: "#836FFF", color: "#fff" }}
            shape="circle"
            icon={<ControlFilled />}
            onClick={() => handleD4Sign(record)}
          />
        </ActionsContainer>
      ),
    },
  ];

  const columnsReajustment = [
    {
      title: "Data",
      dataIndex: "created",
      key: "created",
      render: (text, row) =>
        row.created ? (
          <p>{dayjs(row.created).format("DD/MM/YYYY")}</p>
        ) : (
          <p>Data não disponível</p>
        ),
    },
    {
      title: "Indíce",
      dataIndex: "type",
      key: "type",
      render: (text, row) =>
        row.type ? <p>{`${row.type}`}</p> : <p>Indíce não disponível</p>,
    },
    {
      title: "Porcentagem",
      key: "index",
      dataIndex: "index",
      render: (text, record) => <span>{record.index}%</span>,
    },
  ];

  return (
    <>
      <Table.Root title={`Aditivos e Reajustes de ${contract.name}`}>
        {currentTab === "aditivos" && (
          <Button
            type="primary"
            onClick={() => handleModalAdditive()}
            style={{ marginLeft: "90%" }}
          >
            Criar Aditivo
          </Button>
        )}
        {currentTab === "reajustes" && (
          <Button
            type="primary"
            onClick={() => handleModalReajustment()}
            style={{ marginLeft: "90%" }}
          >
            Criar Reajuste
          </Button>
        )}
        <Tabs activeKey={currentTab} onChange={setCurrentTab}>
          <Item tab="Reajustes" key="reajustes">
            <Table.Table
              data={reajustmentData}
              columns={columnsReajustment}
              onView={viewReajustment}
              onUpdate={handleUpdateReajustment}
              confirm={confirmDeleteReajustment}
              cancel={cancelDeleteReajustment}
            />
          </Item>
          <Item tab="Aditivos" key="aditivos">
            <Table.Table
              data={additiveData}
              columns={columnsAdditive}
              onView={viewAdditive}
              onUpdate={handleUpdateAdditive}
              confirm={confirmDeleteAdditive}
              cancel={cancelDeleteAdditive}
            />
          </Item>
        </Tabs>
      </Table.Root>
      {modalAdditive && (
        <Modal
          title={`Criar Aditivo`}
          open={modalAdditive}
          centered
          width={800}
          onCancel={() => setModalAdditive(false)}
          footer={[
            <Button key="back" onClick={() => setModalAdditive(false)}>
              Voltar
            </Button>,
            <Button key="submit" type="primary" onClick={handleCreateAdditive}>
              Criar
            </Button>,
          ]}
        >
          <Form.Fragment
            section={`Dados do Aditivo - Cliente ${contract.name}`}
          >
            <CustomInput.Root columnSize={12}>
              <CustomInput.Input
                label="Antigo Valor"
                name="oldValue"
                value={additive.oldValue}
                onChange={handleFormatAdditiveChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={12}>
              <CustomInput.Input
                label="Novo Valor"
                name="newValue"
                value={additive.newValue}
                onChange={handleFormatAdditiveChange}
              />
            </CustomInput.Root>
          </Form.Fragment>
          <Form.Fragment section="Clausula Aditivo">
            <div style={{ width: "100%" }}>
              <Button
                variant="contained"
                style={{ marginBottom: "20px" }}
                color="primary"
                onClick={handleAddClick}
              >
                Adicionar Cláusula
              </Button>
              {additive.clauses.map((clause, index) => (
                <CustomInput.LongText
                  key={clause.id}
                  label={`Cláusula Nº${index + 1}`}
                  value={clause.description}
                  isExpanded={clause.isExpanded}
                  onChange={(e) =>
                    handleClauseAdditiveChange(clause.id, e.target.value)
                  }
                  onExpandToggle={() => toggleExpandAdditive(clause.id)}
                  onDelete={() => handleDeleteClause(clause.id)}
                />
              ))}
            </div>
            <Upload
              beforeUpload={(file) => {
                handleFileAdditiveChange({ target: { files: [file] } });
                return false;
              }}
              accept=".pdf"
              maxCount={1}
              showUploadList={false}
            >
              <Button
                title="Anexar Proposta do Aditivo"
                style={{ backgroundColor: "#ed9121", color: "#fff" }}
                shape="default"
              >
                Anexar Proposta do Aditivo
              </Button>
            </Upload>
          </Form.Fragment>
        </Modal>
      )}
      {modalReajustment && (
        <Modal
          title={`Criar Reajuste`}
          open={modalReajustment}
          centered
          width={800}
          onCancel={() => setModalReajustment(false)}
          footer={[
            <Button key="back" onClick={() => setModalReajustment(false)}>
              Voltar
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleCreateReajustment}
            >
              Criar
            </Button>,
          ]}
        >
          <Form.Fragment
            section={`Dados do Reajuste - Cliente ${contract.name}`}
          >
            <CustomInput.Root columnSize={12}>
              <CustomInput.Input
                label="Valor Atual"
                name="value"
                value={reajustment.value}
                onChange={handleFormatReajustmentChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={12}>
              <CustomInput.Input
                label="Porcentagem do Índice"
                name="index"
                value={reajustment.index}
                onChange={handleReajustmentValues}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={12}>
              <CustomInput.Select
                label="Indíce"
                name="type"
                value={reajustment.type}
                onChange={handleReajustmentValues}
                options={Options.IndexContract()}
              />
            </CustomInput.Root>
          </Form.Fragment>
        </Modal>
      )}
      {modalUpdateAdditive && (
        <Modal
          title={`Atualizar Aditivo`}
          open={modalUpdateAdditive}
          centered
          width={800}
          onCancel={() => setModalUpdateAdditive(false)}
          footer={[
            <Button key="back" onClick={() => setModalUpdateAdditive(false)}>
              Voltar
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => handleUpdateAdditiveToBack(selectAdditive)}
            >
              Atualizar
            </Button>,
          ]}
        >
          <Form.Fragment
            section={`Dados do Aditivo - Cliente ${contract.name}`}
          >
            <CustomInput.Root columnSize={12}>
              <CustomInput.Input
                label="Antigo Valor"
                name="oldValue"
                value={selectAdditive.oldValue}
                onChange={handleFormatUpdateAdditiveChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={12}>
              <CustomInput.Input
                label="Novo Valor"
                name="newValue"
                value={selectAdditive.newValue}
                onChange={handleFormatUpdateAdditiveChange}
              />
            </CustomInput.Root>
          </Form.Fragment>
          <Form.Fragment section="Clausula Aditivo">
            <div style={{ width: "100%" }}>
              <Button
                variant="contained"
                style={{ marginBottom: "20px" }}
                color="primary"
                onClick={handleAddClick}
              >
                Adicionar Cláusula
              </Button>
              {selectAdditive.additive_Clauses.map((clause, index) => (
                <CustomInput.LongText
                  key={clause.id}
                  label={`Cláusula Nº${index + 1}`}
                  value={clause.description}
                  isExpanded={clause.isExpanded}
                  onChange={(e) =>
                    handleClauseUpdateAdditiveChange(clause.id, e.target.value)
                  }
                  onExpandToggle={() => toggleExpandAdditiveUpdate(clause.id)}
                  onDelete={() => handleDeleteClauseUpdate(clause.id)}
                />
              ))}
            </div>
            <Upload
              beforeUpload={(file) => {
                handleFileAdditiveChange({ target: { files: [file] } });
                return false;
              }}
              accept=".pdf"
              maxCount={1}
              showUploadList={false}
            >
              <Button
                title="Anexar Proposta do Aditivo"
                style={{ backgroundColor: "#ed9121", color: "#fff" }}
                shape="default"
              >
                Anexar Proposta do Aditivo
              </Button>
            </Upload>
          </Form.Fragment>
        </Modal>
      )}
      {modalUpdateReajustment && (
        <Modal
          title={`Atualizar Reajuste`}
          open={modalUpdateReajustment}
          centered
          width={800}
          onCancel={() => setModalUpdateReajustment(false)}
          footer={[
            <Button key="back" onClick={() => setModalUpdateReajustment(false)}>
              Voltar
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => handleUpdateReajustmentToBack(selectReajustment)}
            >
              Atualizar
            </Button>,
          ]}
        >
          <Form.Fragment
            section={`Dados do Reajuste - Cliente ${contract.name}`}
          >
            <CustomInput.Root columnSize={12}>
              <CustomInput.Input
                label="Valor Atual"
                name="value"
                value={selectReajustment.value}
                onChange={handleUpdateReajustmentValues}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={12}>
              <CustomInput.Input
                label="Porcentagem do Índice"
                type="number"
                name="index"
                value={selectReajustment.index}
                onChange={handleUpdateReajustmentValues}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={12}>
              <CustomInput.Select
                label="Indíce"
                name="type"
                value={selectReajustment.type}
                onChange={handleUpdateReajustmentValues}
                options={Options.IndexContract()}
              />
            </CustomInput.Root>
          </Form.Fragment>
        </Modal>
      )}
    </>
  );
}
