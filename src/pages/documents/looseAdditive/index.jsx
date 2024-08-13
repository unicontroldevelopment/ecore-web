import { Button, Upload } from "antd";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { PDFDocument } from "pdf-lib";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import ContractSignService from "../../../services/ContractSignService";
import Utils from "../../../services/Utils";
import {
  ClauseOneAdditive,
  ClauseThreeAdditive,
  ClauseTwoAdditive,
} from "../../../utils/clauses/additiveClauses";
import { Formats } from "../../../utils/formats";
import { Options } from "../../../utils/options";
import { LooseAdditivePDF } from "../../../utils/pdf/looseAdditive";
import { LooseReajustmentPDF } from "../../../utils/pdf/looseReajustment";

export default function LooseAdditive() {
  VerifyUserRole(["Master", "Administrador", "Comercial"]);
  const navigate = useNavigate();
  const contractSignService = new ContractSignService();
  const utilsService = new Utils();
  const [services, setServices] = React.useState([]);
  const [signs, setSigns] = React.useState([]);
  const [values, setValues] = React.useState({
    name: "",
    cpfcnpj: "",
    cep: "",
    road: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    signOnContract: null,
    documentType: "",
    clauses: [
      { id: 0, description: `${ClauseOneAdditive()}`, isExpanded: false },
      { id: 1, description: `${ClauseTwoAdditive()}`, isExpanded: false },
      { id: 2, description: `${ClauseThreeAdditive()}`, isExpanded: false },
    ],
    newValue: null,
    oldValue: null,
    currentValue: null,
    index: null,
    type: "",
  });

  const extenseDate = new Date().getMonth() + 1;

  const [file, setFile] = React.useState();
  const [selectedSignDescriptions, setSelectedSignDescriptions] =
    React.useState("");
  const [tecSign, setTecSign] = React.useState();

  const [messageError, setMessageError] = React.useState({
    name: "",
    cpfcnpj: "",
    cep: "",
    road: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    signOnContract: "",
  });

  React.useEffect(() => {
    const fetchAddress = async () => {
      if (values.cep.length === 9) {
        try {
          const response = await utilsService.findCep(values.cep);
          if (response) {
            setValues((prevValues) => ({
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
  }, [values.cep]);

  React.useEffect(() => {
    if (values.cep.length !== 9) {
      setValues((prevValues) => ({
        ...prevValues,
        road: "",
        neighborhood: "",
        city: "",
        state: "",
      }));
    }
  }, [values.cep]);

  React.useEffect(() => {
    const Fetch = async () => {
      setValues((prevValues) => ({
        ...prevValues,
        clauses: prevValues.clauses.map((clause) =>
          clause.id === 1
            ? {
                ...clause,
                description: ClauseTwoAdditive(
                  values.oldValue,
                  values.newValue
                ),
              }
            : clause
        ),
      }));
    };
    Fetch();
  }, [values.newValue, values.oldValue]);

  const signSocialReason = signs.map((sign) => sign.socialReason);

  React.useEffect(() => {
    const fetchServicesAndSings = async () => {
      const signService = await contractSignService.getcontractSigns();

      setTecSign(() => {
        const tecSign = signService.data.listUsers;
        return tecSign;
      });

      setSigns(() => {
        const updatedSigns = signService.data.listUsers.map((sign) => ({
          id: sign.id,
          socialReason: sign.socialReason,
          city: sign.city,
          state: sign.state,
        }));
        return updatedSigns;
      });
    };

    fetchServicesAndSings();
  }, []);

  const descriptionSignToIdMap = signs.reduce((acc, service) => {
    acc[service.socialReason] = service.id;
    return acc;
  }, {});

  const mergePDFs = async (uploadedPDFDoc, createdPDFDoc) => {
    const mergedPDF = await PDFDocument.create();
    mergedPDF.setTitle(`Aditivo - ${values.name}`)

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

  const handleAddClick = () => {
    setValues((prevContract) => ({
      ...prevContract,
      clauses: [
        ...prevContract.clauses,
        { id: Date.now(), description: "", isExpanded: false },
      ],
    }));
  };

  const handleDeleteClause = (id) => {
    setValues((prevContract) => ({
      ...prevContract,
      clauses: prevContract.clauses.filter((clause) => clause.id !== id),
    }));
  };

  const toggleExpand = (id) => {
    setValues((prevContract) => ({
      ...prevContract,
      clauses: prevContract.clauses.map((clause) =>
        clause.id === id
          ? { ...clause, isExpanded: !clause.isExpanded }
          : clause
      ),
    }));
  };

  const handleClauseChange = (id, newText) => {
    setValues((prevValues) => ({
      ...prevValues,
      clauses: prevValues.clauses.map((clause) =>
        clause.id === id ? { ...clause, description: newText } : clause
      ),
    }));
  };

  const handleFormatChange = (eventOrDate) => {
    if (eventOrDate.target) {
      const { name, value } = eventOrDate.target;

      if (name === "cpfcnpj") {
        setValues((prevState) => ({
          ...prevState,
          [name]: Formats.CpfCnpj(value),
        }));
      } else if (name === "newValue") {
        setValues((prevState) => ({
          ...prevState,
          [name]: Formats.Money(value),
        }));
      } else if (name === "oldValue") {
        setValues((prevState) => ({
          ...prevState,
          [name]: Formats.Money(value),
        }));
      } else if (name === "currentValue") {
        setValues((prevState) => ({
          ...prevState,
          [name]: Formats.Money(value),
        }));
      } else if (name === "adjustedValue") {
        setValues((prevState) => ({
          ...prevState,
          [name]: Formats.Money(value),
        }));
      } else if (name === "cep") {
        setValues((prevState) => ({
          ...prevState,
          [name]: Formats.Cep(value),
        }));
      }
    }
  };

  const handleSignChange = (event) => {
    const { value, name } = event.target;

    setSelectedSignDescriptions(value);

    const tecValues = tecSign.filter((sign) => sign.socialReason === value);

    setValues((prevState) => ({
      ...prevState,
      [name]: tecValues,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setFile(e.target.result);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleAdditiveValues = (event) => {
    const { name, value } = event.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
    ];
    let newErrors = {};
    let isAllFieldsFilled = true;

    for (const field of requiredFields) {
      if (!values[field]) {
        newErrors[field] = "Este campo é obrigatório";
        isAllFieldsFilled = false;
      } else {
        newErrors[field] = "";
      }
    }

    setMessageError(newErrors);
    return isAllFieldsFilled;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emptyField = areRequiredFieldsFilled();

    if (!emptyField) {
      Toast.Info("Preencha os campos obrigatórios!");
      return;
    }

    if (values.documentType === "Aditivo") {
      const pdfByte = await LooseAdditivePDF(
        values.name,
        values.cpfcnpj,
        values.road,
        values.number,
        values.complement,
        values.neighborhood,
        values.city,
        values.state,
        values.signOnContract,
        values.clauses,
        extenseDate,
        values.signOnContract
      );

      let mergedBlob;

      if (file) {
        try {
          const uploadedPDFDoc = await PDFDocument.load(file);
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
          mergedPDF.setTitle(`Aditivo - ${values.name}`)
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
    } else {

      let mergedBlob;

      const pdfByte = await LooseReajustmentPDF(
        values.index,
        values.type,
        values.signOnContract,
        values.currentValue,
        values.name,
        extenseDate,
      );

      const createdPDFDoc = await PDFDocument.load(pdfByte);
      const mergedPDF = await PDFDocument.create();
      mergedPDF.setTitle(`Reajuste - ${values.name}`)
      for (const pageNum of createdPDFDoc.getPageIndices()) {
        const [page] = await mergedPDF.copyPages(createdPDFDoc, [pageNum]);
        mergedPDF.addPage(page);
      }
      const mergedPdfBytes = await mergedPDF.save();
      mergedBlob = new Blob([mergedPdfBytes], { type: "application/pdf" });

      const pdfUrl = URL.createObjectURL(mergedBlob);
      window.open(pdfUrl, "_blank");
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <Form.Root
      title="Gerar Aditivo/Reajuste"
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
    >
      <Form.Fragment section="Tipo de Documento">
        <CustomInput.Select
          label="Tipo"
          name="documentType"
          value={values.documentType}
          options={["Aditivo", "Reajuste"]}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, documentType: e.target.value }))
          }
        />
      </Form.Fragment>
      <Form.Fragment section="Contratante">
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Nome"
            type="text"
            name="name"
            value={values.name}
            onChange={handleAdditiveValues}
            errorText={messageError.name}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="CPF ou CNPJ"
            type="text"
            name="cpfcnpj"
            value={values.cpfcnpj}
            onChange={handleFormatChange}
            errorText={messageError.cpfcnpj}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="CEP"
            type="text"
            name="cep"
            value={values.cep}
            onChange={handleFormatChange}
            errorText={messageError.cep}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Rua"
            type="text"
            name="road"
            value={values.road}
            onChange={handleAdditiveValues}
            errorText={messageError.road}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={3}>
          <CustomInput.Input
            label="Número"
            type="text"
            name="number"
            value={values.number}
            onChange={handleAdditiveValues}
            errorText={messageError.number}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={3}>
          <CustomInput.Input
            label="Complemento"
            type="text"
            name="neighborhood"
            value={values.complement}
            onChange={handleAdditiveValues}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Bairro"
            type="text"
            name="neighborhood"
            value={values.neighborhood}
            onChange={handleAdditiveValues}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Cidade"
            type="text"
            name="city"
            value={values.city}
            onChange={handleAdditiveValues}
            errorText={messageError.city}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="UF"
            type="text"
            name="state"
            value={values.state}
            onChange={handleAdditiveValues}
            errorText={messageError.state}
          />
        </CustomInput.Root>
      </Form.Fragment>
      <Form.Fragment section="Assinatura">
          <CustomInput.Select
            label="Assinaturas"
            name="signOnContract"
            value={selectedSignDescriptions}
            options={signSocialReason}
            onChange={handleSignChange}
          />
        </Form.Fragment>
      {values.documentType === "Aditivo" && (
        <>
          <Form.Fragment section="Valores">
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Antigo Valor"
                type="text"
                name="oldValue"
                value={values.oldValue}
                onChange={handleFormatChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Novo Valor"
                type="text"
                name="newValue"
                value={values.newValue}
                onChange={handleFormatChange}
              />
            </CustomInput.Root>
            <div style={{ width: "100%" }}>
                    <Button
                      variant="contained"
                      style={{ marginBottom: "20px" }}
                      color="primary"
                      onClick={handleAddClick}
                    >
                      Adicionar Cláusula
                    </Button>
                    {values.clauses.map((clause, index) => (
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
              title="Anexar Proposta do Aditivo"
              style={{ backgroundColor: "#ed9121", color: "#fff" }}
              shape="default"
            >
              Anexar Proposta do Aditivo
            </Button>
          </Upload>
        </>
      )}
      {values.documentType === "Reajuste" && (
        <Form.Fragment section="Reajuste">
          <CustomInput.Root columnSize={6}>
            <CustomInput.Input
              label="Valor Atual"
              type="text"
              name="currentValue"
              value={values.currentValue}
              onChange={handleFormatChange}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={6}>
            <CustomInput.Select
              label="Índice"
              type="text"
              name="type"
              value={values.type}
              onChange={handleAdditiveValues}
              options={Options.IndexContract()}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={6}>
            <CustomInput.Input
              label="Porcentagem do Índice"
              type="number"
              name="index"
              value={values.index}
              onChange={handleAdditiveValues}
            />
          </CustomInput.Root>
        </Form.Fragment>
      )}
    </Form.Root>
  );
}
