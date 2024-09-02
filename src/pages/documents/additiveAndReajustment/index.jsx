/* eslint-disable no-unused-vars */
import {
  CloseOutlined,
  ControlFilled,
  DownloadOutlined,
  InfoCircleFilled,
  QuestionCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Button, Modal, Popconfirm, Tabs, Tooltip, Upload } from "antd";
import Item from "antd/es/list/Item";
import dayjs from "dayjs";
import { PDFDocument } from "pdf-lib";
import * as React from "react";
import { FaFileUpload } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Loading from "../../../components/animations/Loading";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input";
import { Table } from "../../../components/table";
import { ActionsContainer } from "../../../components/table/styles";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import AdditiveOrReajustmentService from "../../../services/AdditiveOrReajustmentService";
import D4SignService from "../../../services/D4SignService";
import DocumentsService from "../../../services/DocumentsService";
import Utils from "../../../services/Utils";
import {
  ClauseOneAdditive,
  ClauseThreeAdditive,
  ClauseTwoAdditive,
} from "../../../utils/clauses/additiveClauses";
import { Formats } from "../../../utils/formats";
import formatData from "../../../utils/formats/formatData";
import { Options } from "../../../utils/options";
import { Additive } from "../../../utils/pdf/additive";
import { Reajustment } from "../../../utils/pdf/reajustment";

export default function AdditiveAndReajustment() {
  VerifyUserRole(["Master", "Administrador", "Comercial"]);
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [contract, setContract] = React.useState({});
  const [email, setEmail] = React.useState("");
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
    d4sign: null,
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
  const [d4signController, setD4signController] = React.useState(false);
  const [d4SignOpenInfo, setD4SignOpenInfo] = React.useState(false);
  const [d4SignRegisterSignature, setD4SignRegisterSignature] =
    React.useState(false);
  const [signatures, setSignatures] = React.useState([]);
  const [d4SignData, setD4SignData] = React.useState({
    uuidDoc: "",
    nameDoc: "",
    type: "",
    size: "",
    pages: "",
    uuidSafe: "",
    safeName: "",
    statusId: "",
    statusName: "",
    statusComment: "",
    whoCanceled: "null",
  });

  const extenseDate = new Date().getMonth() + 1;
  const contractService = new DocumentsService();
  const d4SignService = new D4SignService();
  const service = new AdditiveOrReajustmentService();
  const utilsService = new Utils();

  const fetchContract = async () => {
    setLoading(true);
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
    setLoading(false);
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

  const handleD4Sign = async (contract) => {
    setLoading(true);

    try {
      setSelectAdditive((prevContract) => ({ ...prevContract, ...contract }));

      const response = await d4SignService.getDocument(contract.d4sign);
      setD4SignData(response.data.contract[0]);

      setD4signController(true);
    } catch (error) {
      console.error("Erro ao buscar documento no D4Sign:", error);
    } finally {
      setLoading(false);
    }
  };

  const verificaCorDoStatus = (status) => {
    if (status === "1") {
      return "#8cff00";
    } else if (status === "2") {
      return "#f6dd00";
    } else if (status === "3") {
      return "#3992ff";
    } else if (status === "4") {
      return "#1eb300";
    }
  };

  const downloadWithUrl = async (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    link.click();
  };

  const handleD4SignViewDocument = async (contract) => {
    setLoading(true);

    try {
      const response = await d4SignService.downloadDocument({
        id_doc: contract.contract.uuidDoc,
      });

      downloadWithUrl(response.data.contract.url).then(() => {
        Toast.Info("Fazendo download do aditivo...");
      });
    } catch (error) {
      console.error("Erro ao buscar documento no D4Sign:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleD4signInfo = async () => {
    setLoading(true);
    try {
      const response = await d4SignService.getSignatures(d4SignData.uuidDoc);
      setSignatures(response.data.contract);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setD4SignOpenInfo(true);
    }
  };

  const deleteDocumentOnD4Sign = async () => {
    return d4SignData.statusName !== "Finalizado"
      ? (setLoading(true),
        await d4SignService
          .cancelDocument({
            id_doc: d4SignData.uuidDoc,
          })
          .then(() => {
            setLoading(false);
            setD4signController(false);
            Toast.Success("Aditivo cancelado com sucesso!");
            window.location.reload();
          }))
      : Toast.Error("Não é possível cancelar um documento finalizado");
  };

  const handleSendD4SignToSign = async () => {
    setLoading(true);
    const data = {
      id_document: d4SignData.uuidDoc,
      message: "Por Favor, Assinar!",
      skip_email: "0",
      workflow: "0",
    };
    d4SignData.statusName !== "Finalizado"
      ? await d4SignService.sendToSignDocument(data).then((res) => {
          const verificaSeJaEnviouEmail = () => {
            if (
              res.data.body.mensagem_pt ===
              "O documento já foi enviado para assinatura."
            ) {
              Toast.Error("O documento já foi enviado para assinatura");
            } else if (
              res.data.body.mensagem_pt === "Documento sem signatários."
            ) {
              Toast.Error("Documento sem signatários cadastrados");
            } else {
              Toast.Success("E-mail enviado com sucesso");
              window.location.reload();
            }
          };
          verificaSeJaEnviouEmail();
        })
      : Toast.Error(
          "Não é possível enviar um e-mail para um documento finalizado"
        );
    setLoading(false);
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleD4SignRegister = async () => {
    setLoading(true);

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
      selectAdditive.additive_Clauses,
      extenseDate
    );

    let mergedBlob;
    let base64D4Sign;   

    if (selectAdditive.propouse?.file.data) {
      const arrayBuffer = selectAdditive.propouse?.file.data;
      const propouseData = new Uint8Array(arrayBuffer);

      try {
        const uploadedPDFDoc = await PDFDocument.load(propouseData);
        const createdPDFDoc = await PDFDocument.load(pdfByte);
        mergedBlob = await mergePDFs(
          uploadedPDFDoc,
          createdPDFDoc,
          selectAdditive,
          "Aditivo"
        );

        const base64 = await blobToBase64(mergedBlob);
        base64D4Sign = base64;
      } catch (error) {
        console.error("Error loading PDFs: ", error);
        return;
      }
    } else {
      try {
        const createdPDFDoc = await PDFDocument.load(pdfByte);
        const mergedPDF = await PDFDocument.create();
        for (const pageNum of createdPDFDoc.getPageIndices()) {
          const [page] = await mergedPDF.copyPages(createdPDFDoc, [pageNum]);
          mergedPDF.addPage(page);
        }
        const mergedPdfBytes = await mergedPDF.save();
        mergedBlob = new Blob([mergedPdfBytes], { type: "application/pdf" });

        const base64 = await blobToBase64(mergedBlob);
        base64D4Sign = base64;
      } catch (error) {
        console.error("Error creating PDF: ", error);
        return;
      }
    }

    const data = {
      name: `Aditivo de ${contract.name} ${formatData(
        new Date().getTime()
      )}`,
      file: base64D4Sign,
      contractId: selectAdditive.id,
    };

    const response = await d4SignService.createAditive(data);

    if (response.status === 200) {
      const updatedData = additiveData.map((contract) =>
        contract.id === selectAdditive.id
          ? { ...contract, ...selectAdditive }
          : contract
      );

      setAdditiveData(updatedData);
      setLoading(false);
      Toast.Success("Aditivo cadastrado com sucesso!");
      window.location.reload();
    }
  };

  const handleD4SignRegisterSign = () => {
    setD4SignRegisterSignature(true);
  };

  const handleInsertSign = async (email) => {
    if (email.length > 0) {
      const documentData = {
        id_document: selectAdditive.d4sign,
        email: email,
        act: "1",
        foreign: "1",
        certificadoicpbr: "0",
        assinatura_presencial: "0",
        docauth: "0",
        docauthandselfie: "0",
        embed_methodauth: "email",
        embed_smsnumber: "",
        upload_allow: "0",
        upload_obs: "0",
      };

      await d4SignService.registerSignOnDocument(documentData).then(() => {
        setEmail("");
        setD4SignRegisterSignature(false);
        Toast.Success("E-mail cadastrado com sucesso");
      });
    } else {
      Toast.Error("Preencha o campo E-mail");
    }
  };

  //-------------------------------------------------------------------------------------------------------

  const cancelDelete = () => {
    return;
  }

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
    console.log("URL", pdfUrl);

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
        await fetchContract();
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
        Toast.Success("Aditivo atualizado com sucesso!");
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

      if(e.d4sign) {
        Toast.Info("Cancele o Aditivo no D4Sign antes!")
        return;
      }
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

  const d4SignOptions = [
    {
      key: "status",
      contract: selectAdditive.d4sign ? d4SignData : "Não cadastrado",
      status: selectAdditive.d4sign ? d4SignData : "Não cadastrado",
      exists: !!selectAdditive.d4sign,
    },
  ];

  const d4SignColumns = [
    {
      title: "Aditivo",
      dataIndex: "contract",
      key: "contract",
      render: (text, row) =>
        row.contract.nameDoc && row.contract.nameDoc.length > 25 ? (
          <Tooltip title={row.contract.nameDoc.toUpperCase()}>
            <p
              style={{
                cursor: "pointer",
                ...(window.innerWidth > 768 ? {} : { fontSize: "0.8rem" }),
              }}
            >
              {row.contract.nameDoc.toUpperCase().substring(0, 25)}...
            </p>
          </Tooltip>
        ) : (
          <p style={{ cursor: "pointer" }}>
            {row.contract.nameDoc ? row.contract.nameDoc.toUpperCase() : ""}
          </p>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, row) => {
        return row.contract.statusName &&
          row.contract.statusName.length > 10 ? (
          <Tooltip title={row.contract.statusName.toUpperCase()}>
            <p
              style={{
                cursor: "pointer",
                backgroundColor: verificaCorDoStatus(row.contract.statusId),
                color: "#ffffff",
                borderRadius: "5px",
                padding: "4px 15px",
                margin: "15px",
                display: "inline-block",
              }}
            >
              {row.contract.statusName.toUpperCase().substring(0, 10)}...
            </p>
          </Tooltip>
        ) : (
          <p
            style={{
              cursor: "pointer",
              backgroundColor: verificaCorDoStatus(row.contract.statusId),
              color: "#ffffff",
              borderRadius: "5px",
              padding: "4px 15px",
              margin: "15px",
              display: "inline-block",
            }}
          >
            {row.contract.statusName
              ? row.contract.statusName.toUpperCase()
              : ""}
          </p>
        );
      },
    },
    {
      title: "Ações",
      key: "actions",
      width: 100,
      render: (text, record) => (
        <ActionsContainer>
          {record.exists && (
            <Button
              title="Controle de Assinatura"
              style={{ backgroundColor: "#7B68EE", color: "#fff" }}
              shape="circle"
              icon={<ControlFilled />}
              onClick={() => handleD4SignRegisterSign(record)}
            />
          )}
          {record.exists && (
            <Button
              title="Enviar para Assinar"
              style={{ backgroundColor: "#FF69B4", color: "#fff" }}
              shape="circle"
              icon={<SendOutlined />}
              onClick={() => handleSendD4SignToSign(record)}
            />
          )}
          {record.exists && (
            <Button
              title="Informações do Documento"
              style={{ backgroundColor: "#808080", color: "#fff" }}
              shape="circle"
              icon={<InfoCircleFilled />}
              onClick={() => handleD4signInfo(record)}
            />
          )}
          {record.exists && (
            <Button
              title="Donwload do Documento"
              style={{ backgroundColor: "#26D0F0", color: "#fff" }}
              shape="circle"
              icon={<DownloadOutlined />}
              onClick={() => handleD4SignViewDocument(record)}
            />
          )}
          {record.exists && (
            <Popconfirm
              title="Tem certeza?"
              description="Você quer cancelar este contrato?"
              onConfirm={() => deleteDocumentOnD4Sign(record)}
              onCancel={() => cancelDelete(record)}
              okText="Sim"
              cancelText="Não"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <Button
                title="Cancelar Documento"
                style={{ backgroundColor: "#c72424", color: "#fff" }}
                shape="circle"
                icon={<CloseOutlined />}
              />
            </Popconfirm>
          )}
          {!record.exists && (
            <Button
              title="Cadastrar Documento"
              style={{ backgroundColor: "#9400D3", color: "#fff" }}
              shape="circle"
              icon={<FaFileUpload />}
              onClick={() => handleD4SignRegister(record)}
            />
          )}
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
      {loading && <Loading />}
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
      {d4signController && (
        <>
          {loading && <Loading />}
          <Modal
            title="Controle de assinaturas"
            open={d4signController}
            centered
            width={"90%"}
            onCancel={() => setD4signController(false)}
            footer={[
              <Button key="back" onClick={() => setD4signController(false)}>
                Voltar
              </Button>,
            ]}
          >
            <Table.TableClean columns={d4SignColumns} data={d4SignOptions} />
          </Modal>
        </>
      )}
      {d4SignOpenInfo && (
        <Modal
          title="Informações do Documento"
          open={d4SignOpenInfo}
          centered
          width={"45%"}
          onCancel={() => setD4SignOpenInfo(false)}
          footer={[
            <Button key="back" onClick={() => setD4SignOpenInfo(false)}>
              Voltar
            </Button>,
          ]}
        >
          <h1>E-mails cadastrados</h1>
          {signatures.map((signatarios, index) =>
            signatarios.list !== null ? (
              signatarios.list.map((signatario, index) => {
                const verificaCor = () => {
                  if (signatario.signed === "0") {
                    return "#c72424";
                  } else if (signatario.signed === "1") {
                    return "#1eb300";
                  }
                };
                const verificaSeJaAssinou = () => {
                  if (signatario.signed === "0") {
                    return (
                      <div>
                        <TiArrowForward
                          style={{
                            marginLeft: "10px",
                          }}
                          cursor={"pointer"}
                          size={20}
                          color={"#05628F"}
                          onClick={async () => {
                            const data = {
                              id_doc: signatarios.uuidDoc,
                              email: signatario.email,
                            };
                            await d4SignService
                              .resendSignature(data)
                              .then(() => {
                                Toast.Success("E-mail reenviado com sucesso");
                              });
                          }}
                        />
                        <MdPersonRemoveAlt1
                          style={{
                            marginLeft: "10px",
                          }}
                          cursor={"pointer"}
                          size={20}
                          color={"#c72424"}
                          onClick={async () => {
                            setLoading(true);
                            const data = {
                              id_doc: signatarios.uuidDoc,
                              id_assinatura: signatario.key_signer,
                              email_assinatura: signatario.email,
                            };
                            await d4SignService
                              .cancelSignature(data)
                              .then(() => {
                                setSignatures([]);
                                Toast.Success("E-mail removido com sucesso");
                                setLoading(false);
                              });
                          }}
                        />
                      </div>
                    );
                  } else if (signatario.signed === "1") {
                    return (
                      <AiOutlineCheck
                        style={{
                          marginLeft: "10px",
                        }}
                        size={20}
                        color={"#1eb300"}
                      />
                    );
                  }
                };

                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                      justifyContent: "space-between",
                    }}
                  >
                    {signatario.email.length > 20 ? (
                      <Tooltip title={signatario.email}>
                        <p
                          style={{
                            color: verificaCor(),
                            cursor: "pointer",
                          }}
                        >
                          {signatario.email.substring(0, 20)}...
                        </p>
                      </Tooltip>
                    ) : (
                      <p
                        style={{
                          color: verificaCor(),
                          cursor: "pointer",
                        }}
                      >
                        {signatario.email}
                      </p>
                    )}
                    {verificaSeJaAssinou()}
                  </div>
                );
              })
            ) : (
              <p key={index}>Nenhum e-mail cadastrado</p>
            )
          )}
        </Modal>
      )}
      {d4SignRegisterSignature && (
        <Modal
          title="Cadastrar E-mail das assinaturas"
          open={d4SignRegisterSignature}
          centered
          width={500}
          onCancel={() => setD4SignRegisterSignature(false)}
          footer={[
            <Button
              key="register"
              style={{
                backgroundColor: "#4168b0",
                color: "white",
              }}
              onClick={() => handleInsertSign(email)}
            >
              Cadastrar
            </Button>,
            <Button
              key="back"
              onClick={() => setD4SignRegisterSignature(false)}
            >
              Voltar
            </Button>,
          ]}
        >
          <CustomInput.Input
            label="E-mail"
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
