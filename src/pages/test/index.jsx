/* eslint-disable react/prop-types */
import { Button } from "antd";
import { PDFDocument } from "pdf-lib";
import * as React from "react";
import { CustomInput } from "../../components/input";
import { Reajustment } from "../../utils/pdf/reajustment";

const FileUpload = () => {
  const [values, setValues] = React.useState({
    index: null,
    type: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleCreateReajustment = async () => {
    const pdfByte = await Reajustment(values.index, values.type);

    let mergedBlob;
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

    const pdfUrl = URL.createObjectURL(mergedBlob);
    window.open(pdfUrl, "_blank");
  };

  return (
    <>
      <CustomInput.Input
        name="index"
        label="Indice"
        type="number"
        value={values.index}
        onChange={handleChange}
      />
      <CustomInput.Input
        name="type"
        label="Tipo de Indice"
        type="text"
        value={values.type}
        onChange={handleChange}
      />
      <Button key="submit" type="primary" onClick={handleCreateReajustment}>
        Criar
      </Button>
    </>
  );
};

export default FileUpload;
