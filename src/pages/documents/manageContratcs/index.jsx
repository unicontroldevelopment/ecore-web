/* eslint-disable no-unused-vars */
import {
  CloseOutlined,
  ControlFilled,
  DownloadOutlined,
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
import { useNavigate } from "react-router-dom";
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
import { Formats } from "../../../utils/formats";
import formatData from "../../../utils/formats/formatData";
import { Options } from "../../../utils/options";
import { MyDocument } from "../../../utils/pdf/createContract";

export default function ManageContracts() {
  VerifyUserRole(["Master", "Administrador", "Comercial"]);
  const [contracts, setContracts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [services, setServices] = React.useState([]);
  const [signs, setSigns] = React.useState([]);
  const [email, setEmail] = React.useState("");
  const [additivePropouse, setAdditivePropouse] = React.useState(null);
  const [selectContract, setSelectContract] = React.useState({
    id: "",
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
    propouse: null,
  });
  const [filter, setFilter] = React.useState({
    name: "",
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
  const [formatCep, setFormatCep] = React.useState("");
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
  const navigate = useNavigate();

  const formatMoney = (value) => {
    if (value === undefined || value === null) return '';
  
    const formatter = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  
    return formatter.format(value);
  };

  //Services API
  const contractService = new ContractSignService();
  const d4SignService = new D4SignService();
  const service = new DocumentsService();
  const utilsService = new Utils();

  //Fetchs -------------------------------------------------------------------------------------
  const fetchContracts = async (
    nameFilter = "",
    isLoadingControlled = false
  ) => {
    if (isLoadingControlled) setLoading(true);
    try {
      const request = await service.getContracts(nameFilter);
      const dataContracts = request.data.listContracts;

      const updatedContracts = dataContracts.map((contract) => {
        return {
          ...contract,
          value: formatMoney(contract.value),
          clauses: contract.clauses.map((clause, index) => ({
            ...clause,
            currentId: index,
            isExpanded: false,
          })),
        };
      });
      setContracts(updatedContracts);
      if (isLoadingControlled) setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar contratos:", error);
      if (isLoadingControlled) setLoading(false);
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

  //Effect -------------------------------------------------------------------------------------------
  React.useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchContracts("", true),
        fetchServices(),
        fetchSigns(),
      ]);
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      await fetchContracts(filter.name);
    };
    fetchData();
  }, [filter.name]);

  React.useEffect(() => {
    const fetchAddress = async () => {
      if (selectContract.cep.length === 9) {
        try {
          const response = await utilsService.findCep(selectContract.cep);
          if (response) {
            setSelectContract((prevValues) => ({
              ...prevValues,
              road: response.data.logradouro,
              neighborhood: response.data.bairro,
              city: response.data.localidade,
              state: response.data.uf,
            }));
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchAddress();
  }, [selectContract.cep]);

  React.useEffect(() => {
    if (selectContract.cep.length !== 9) {
      setSelectContract((prevValues) => ({
        ...prevValues,
        road: "",
        neighborhood: "",
        city: "",
        state: "",
      }));
    }
  }, [selectContract.cep]);

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

  const handleFormatChange = (eventOrDate) => {
    if (eventOrDate.target) {
      const { name, value } = eventOrDate.target;

      if (name === "cpfcnpj") {
        setSelectContract((prevState) => ({
          ...prevState,
          [name]: Formats.CpfCnpj(value),
        }));
      } else if (name === "value") {
        setSelectContract((prevState) => ({
          ...prevState,
          [name]: Formats.Money(value),
        }));
      } else if (name === "cep") {
        setSelectContract((prevState) => ({
          ...prevState,
          [name]: Formats.Cep(value),
        }));
      }
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
        Toast.Info("Fazendo download do contrato...");
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
    setLoading(true);
    const pdfByte = await MyDocument(selectContract);

    let mergedBlob;
    let base64D4Sign;

    const contractFile = await service.getById(selectContract.id);

    if (contractFile.data.user.propouse?.file.data) {
      const arrayBuffer = contractFile.data.user.propouse.file.data;
      const propouseData = new Uint8Array(arrayBuffer);

      try {
        const uploadedPDFDoc = await PDFDocument.load(propouseData);
        const createdPDFDoc = await PDFDocument.load(pdfByte);
        mergedBlob = await mergePDFs(
          uploadedPDFDoc,
          createdPDFDoc,
          selectContract,
          "Contrato"
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
      setLoading(false);
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
      setLoading(true);
      const emptyField = areRequiredFieldsFilled();

      if (!emptyField) {
        Toast.Info(
          "Preencha todos os campos obrigatórios, somente complemento não é necessário!"
        );
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

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
      setLoading(false);
      return response;
    } catch (error) {
      Toast.Error(error);
      setLoading(false);
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
    setLoading(true);
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

    setLoading(false);
    setIsModalVisibleUpdate(true);
  };

  //PDFs -----------------------------------------------------------------------------------------
  const handleFileChange = (e) => {
    const fileEvent = e.target.files[0];
    if (fileEvent) {
      setFile(fileEvent);
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

  const handleView = async (contract) => {
    const pdfByte = await MyDocument(contract);

    if (!pdfByte) {
      console.error("PDF byte array is null or undefined");
      return;
    }

    const contractFile = await service.getById(contract.id);

    let mergedBlob;
    if (contractFile.data.user.propouse?.file.data) {
      const arrayBuffer = contractFile.data.user.propouse.file.data;
      const propouseData = new Uint8Array(arrayBuffer);

      try {
        const uploadedPDFDoc = await PDFDocument.load(propouseData);
        const createdPDFDoc = await PDFDocument.load(pdfByte);
        mergedBlob = await mergePDFs(
          uploadedPDFDoc,
          createdPDFDoc,
          contract,
          "Contrato"
        );
      } catch (error) {
        console.error("Error loading PDFs: ", error);
        return;
      }
    } else {
      try {
        const createdPDFDoc = await PDFDocument.load(pdfByte);
        const mergedPDF = await PDFDocument.create();
        mergedPDF.setTitle(`Contrato - ${contract.name} ${contract.contractNumber}`);
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
  const handleButtonClick = (contract) => {
    setSelectContract((prevContract) => ({ ...prevContract, ...contract }));
    navigate(`/documents/${contract.id}/additive-reajustments`);
  };

  const handleCreate = (record) => {
    setCurrentType(record.type);
    setIsModalVisibleCreate(true);
  };

  //Tabelas -----------------------------------------------------------------------------------------
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
      description: selectContract.reajustment
        ? `Valor: ${selectContract.name}`
        : "Nenhum reajuste",
      exists: !!selectContract.reajustment,
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
      <Table.Root title="Lista de Contratos">
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
                  name="cpfcnpj"
                  value={selectContract.cpfcnpj}
                  onChange={handleFormatChange}
                />
              </CustomInput.Root>
              <CustomInput.Root columnSize={6}>
                <CustomInput.Input
                  label="CEP"
                  type="text"
                  name="cep"
                  value={selectContract.cep}
                  onChange={handleFormatChange}
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
                  value={selectContract.value}
                  onChange={handleFormatChange}
                />
              </CustomInput.Root>
              <CustomInput.Root columnSize={6}>
                <CustomInput.Select
                  label="Índice"
                  type="text"
                  name="index"
                  value={selectContract.index}
                  onChange={handleChange}
                  options={Options.IndexContract()}
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
      </Table.Root>
    </>
  );
}
