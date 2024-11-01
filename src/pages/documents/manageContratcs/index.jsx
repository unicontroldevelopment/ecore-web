/* eslint-disable no-unused-vars */
import dayjs from "dayjs";
import { debounce } from "lodash";
import { PDFDocument } from "pdf-lib";
import * as React from "react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/animations/Loading";
import ContractTable from "../../../components/manage-contract/ContractTable";
import D4SignControlModal from "../../../components/manage-contract/D4SignControlModal";
import D4SignEmailModal from "../../../components/manage-contract/D4SignEmailModal";
import D4SignInfoModal from "../../../components/manage-contract/D4SignInfoModal";
import EditModalContract from "../../../components/manage-contract/EditModalContract";
import FilterComponent from "../../../components/manage-contract/FilterComponent";
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

//Filtros ----------------------------------------------------------------
const handleGenericChange =
  (setState, formatter = null) =>
  (eventOrDate) => {
    if (eventOrDate.target) {
      const { name, value } = eventOrDate.target;
      setState((prevState) => ({
        ...prevState,
        [name]: formatter ? formatter(name, value) : value,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        date: eventOrDate ? dayjs(eventOrDate) : null,
      }));
    }
  };

const handleFilterChange = (setState) => (event) => {
  const { name, value } = event.target;
  setState((prevState) => ({
    ...prevState,
    [name]: value,
  }));
};

//Funçao ----------------------------------------------------------------
export default function ManageContracts() {
  VerifyUserRole(["Master", "Administrador", "Comercial"]);
  const [allContracts, setAllContracts] = React.useState([]);
  const [contracts, setContracts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [services, setServices] = React.useState([]);
  const [signs, setSigns] = React.useState([]);
  const [selectContract, setSelectContract] = React.useState({
    id: "",
    status: "Contrato",
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
    d4sign: "",
    franchise: "",
    type: "Contrato",
  });
  const [file, setFile] = React.useState();
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = React.useState(false);
  const [d4signController, setD4signController] = React.useState(false);
  const [d4SignOpenInfo, setD4SignOpenInfo] = React.useState(false);
  const [d4SignRegisterSignature, setD4SignRegisterSignature] =
    React.useState(false);
  const [signatures, setSignatures] = React.useState([]);
  const navigate = useNavigate();

  const formatMoney = useCallback((value) => {
    if (value === undefined || value === null) return "";
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }, []);

  //Services API
  const contractService = useMemo(() => new ContractSignService(), []);
  const d4SignService = useMemo(() => new D4SignService(), []);
  const service = useMemo(() => new DocumentsService(), []);
  const utilsService = useMemo(() => new Utils(), []);

  //Fetchs -------------------------------------------------------------------------------------
  const fetchContracts = useCallback(
    async (nameFilter = "", isLoadingControlled = false) => {
      if (isLoadingControlled) setLoading(true);
      try {
        const [contractsResponse, d4SignResponse] = await Promise.all([
          service.getContracts(nameFilter, filter.type),
          d4SignService.getAllContracts(),
        ]);

        const dataContracts = contractsResponse.data.listContracts;
        const d4SignContracts = d4SignResponse.data;

        const d4SignDocsMap = new Map(
          d4SignContracts.map((doc) => [doc.uuidDoc, doc])
        );

        const updatedContracts = dataContracts.map((contract) => {
          const d4SignDoc = d4SignDocsMap.get(contract.d4sign) || null;

          return {
            ...contract,
            value: formatMoney(contract.value),
            d4SignData: d4SignDoc,
            clauses: contract.clauses.map((clause, index) => ({
              ...clause,
              currentId: index,
              isExpanded: false,
            })),
          };
        });
        

        setAllContracts(updatedContracts);
        setContracts(updatedContracts);
      } catch (error) {
        console.error("Erro ao buscar contratos:", error);
      } finally {
        if (isLoadingControlled) setLoading(false);
      }
    },
    [filter.type, formatMoney]
  );

  const fetchServices = useCallback(async () => {
    try {
      const dataServices = await service.getServices();
      setServices(dataServices.data.listServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }, []);

  const fetchSigns = useCallback(async () => {
    try {
      const signService = await contractService.getcontractSigns();
      setSigns(signService.data.listUsers);
    } catch (error) {
      console.error("Error fetching signatures:", error);
    }
  }, []);

  const applyFilters = useCallback((contracts, filters) => {
    return contracts.filter((contract) => {
      const nameMatch = contract.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const franchiseMatch =
        !filters.franchise ||
        contract.signOnContract?.some((signature) =>
          signature.Contract_Signature?.socialReason
            ?.toLowerCase()
            .includes(filters.franchise.toLowerCase())
        );
      let d4signMatch = true;
      if (filters.d4sign === "NÃO CADASTRADO") {
        d4signMatch = !contract.d4SignData;
      } else if (filters.d4sign) {
        d4signMatch =
          contract.d4SignData?.statusName.toLowerCase() ===
          filters.d4sign.toLowerCase();
      }
      return nameMatch && franchiseMatch && d4signMatch;
    });
  }, []);

  const fetchAddress = useCallback(async (cep) => {
    if (cep.length === 9) {
      try {
        const response = await utilsService.findCep(cep);
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
        console.Error("Error fetching address:", error);
        Toast.Error("Erro ao buscar endereço");
      }
    }
  }, [utilsService]);

  const debouncedFetchAddress = useMemo(
    () => debounce(fetchAddress, 300),
    [fetchAddress]
  );

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
    const filteredContracts = applyFilters(allContracts, filter);
    setContracts(filteredContracts);
  }, [filter, allContracts]);

  React.useEffect(() => {
    debouncedFetchAddress(selectContract.cep);
    return () => debouncedFetchAddress.cancel();
  }, [selectContract.cep, debouncedFetchAddress]);

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
  const handleClearFilters = () => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      name: "",
      d4sign: "",
      franchise: "",
    }));
  };

  const handleChange = useCallback(handleGenericChange(setSelectContract), []);

  const handleFormatChange = useCallback(
    handleGenericChange(setSelectContract, (name, value) => {
      switch (name) {
        case "cpfcnpj":
          return Formats.CpfCnpj(value);
        case "value":
          return Formats.Money(value);
        case "cep":
          return Formats.Cep(value);
        default:
          return value;
      }
    }),
    []
  );

  const handleAddClick = () => {
    setSelectContract((prevContract) => ({
      ...prevContract,
      clauses: [
        ...prevContract.clauses,
        { id: Date.now(), description: "", isExpanded: false },
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
    
    setSelectContract((prevValues) => {
      
      const updatedClauses = prevValues.clauses.map((clause) => {
        if (clause.id === id) {
          return { ...clause, description: newText };
        }
        return clause;
      });
      
      return {
        ...prevValues,
        clauses: updatedClauses,
      };
    });
  };

  const handleServiceChange = useCallback(
    (event) => {
      const { value } = event.target;

      setSelectContract((prevState) => {
        const updatedContractsService = (prevState.contracts_Service || [])
          .filter(
            (contractService) =>
              contractService?.Services?.description &&
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
              (cs) => cs.Services?.description === description
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
    },
    [setSelectContract, services]
  );

  const handleSignChange = useCallback(
    (event) => {
      const { value } = event.target;

      setSelectContract((prevState) => {
        const currentTecSocialReason =
          prevState.signOnContract[0]?.Contract_Signature?.socialReason;

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
    },
    [setSelectContract, signs]
  );

  const handleChangeFilter = useCallback(handleFilterChange(setFilter), []);

  //D4Sign -----------------------------------------------------------------------------------------

  const verificaCorDoStatus = (status) => {
    const statusColors = {
      1: "#8cff00",
      2: "#f6dd00",
      3: "#3992ff",
      4: "#1eb300",
    };
    return statusColors[status] || "#000000";
  };

  const withLoading = async (callback) => {
    setLoading(true);
    try {
      await callback();
    } finally {
      setLoading(false);
    }
  };

  const handleD4Sign = async (contract) => {
    await withLoading(async () => {
      setSelectContract((prevContract) => ({ ...prevContract, ...contract }));
      setD4signController(true);
    });
  };

  const downloadWithUrl = async (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    link.click();
    return Promise.resolve();
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
      const response = await d4SignService.getSignatures(
        selectContract.d4SignData.uuidDoc
      );
      setSignatures(response.data.contract);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setD4SignOpenInfo(true);
    }
  };

  const deleteDocumentOnD4Sign = async () => {
    return selectContract.d4SignData.statusName !== "Finalizado"
      ? (setLoading(true),
        await d4SignService
          .cancelDocument({
            id_doc: selectContract.d4SignData.uuidDoc,
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
      id_document: selectContract.d4SignData.uuidDoc,
      message: "Por Favor, Assinar!",
      skip_email: "0",
      workflow: "0",
    };
    selectContract.d4SignData.statusName !== "Finalizado"
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

  const blobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

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

  const registerSign = async (documentData) => {
    await d4SignService.registerSignOnDocument(documentData);
    const updatedD4SignData = await d4SignService.getDocument(
      selectContract.d4sign
    );
    setContracts((prevContracts) =>
      prevContracts.map((contract) =>
        contract.d4sign === selectContract.d4sign
          ? { ...contract, d4SignData: updatedD4SignData.data.contract[0] }
          : contract
      )
    );
    setD4SignRegisterSignature(false);
    Toast.Success("E-mail cadastrado com sucesso");
  };

  const handleInsertSign = async (email) => {
    if (email.length === 0) {
      Toast.Error("Preencha o campo E-mail");
      return;
    }

    const documentData = {
      id_document: selectContract.d4sign,
      email,
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

    await withLoading(async () => {
      await registerSign(documentData);
    });
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

    return requiredFields.every((field) => !!selectContract[field]);
  };

  //Contract -----------------------------------------------------------------------------------------
  const confirmUpdate = async (updateData) => {
    setLoading(true);
    try {
      const emptyField = areRequiredFieldsFilled();

      if (!emptyField) {
        Toast.Info(
          "Preencha todos os campos obrigatórios, somente complemento não é necessário!"
        );
        return;
      }

      const formData = new FormData();
      if (file) formData.append("file", file);

      const { d4SignData, propouse, ...contractData } = updateData;

      const response = await service.updateContract(
        updateData.id,
        contractData
      );

      if (response && file) {
        formData.append("id", updateData.id);
        await utilsService.updatePDF(formData);
        setFile(null);
      }

      if (response) {
        await fetchContracts();
        Toast.Success("Contrato atualizado com sucesso!");
        setIsModalVisibleUpdate(false);
      }

      return response;
    } catch (error) {
      Toast.Error(error.message || "Erro ao atualizar contrato");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async (e) => {
    try {
      if (e.d4sign) {
        Toast.Error("Cancele o contrato no D4Sign antes!");
        return;
      }

      const response = await service.deleteContract(e.id);

      if (response?.status === 200) {
        setContracts((prev) => prev.filter((contract) => contract.id !== e.id));
        Toast.Success("Contrato deletado com sucesso!");
      }

      return response;
    } catch (error) {
      Toast.Error("Erro ao deletar contrato");
    }
  };

  const handleUpdate = (contract) => {
    setLoading(true);

    setSelectContract(contract);
    setLoading(false);
    setIsModalVisibleUpdate(true);
  };

  const handleModalClose = useCallback((e) => {
    e.preventDefault();
    setIsModalVisibleUpdate(false);
    setFile(null);
  }, []);

  //PDFs -----------------------------------------------------------------------------------------
  const handleFileChange = (e) => {
    const fileEvent = e.target.files[0];
    if (!fileEvent) return;

    const allowedTypes = ["application/pdf"];
    const maxSizeMB = 100;

    if (!allowedTypes.includes(fileEvent.type)) {
      Toast.Error("Formato de arquivo inválido! Apenas PDFs são aceitos.");
      return;
    }

    if (fileEvent.size > maxSizeMB * 1024 * 1024) {
      Toast.Error(`O tamanho máximo permitido é ${maxSizeMB}MB.`);
      return;
    }

    setFile(fileEvent);
  };

  const addPagesToPDF = async (sourceDoc, targetPDF) => {
    const pageIndices = sourceDoc.getPageIndices();
    for (const pageNum of pageIndices) {
      const [page] = await targetPDF.copyPages(sourceDoc, [pageNum]);
      targetPDF.addPage(page);
    }
  };

  const mergePDFs = async (uploadedPDFDoc, createdPDFDoc, contract, type) => {
    const mergedPDF = await PDFDocument.create();
    mergedPDF.setTitle(`${type} - ${contract.name} ${contract.contractNumber}`);

    await addPagesToPDF(createdPDFDoc, mergedPDF);

    if (uploadedPDFDoc) {
      await addPagesToPDF(uploadedPDFDoc, mergedPDF);
    }

    const mergedPdfBytes = await mergedPDF.save();
    return new Blob([mergedPdfBytes], { type: "application/pdf" });
  };

  const handleView = async (contract) => {
    try {
      const pdfByte = await MyDocument(contract);
      if (!pdfByte) throw new Error("Falha ao gerar PDF.");

      const contractFile = await service.getById(contract.id);
      const propouseData = contractFile.data.user.propouse?.file.data;

      let mergedBlob;
      if (propouseData) {
        const uploadedPDFDoc = await PDFDocument.load(
          new Uint8Array(propouseData)
        );
        const createdPDFDoc = await PDFDocument.load(pdfByte);
        mergedBlob = await mergePDFs(
          uploadedPDFDoc,
          createdPDFDoc,
          contract,
          "Contrato"
        );
      } else {

        const createdPDFDoc = await PDFDocument.load(pdfByte);
        const mergedPdfBytes = await createdPDFDoc.save(); // Converte para bytes
        mergedBlob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      }

      const pdfUrl = URL.createObjectURL(mergedBlob);
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Erro ao visualizar PDF: ", error.message);
    }
  };

  //Reajuste/Aditivo -----------------------------------------------------------------------------------------
  const handleButtonClick = (contract) => {
    setSelectContract((prevContract) =>
      prevContract.id !== contract.id ? { ...contract } : prevContract
    );
    navigate(`/documents/${contract.id}/additive-reajustments`);
  };

  //Tabelas -----------------------------------------------------------------------------------------

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Gerenciar Contratos
      </h1>
      {loading && <Loading />}
      <FilterComponent
        filter={filter}
        onFilterChange={handleChangeFilter}
        onClearFilters={handleClearFilters}
        signs={signs}
      />
      <ContractTable
        contracts={contracts}
        onView={handleView}
        onUpdate={handleUpdate}
        confirm={confirmDelete}
        cancel={cancelDelete}
        handleD4Sign={handleD4Sign}
        handleButtonClick={handleButtonClick}
        verifycolor={verificaCorDoStatus}
      />
      <EditModalContract
        isVisible={isModalVisibleUpdate}
        onClose={(e) => handleModalClose(e)}
        onUpdate={confirmUpdate}
        contract={selectContract}
        handleChange={handleChange}
        handleFormatChange={handleFormatChange}
        handleSignChange={handleSignChange}
        handleServiceChange={handleServiceChange}
        handleAddClick={handleAddClick}
        handleClauseChange={handleClauseChange}
        toggleExpand={toggleExpand}
        handleDeleteClause={handleDeleteClause}
        handleFileChange={handleFileChange}
        signs={signs}
        services={services}
        Options={Options}
      />
      <D4SignControlModal
        isVisible={d4signController}
        onClose={() => setD4signController(false)}
        contract={selectContract}
        verifyColor={verificaCorDoStatus}
        handleD4SignRegisterSign={handleD4SignRegisterSign}
        handleSendD4SignToSign={handleSendD4SignToSign}
        handleD4signInfo={handleD4signInfo}
        handleD4SignViewDocument={handleD4SignViewDocument}
        deleteDocumentOnD4Sign={deleteDocumentOnD4Sign}
        cancelDelete={cancelDelete}
        handleD4SignRegister={handleD4SignRegister}
      />
      <D4SignInfoModal
        isVisible={d4SignOpenInfo}
        onClose={() => setD4SignOpenInfo(false)}
        signatures={signatures}
        resendSignature={async (uuidDoc, email) => {
          const data = { id_doc: uuidDoc, email };
          await d4SignService.resendSignature(data);
          Toast.Success("E-mail reenviado com sucesso");
        }}
        cancelSignature={async (uuidDoc, key_signer, email) => {
          setLoading(true);
          const data = {
            id_doc: uuidDoc,
            id_assinatura: key_signer,
            email_assinatura: email,
          };
          await d4SignService.cancelSignature(data);
          setSignatures([]);
          Toast.Success("E-mail removido com sucesso");
          setLoading(false);
        }}
      />
      <D4SignEmailModal
        isVisible={d4SignRegisterSignature}
        onClose={() => setD4SignRegisterSignature(false)}
        onRegister={handleInsertSign}
        loading={loading}
      />
    </div>
  );
}
