import { Button } from "@mui/material";
import { styled } from '@mui/material/styles';
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Configurando o worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

function PDFMergeComponent() {
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadedPdf, setUploadedPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);

  const onFileChange = (event) => {
    console.log("Evento", event);
    const file = event.target.files[0];
    setUploadedPdf(file);
  };

  const mergePDFs = () => {
    // Implemente a lógica para mesclar os PDFs aqui
  };

  return (
    <div>
      <h1>PDF Merge</h1>
      <div>
        <h2>PDF Criado</h2>
        <Document
          file={pdfFile}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      </div>
      <div>
        <h2>PDF Carregado</h2>
        <Button
  component="label"
  role={undefined}
  variant="contained"
  tabIndex={-1}
>
  Upload file
  <VisuallyHiddenInput type="file" />
</Button>
        {uploadedPdf && (
          <Document
            file={uploadedPdf}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        )}
      </div>
      <button onClick={mergePDFs}>Mesclar PDFs</button>
    </div>
  );
}

export default PDFMergeComponent;