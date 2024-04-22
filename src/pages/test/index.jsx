/* eslint-disable react/prop-types */
import { Button, Upload } from "antd";
import { PDFDocument, rgb } from "pdf-lib";
import React, { useState } from "react";
import backgroundImg from "../../assets/background.png";

async function createBasicPDF() {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])
  const {width, height} = page.getSize()

    const imagePath = backgroundImg
    const imageBytes = await fetch(imagePath).then(res => res.arrayBuffer());
  
    const image = await pdfDoc.embedPng(imageBytes);
  
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: width,
      height: height,
    });

    const fontSizeTitle = 13;
    const fontSizeHeader = 13;
  
    const titleText = 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS';
    const headerText = 'N°1';
  
    // Definir estilos para o título
    const titleStyle = {
      fontSize: fontSizeTitle,
      textAlign: 'center',
      marginBottom: 10,
    };
  
    // Definir estilos para o cabeçalho
    const headerStyle = {
      fontSize: fontSizeHeader,
      textAlign: 'center',
      marginBottom: 20,
    };
  
    // Adicionar o título ao PDF
    const titleWidth = page.widthOfString(titleText) * fontSizeTitle / 1000;
    page.drawText(titleText, {
      x: (page.getWidth() - titleWidth) / 2,
      y: page.getHeight() - 50,
      size: fontSizeTitle,
      color: rgb(0, 0, 0),
      ...titleStyle,
    });
  
    // Adicionar o cabeçalho ao PDF
    const headerWidth = page.widthOfString(headerText) * fontSizeHeader / 1000;
    page.drawText(headerText, {
      x: (page.getWidth() - headerWidth) / 2,
      y: page.getHeight() - 70,
      size: fontSizeHeader,
      color: rgb(0, 0, 0),
      ...headerStyle,
    });

  const pdfBytes = await pdfDoc.save();
  return new Uint8Array(pdfBytes);
}

function PDFMergeComponent() {
  const [mergedPDFBytesP, setMergedPDFBytes] = useState(null);
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

  const handleDownload = () => {
    if (mergedPDF) {
      const pdfUrl = URL.createObjectURL(mergedPDF);
      window.open(pdfUrl, "_blank");
    }
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
