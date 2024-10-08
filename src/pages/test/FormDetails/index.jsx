import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PDFDocument } from "pdf-lib";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import happyEmoji from "../../../assets/form/emojis/happy.png";
import neutralEmoji from "../../../assets/form/emojis/neutral.png";
import sadEmoji from "../../../assets/form/emojis/sad.png";
import Loading from "../../../components/animations/Loading";
import {
  getFormById,
  getSubmissions,
} from "../../../components/formController/Form";
import EditBtn from "../../../components/formDetails/EditBtn";
import FormLinkShare from "../../../components/formDetails/FormLinkShare";
import VisitBtn from "../../../components/formDetails/VisitBtn";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Checkbox } from "../../../components/ui/checkbox";
import { DataTable } from "../../../components/ui/data-table";
import { formPdf } from "../../../utils/pdf/forms/formPdf";
import { columnsData } from "./columns/columns";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function FormDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const data = await getFormById(Number(id));
        setForm(data);
      } catch (error) {
        console.error("Erro ao buscar o formulário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [id]);

  if (loading || !form) {
    return <Loading />;
  }

  const { visits, submissions } = form;

  let submissionsRate = 0;

  if (visits > 0) {
    submissionsRate = (submissions / visits) * 100;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      {/* Header do formulário */}
      <div className="py-8 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-blue-600 p-3 rounded-full mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 break-words text-center">
                {form.name}
              </h1>
            </div>
            <div className="w-full flex justify-center">
              <Card className="w-full max-w-2xl mt-4">
                <CardContent className="flex flex-wrap justify-center gap-2 p-4">
                  <VisitBtn shareUrl={form.shareUrl}/>
                  <EditBtn id={id}/>
                  <FormLinkShare shareUrl={form.shareUrl}>
                    Compartilhar
                  </FormLinkShare>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de envios */}
      <div className="container mx-auto px-4 py-12 ">
        <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
          <SubmissionsTable id={form.id} className="w-full" />
        </div>
      </div>
    </div>
  );
}

export default FormDetails;

function SubmissionsTable({ id }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const data = await getSubmissions(Number(id));
        setForm(data);
        console.log(data);
      } catch (error) {
        console.error("Erro ao buscar os envios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  const generatePdf = async (submission, columns) => {
    const pdfByte = await formPdf(submission, columns);

    if (!pdfByte) {
      console.error("PDF byte array is null or undefined");
      return;
    }

    let mergedBlob;

    try {
      const createdPDFDoc = await PDFDocument.load(pdfByte);
      const mergedPDF = await PDFDocument.create();
      mergedPDF.setTitle(`Formulário - ${submission.name}`);
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

  const FormElements =
    form && form.content ? JSON.parse(form.content || "[]") : [];
  const columns = [];

  FormElements.forEach((element) => {
    switch (element.type) {
      case "TextField":
      case "NumberField":
      case "TextAreaField":
      case "DateField":
      case "SelectField":
      case "CheckboxField":
      case "ImagesField":
      case "EmojiField":
        columns.push({
          id: element.id,
          label: element.extraAtribbutes?.label,
          required: element.extraAtribbutes?.required,
          type: element.type,
        });
        console.log(columns);
        console.log(element);

        break;
      default:
        break;
    }
  });

  const rows = form.FormSubmissions.map((submission) => {
    const content = JSON.parse(submission.content);
    return {
      ...content,
      submittedAt: submission.createdAt,
      sendBy: submission.sendBy,
    };
  });

  const handleRowSelect = (rowData) => {
    setSelectedSubmission(rowData);
  };

  const handleClick = () => {
    return;
  };

  return (
    <div className="flex w-full h-screen bg-gray-100">
      {/* Sidebar de Envios */}
      <div className="w-1/4 border-r border-gray-200 bg-white shadow-lg overflow-y-auto">
        <div className="py-6 px-4 bg-blue-600 text-white">
          <h2 className="text-2xl font-bold">Envios</h2>
        </div>
        <DataTable
          columns={columnsData}
          data={rows}
          onClick={handleClick}
          onRowSelect={handleRowSelect}
        />
      </div>

      {/* Detalhes do Envio */}
      <div className="w-3/4 bg-white p-8 overflow-y-auto">
        {selectedSubmission ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Cabeçalho com Botão de PDF */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-black">
                Detalhes do Envio
              </h1>
              <Button
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition shadow-md"
                onClick={() => generatePdf(selectedSubmission, columns)}
              >
                Gerar PDF
              </Button>
            </div>

            {/* Seção de Detalhes */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-md">
              {/* Data de envio */}
              <div className="flex items-center mb-6">
                <label
                  className="font-bold text-gray-700 mr-4"
                  style={{ width: "200px" }}
                >
                  Data de envio:
                </label>
                <span className="text-lg">
                  {format(
                    new Date(selectedSubmission.submittedAt),
                    "dd/MM/yyyy",
                    {
                      locale: ptBR,
                    }
                  )}
                </span>
              </div>

              {/* Exibir Colunas do Envio */}
              {columns.map((column) => (
                <div key={column.id} className="flex items-center mb-6 gap-6">
                  <label
                    className="font-bold text-gray-700 mr-4"
                    style={{ width: "300px" }}
                  >
                    {column.label} {column.required ? "*" : ""}
                  </label>
                  <RowCell
                    type={column.type}
                    value={selectedSubmission[column.id]}
                    className="bg-white border border-gray-300 rounded-md p-2 flex-grow"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg
              className="w-24 h-24 mb-4 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-2xl font-semibold">
              Selecione um envio à esquerda para ver os detalhes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RowCell({ type, value }) {
  let node = value;

  switch (type) {
    case "DateField":
      if (!value) break;
      const date = new Date(value);
      node = (
        <span className="text-sm font-medium">
          {format(date, "dd/MM/yyyy")}
        </span>
      );
      break;
    case "CheckboxField":
      const checked = value === "true";
      node = checked ? (
        <Checkbox
          checked={checked}
          disabled
          className="rounded-md border-gray-400"
        />
      ) : (
        <span className="text-red-500">Sem Marcação</span>
      );
      break;
    case "SelectField":
      node = value ? (
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {value}
        </span>
      ) : (
        <span className="text-gray-500">Sem seleção</span>
      );
      break;
    case "EmojiField":
      let emojiSrc;

      switch (value) {
        case "good":
          emojiSrc = happyEmoji;
          break;
        case "neutral":
          emojiSrc = neutralEmoji;
          break;
        case "sad":
          emojiSrc = sadEmoji;
          break;
        default:
          emojiSrc = null;
      }

      node = emojiSrc ? (
        <img src={emojiSrc} alt={value} className="w-40 h-50" />
      ) : (
        <span className="text-gray-500">Sem seleção</span>
      );
      break;
    case "ImagesField":
      console.log("Entrou imagem", value);

      node = <ImageGallery images={JSON.parse(value || "[]")} />;
      break;
    default:
      break;
  }

  return <div className="flex items-center gap-2">{node}</div>;
}

function ImageGallery({ images }) {
  if (!images || images.length === 0) {
    return <span className="text-gray-500">Sem imagens</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {images.map((img, index) => (
        <img
          key={index}
          src={img.data}
          alt={img.name}
          className="w-20 h-20 object-cover rounded-md"
        />
      ))}
    </div>
  );
}
