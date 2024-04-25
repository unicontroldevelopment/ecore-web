/* eslint-disable react/prop-types */
import { Button, Upload } from "antd";
import { PDFDocument } from "pdf-lib";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import React, { useState } from "react";
import { logo } from "../../assets/logos/logo";

async function createBasicPDF(
  name = "Gui",
  road = "Rua Brasil",
  neighborhood = "Centro",
  city = "Canoas",
  state = "RS",
  number = 150,
  cpfCnpj = "047.804.160.86",
  clauses = [
    { description: "Esta é a cláusula 1." },
    { description: "Esta é a cláusula 2." },
    { description: "Esta é a cláusula 3." },
  ]
) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const content = clauses.map((clause) => ({
    text: clause.description,
    fontSize: 12,
    alignment: "justify",
    margin: [0, 0, 0, 10],
  }));

  const docDefinition = {
    pageSize: "A4",
    content: [
      {
        image: logo,
        width: 150,
        alignment: "center",
      },
      {
        text: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS",
        fontSize: 13,
        bold: true,
        alignment: "center",
      },
      { text: "N°1", fontSize: 13, alignment: "center", margin: [0, 0, 0, 20] },
      {
        text: `Entre ${name}, com sede na ${road}, ${number} - ${neighborhood}, ${city}/${state}, registrada no CNPJ, sob o nº ${cpfCnpj}, doravante designada CONTRATANTE, e contratado.razao_social com sede na contratado.endereco registrada no CNPJ nº contratado.cnpj neste ato representada pelo seu sócio gerente, abaixo assinado, doravante designada CONTRATADA, tem entre si justo e acertado este Contrato, mediante as cláusulas e condições que seguem:`,
        fontSize: 12,
        alignment: "justify",
        margin: [0, 0, 0, 10],
      },
      ...content,
    ],
  };

  const pdfDoc = pdfMake.createPdf(docDefinition);

  // Retorna uma Promise que resolve com o Uint8Array
  return new Promise((resolve, reject) => {
    pdfDoc.getBuffer(
      (buffer) => {
        const uint8Array = new Uint8Array(buffer);
        resolve(uint8Array);
      },
      (error) => {
        reject(error);
      }
    );
  });
}

function PDFMergeComponent() {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [uploadedPDF, setUploadedPDF] = useState(null);
  const [mergedPDF, setMergedPDF] = useState(null);

  async function mergePDFs(uploadedPDFBytes, createdPDFBytes) {
    const uploadedPDFDoc = await PDFDocument.load(uploadedPDFBytes);
    const createdPDFDoc = await PDFDocument.load(createdPDFBytes);

    const mergedPDF = await PDFDocument.create();
    const [createdFirstPage] = await mergedPDF.copyPages(createdPDFDoc, [0]);
    const [uploadedFirstPage] = await mergedPDF.copyPages(uploadedPDFDoc, [0]);

    mergedPDF.addPage(createdFirstPage);
    mergedPDF.insertPage(0, uploadedFirstPage);

    const mergedPdfBytes = await mergedPDF.save();

    return new Blob([mergedPdfBytes], { type: "application/pdf" });
  }

  const handleMerge = async () => {
    if (uploadedPDF) {
      const createdPDFBytes = await createBasicPDF();
      const mergedBlob = await mergePDFs(createdPDFBytes, uploadedPDF);
      setMergedPDF(mergedBlob);
    }
  };

  const handleDownload = async () => {
    const pdfUrl = URL.createObjectURL(mergedPDF);
    window.open(pdfUrl, "_blank");
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const bytes = new Uint8Array(e.target.result);
      console.log(bytes);
      setUploadedPDF(bytes);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <Upload
        beforeUpload={(file) => {
          handleUpload({ target: { files: [file] } });
          return false;
        }}
        accept=".pdf"
        showUploadList={false}
      >
        <Button>Upload PDF</Button>
      </Upload>
      <Button onClick={handleMerge}>Merge PDFs</Button>
      <Button onClick={handleDownload} disabled={!mergedPDF}>
        Download Merged PDF
      </Button>
    </div>
  );
}

export default PDFMergeComponent;
