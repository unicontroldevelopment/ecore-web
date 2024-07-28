/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  CloseOutlined,
  ControlFilled,
  EllipsisOutlined,
  InfoCircleFilled,
  QuestionCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Tooltip } from "@mui/material";
import { Button, Modal, Popconfirm, Upload } from "antd";
import dayjs from "dayjs";
import { PDFDocument } from "pdf-lib";
import * as React from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { FaFileUpload } from "react-icons/fa";
import { MdPersonRemoveAlt1 } from "react-icons/md";
import { TiArrowForward } from "react-icons/ti";
import Loading from "../../../components/animations/Loading";
import { Filter } from "../../../components/filter";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input/index";
import { Table } from "../../../components/table";
import { ActionsContainer } from "../../../components/table/styles";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import ContractSignService from "../../../services/ContractSignService";
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
import { Additive } from "../../../utils/pdf/additive";
import { MyDocument } from "../../../utils/pdf/createContract";

export default function ManageContracts() {
  VerifyUserRole(["Master", "Administrador", "Comercial"]);
  const [contracts, setContracts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [services, setServices] = React.useState([]);
  const [signs, setSigns] = React.useState([]);
  const [email, setEmail] = React.useState("");
  const [showOptions, setShowOptions] = React.useState(false);
  const [reajustment, setReajustment] = React.useState({
    newValue: "",
    newIndex: "",
  });
  const [selectContract, setSelectContract] = React.useState({
    status: "",
    d4sign: "",
    name: "",
    cpfcnpj: "",
    cep: "",
    road: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    contractNumber: "",
    date: "",
    value: "",
    index: "",
    signOnContract: [],
    contracts_Service: [],
    clauses: [],
  });
  const [filter, setFilter] = React.useState({
    name: "",
  });
  const [additive, setAdditive] = React.useState({
    contract_id: null,
    newValue: null,
    oldValue: null,
    clauses: [
      { id: 0, description: `${ClauseOneAdditive()}`, isExpanded: false },
      { id: 1, description: `${ClauseTwoAdditive()}`, isExpanded: false },
      { id: 2, description: `${ClauseThreeAdditive()}`, isExpanded: false },
    ],
  });
  const [file, setFile] = React.useState();
  const [valueMoney, setValueMoney] = React.useState("");
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = React.useState(false);
  const [isModalVisibleReajustment, setIsModalVisibleReajustment] =
    React.useState(false);
  const [isModalVisibleadditive, setIsModalVisibleAdditive] =
    React.useState(false);
  const [d4signController, setD4signController] = React.useState(false);
  const [isModalVisibleCreate, setIsModalVisibleCreate] = React.useState(false);
  const [currentType, setCurrentType] = React.useState("");
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

  //Services API
  const contractService = new ContractSignService();
  const d4SignService = new D4SignService();
  const service = new DocumentsService();
  const utilsService = new Utils();

  //Fetchs -------------------------------------------------------------------------------------
  const fetchContracts = async () => {
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
    } catch (error) {
      console.error("Erro ao buscar contratos:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const dataServices = await service.getServices();
      setServices(dataServices.data.listServices);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    }
  };

  const fetchSigns = async () => {
    try {
      const signService = await contractService.getcontractSigns();
      setSigns(signService.data.listUsers);
    } catch (error) {
      console.error("Erro ao buscar assinaturas:", error);
    }
  };

  //Effect

  React.useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchContracts(), fetchServices(), fetchSigns()]);
    };
    fetchData();
  }, [filter]);

  React.useEffect(() => {
    const Fetch = async () => {
      setAdditive((prevValues) => ({
        ...prevValues,
        clauses: prevValues.clauses.map((clause) =>
          clause.id === 1
            ? { ...clause, description: ClauseTwoAdditive(additive.oldValue, additive.newValue) }
            : clause
        ),
      }));
    };
    Fetch();
  }, [additive.newValue, additive.oldValue]);

  //Changes -----------------------------------------------------------------------------------------
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
      const currentTecSocialReason =
        prevState.signOnContract[0].Contract_Signature.socialReason;

      if (value !== currentTecSocialReason) {
        const selectedTec = signs.find((sign) => sign.socialReason === value);
        return {
          ...prevState,
          signOnContract: [
            {
              contract_id: prevState.id,
              sign_id: selectedTec.id,
              Contract_Signature: { ...selectedTec },
            },
          ],
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

  //D4Sign -----------------------------------------------------------------------------------------

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

  const handleD4Sign = async (contract) => {
    setLoading(true);

    try {
      setSelectContract((prevContract) => ({ ...prevContract, ...contract }));

      const response = await d4SignService.getDocument(contract.d4sign);
      setD4SignData(response.data.contract[0]);

      setD4signController(true);
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
            Toast.Success("Contrato cancelado com sucesso!");
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
    const pdfByte = await MyDocument(selectContract);

    let mergedBlob;
    let base64D4Sign;

    if (selectContract.propouse.file?.data) {
      const arrayBuffer = selectContract.propouse.file.data;
      const propouseData = new Uint8Array(arrayBuffer);

      try {
        const uploadedPDFDoc = await PDFDocument.load(propouseData);
        const createdPDFDoc = await PDFDocument.load(pdfByte);
        mergedBlob = await mergePDFs(uploadedPDFDoc, createdPDFDoc);

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
      name: `Contrato ${selectContract.contractNumber} ${
        selectContract.name
      } ${formatData(new Date().getTime())}`,
      file: base64D4Sign,
      contractId: selectContract.id,
    };

    const response = await d4SignService.createDocument(data);

    if (response.status === 200) {
      const updatedData = contracts.map((contract) =>
        contract.id === selectContract.id
          ? { ...contract, ...selectContract }
          : contract
      );

      setContracts(updatedData);
      Toast.Success("Contrato cadastrado com sucesso!");
      window.location.reload();
    }
  };

  const handleD4SignRegisterSign = () => {
    setD4SignRegisterSignature(true);
  };

  const handleInsertSign = async (email) => {
    if (email.length > 0) {
      const documentData = {
        id_document: selectContract.d4sign,
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
        window.location.reload();
      });
    } else {
      Toast.Error("Preencha o campo E-mail");
    }
  };

  const cancelDelete = () => {
    return;
  };

  const areRequiredFieldsFilled = () => {
    const requiredFields = [
      "name",
      "cpfcnpj",
      "cep",
      "road",
      "number",
      "neighborhood",
      "city",
      "state",
      "contractNumber",
      "date",
      "value",
      "index",
      "contracts_Service",
      "signOnContract",
    ];
    let isAllFieldsFilled = true;

    for (const field of requiredFields) {
      if (!selectContract[field]) {
        isAllFieldsFilled = false;
      }
    }

    return isAllFieldsFilled;
  };

  //Contract -----------------------------------------------------------------------------------------
  const confirmUpdate = async (updateData) => {
    try {
      const emptyField = areRequiredFieldsFilled();

      if (!emptyField) {
        Toast.Info(
          "Preencha todos os campos obrigatórios, somente complemento não é necessário!"
        );
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const numericNumber = Number(updateData.number);
      const numericContractNumber = Number(updateData.contractNumber);

      if (!isNaN(numericNumber) && !isNaN(numericContractNumber)) {
        updateData.number = numericNumber;
        updateData.contractNumber = numericContractNumber;

        const { propouse, ...contractData } = updateData;

        const response = await service.updateContract(
          updateData.id,
          contractData
        );

        if (response.status === 200) {
          if (file && response) {
            formData.append("id", updateData.id);
            await utilsService.updatePDF(formData);
            setFile(null);
          }

          await fetchContracts();
          Toast.Success("Contrato atualizado com sucesso!");
          setIsModalVisibleUpdate(false);
        }

        return response;
      } else {
        Toast.Error("Valores do numéro da rua ou index não são válidos!");
        return;
      }
    } catch (error) {
      Toast.Error(error);
      return error;
    }
  };

  const confirmDelete = async (e) => {
    try {
      if (e.d4sign) {
        Toast.Error("Cancele o contrato no D4Sign antes!");
        return;
      }

      const response = await service.deleteContract(e.id);

      if (response.status === 200) {
        setContracts(contracts.filter((contract) => contract.id !== e.id));

        Toast.Success("Contrato deletado com sucesso!");
      }
      return response;
    } catch (error) {
      Toast.Error("Erro ao deletar contrato");
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

  //PDFs -----------------------------------------------------------------------------------------
  const handleFileChange = (e) => {
    const fileEvent = e.target.files[0];
    if (fileEvent) {
      setFile(fileEvent);
    }
  };

  const mergePDFs = async (uploadedPDFDoc, createdPDFDoc) => {
    const mergedPDF = await PDFDocument.create();

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

  const handleView = async (contract) => {
    const pdfByte = await MyDocument(contract);

    if (!pdfByte) {
      console.error("PDF byte array is null or undefined");
      return;
    }

    let mergedBlob;

    if (contract.propouse.file?.data) {
      const arrayBuffer = contract.propouse.file.data;
      const propouseData = new Uint8Array(arrayBuffer);

      try {
        const uploadedPDFDoc = await PDFDocument.load(propouseData);
        const createdPDFDoc = await PDFDocument.load(pdfByte);
        mergedBlob = await mergePDFs(uploadedPDFDoc, createdPDFDoc);
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
      } catch (error) {
        console.error("Error creating PDF: ", error);
        return;
      }
    }

    const pdfUrl = URL.createObjectURL(mergedBlob);
    window.open(pdfUrl, "_blank");
  };

  //Reajuste/Aditivo -----------------------------------------------------------------------------------------
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

  const handleButtonClick = (contract) => {
    setSelectContract((prevContract) => ({ ...prevContract, ...contract }));
    setShowOptions(true);
  };

  const handleCreate = (record) => {
    setCurrentType(record.type);
    setIsModalVisibleCreate(true);
  };

  const handleCreateAdditive = async () => {
    const pdfByte = await Additive(
      selectContract.name,
      selectContract.cpfcnpj,
      selectContract.road,
      selectContract.number,
      selectContract.complement,
      selectContract.neighborhood,
      selectContract.city,
      selectContract.state,
      selectContract.signOnContract,
      additive.clauses,
      extenseDate,
      selectContract.signOnContract
    );

    const createdPDFDoc = await PDFDocument.load(pdfByte);
    const mergedPDF = await PDFDocument.create();
    for (const pageNum of createdPDFDoc.getPageIndices()) {
      const [page] = await mergedPDF.copyPages(createdPDFDoc, [pageNum]);
      mergedPDF.addPage(page);
    }
    const mergedPdfBytes = await mergedPDF.save();
    const pdfAdditive = new Blob([mergedPdfBytes], { type: "application/pdf" });

    const pdfUrl = URL.createObjectURL(pdfAdditive);
    window.open(pdfUrl, "_blank");

    setIsModalVisibleAdditive(false);
    setIsModalVisibleCreate(false);
  };

  const handleCreateReajustment = () => {
    console.log("Criar Reajuste");
    setIsModalVisibleReajustment(false);
    setIsModalVisibleCreate(false);
  };

  //Tabelas -----------------------------------------------------------------------------------------
  const columns = [
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ações",
      key: "actions",
      render: (text, record) => (
        <ActionsContainer>
          {record.exists && <Button>Editar</Button>}
          {record.exists && <Button>Visualizar</Button>}
          {!record.exists && (
            <Button onClick={() => handleCreate(record)}>Criar</Button>
          )}
        </ActionsContainer>
      ),
    },
  ];

  const d4SignColumns = [
    {
      title: "Contrato",
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
      title: "D4Sign",
      key: "d4sign",
      dataIndex: "d4sign",
      render: (text, record) => (
        <span>{record.d4sign ? "Cadastrado" : "Não Cadastrado"}</span>
      ),
    },
    {
      title: "D4Sign/Opções",
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
          <Button
            title="Aditivo/Reajuste"
            style={{ backgroundColor: "#FF7F50", color: "#fff" }}
            shape="circle"
            onClick={() => handleButtonClick(record)}
            icon={<EllipsisOutlined />}
          />
        </ActionsContainer>
      ),
    },
  ];

  const optionsData = [
    {
      key: "name",
      type: "Aditivo",
      description: selectContract.additive
        ? selectContract.name
        : "Nenhum aditivo",
      exists: !!selectContract.additive,
    },
    {
      key: "city",
      type: "Reajuste",
      description: selectContract.name
        ? `Valor: ${selectContract.name}`
        : "Nenhum reajuste",
      exists: !!selectContract.name,
    },
  ];

  const d4SignOptions = [
    {
      key: "status",
      contract: selectContract.d4sign ? d4SignData : "Não cadastrado",
      status: selectContract.d4sign ? d4SignData : "Não cadastrado",
      exists: !!selectContract.d4sign,
    },
  ];

  return (
    <>
      {loading && <Loading />}
      <Table.Root title="Lista de Contratos" columnSize={6}>
        <CustomInput.Root columnSize={24}>
          <Filter.FilterInput
            label="Nome do Cliente"
            name="name"
            onChange={handleChangeFilter}
            value={filter.name}
          />
        </CustomInput.Root>
        <Filter.Fragment section="Filtro"></Filter.Fragment>
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
            onCancel={() => {
              setIsModalVisibleUpdate(false);
              setFile(null);
            }}
            width={1200}
            footer={[
              <Button
                key="submit"
                type="primary"
                onClick={() => confirmUpdate(selectContract)}
              >
                Atualizar
              </Button>,
              <Button
                key="back"
                onClick={() => {
                  setIsModalVisibleUpdate(false);
                  setFile(null);
                }}
              >
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
                  type="number"
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
                name="signOnContract"
                value={
                  selectContract.signOnContract[0].Contract_Signature
                    .socialReason
                }
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
                  type="number"
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
              <Upload
                beforeUpload={(file) => {
                  handleFileChange({ target: { files: [file] } });
                  return false;
                }}
                accept=".pdf"
                maxCount={1}
                showUploadList={false}
              >
                <Button
                  title="Anexar Proposta"
                  style={{ backgroundColor: "#ed9121", color: "#fff" }}
                  shape="default"
                >
                  Anexar Proposta
                </Button>
              </Upload>
            </Form.Fragment>
          </Modal>
        )}
        {showOptions && (
          <Modal
            title="Outras opções do contrato"
            open={showOptions}
            centered
            width={1500}
            onCancel={() => setShowOptions(false)}
            footer={[
              <Button key="back" onClick={() => setShowOptions(false)}>
                Voltar
              </Button>,
            ]}
          >
            <h1>Em Construção</h1>
            <Table.TableClean columns={columns} data={optionsData} />
          </Modal>
        )}
        {d4signController && (
          <>
            {loading && <Loading />}
            <Modal
              title="Controle de assinaturas"
              open={d4signController}
              centered
              width={1500}
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
            width={800}
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
                                  setD4SignOpenInfo(false);
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
                                  setD4SignOpenInfo(false);
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

        {isModalVisibleCreate && (
          <Modal
            title={`Criar ${currentType}`}
            open={isModalVisibleCreate}
            centered
            width={800}
            onCancel={() => setIsModalVisibleCreate(false)}
            footer={[
              <Button key="back" onClick={() => setIsModalVisibleCreate(false)}>
                Voltar
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={
                  currentType === "Aditivo"
                    ? handleCreateAdditive
                    : handleCreateReajustment
                }
              >
                Criar
              </Button>,
            ]}
          >
            {currentType === "Aditivo" ? (
              <>
                <Form.Fragment section="Dados do Aditivo">
                  <CustomInput.Root columnSize={12}>
                    <CustomInput.Input
                      label="Antigo Valor"
                      name="oldValue"
                      value={additive.oldValue}
                      onChange={handleAdditiveValues}
                    />
                  </CustomInput.Root>
                  <CustomInput.Root columnSize={12}>
                    <CustomInput.Input
                      label="Novo Valor"
                      name="newValue"
                      value={additive.newValue}
                      onChange={handleAdditiveValues}
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
                          handleClauseChange(clause.id, e.target.value)
                        }
                        onExpandToggle={() => toggleExpandAdditive(clause.id)}
                        onDelete={() => handleDeleteClause(clause.id)}
                      />
                    ))}
                  </div>
                </Form.Fragment>
              </>
            ) : (
              <>
                <CustomInput.Input
                  label="Novo Valor de Contrato"
                  name="newValue"
                  type="number"
                  value={reajustment.newValue}
                  onChange={handleReajustmentValues}
                />
                <CustomInput.Input
                  label="Novo Indice"
                  name="newIndex"
                  type="number"
                  value={reajustment.newIndex}
                  onChange={handleReajustmentValues}
                />
              </>
            )}
          </Modal>
        )}
      </Table.Root>
    </>
  );
}
