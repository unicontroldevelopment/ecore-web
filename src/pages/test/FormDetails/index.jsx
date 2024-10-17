import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PDFDocument } from "pdf-lib";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { useEffect, useState } from "react";
import { AiOutlineForm } from "react-icons/ai";
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
import { Checkbox } from "../../../components/ui/checkbox";
import { DataTable } from "../../../components/ui/data-table";
import { formPdf } from "../../../utils/pdf/forms/formPdf";
import { columnsDataPPC } from "./columns/columnPPC";
import { columnsDataPPO } from "./columns/columnPPO";
import { columnsData } from "./columns/columns";
import { columnsDataPPA } from "./columns/columnsPPAPPO";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function FormDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

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

  const handleSubmissionSelect = (submission) => {
    setSelectedSubmission(submission);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="p-6 flex bg-white shadow-lg border-b-2 border-gray-300 gap-4">
      <AiOutlineForm className="text-blue-500" size={32} />
        <h1 className="text-3xl font-semibold text-gray-800">{form.name}</h1>
      </header>
      <div className="flex flex-1 gap-4 p-4">
        <aside className="w-1/3 bg-white rounded-lg shadow-md p-4 border border-gray-300">
          <nav className="mb-4">
            <div className="flex justify-center gap-2">
              <VisitBtn shareUrl={form.shareUrl} />
              <EditBtn id={id} />
              <FormLinkShare shareUrl={form.shareUrl} />
            </div>
          </nav>
          <div className="flex-1 overflow-y-auto">
            <SubmissionsTable
              id={form.id}
              onSubmissionSelect={handleSubmissionSelect}
              selectedSubmission={selectedSubmission}
            />
          </div>
        </aside>
        <main className="w-full h-full flex-1 bg-white rounded-lg shadow-md p-6 border border-gray-300">
          <div className="h-full w-full">
            <SubmissionDetails
              selectedSubmission={selectedSubmission}
              form={form}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function SubmissionsTable({ id, onSubmissionSelect, selectedSubmission }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const data = await getSubmissions(Number(id));
        setForm(data);
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
        break;
      default:
        break;
    }
  });

  const rows = form.FormSubmissions.map((submission) => {
    const content = JSON.parse(submission.content);
    const rowData = {};

    columns.forEach((column) => {
      const fieldValue = content[column.id];
      if (fieldValue !== undefined) {
        rowData[column.id] = fieldValue;
      }
    });

    const valorRecebidoField = columns.find(
      (column) =>
        column.label === "Valor recebido" && column.type === "TextField"
    );
    const trimestreAvaliadoField = columns.find(
      (column) =>
        column.label === "Trimestre avaliado" && column.type === "SelectField"
    );
    const mesAvaliadoField = columns.find(
      (column) =>
        column.label === "Mês avaliado" && column.type === "SelectField"
    );

    const avaliadoComo = trimestreAvaliadoField
      ? content[trimestreAvaliadoField.id]
      : mesAvaliadoField
      ? content[mesAvaliadoField.id]
      : null;
    const notaDada = valorRecebidoField ? content[valorRecebidoField.id] : null;

    return {
      ...content,
      submittedAt: submission.createdAt,
      sendBy: submission.sendBy,
      avaliatedAt: avaliadoComo,
      valueNote: notaDada,
    };
  });

  const handleClick = () => {
    return;
  };

  const handleRowSelect = (rowData) => {
    onSubmissionSelect(rowData);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="py-4 px-4 bg-zinc-200 text-black border border-black/20">
        <h2 className="text-xl font-bold">Envios</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {form.type === "PPA" && (
          <DataTable
            columns={columnsDataPPA}
            data={rows}
            onRowSelect={handleRowSelect}
            onClick={handleClick}
          />
        )}
        {form.type === "PPO" && (
          <DataTable
            columns={columnsDataPPO}
            data={rows}
            onRowSelect={handleRowSelect}
            onClick={handleClick}
          />
        )}
        {form.type === "PPC" && (
          <DataTable
            columns={columnsDataPPC}
            data={rows}
            onRowSelect={handleRowSelect}
            onClick={handleClick}
          />
        )}
        {form.type === "Public" && (
          <DataTable
            columns={columnsData}
            data={rows}
            onRowSelect={handleRowSelect}
            onClick={handleClick}
          />
        )}
      </div>
    </div>
  );
}

function SubmissionDetails({ selectedSubmission, form }) {
  // Implemente a lógica para renderizar os detalhes do envio aqui
  // Use o código que você já tem para exibir os detalhes
  if (!selectedSubmission) {
    return (
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
    );
  }

  const generatePdf = async (submission, columns) => {
    const pdfByte = await formPdf(submission, columns, form);

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
  const columns = FormElements.filter((element) =>
    [
      "TextField",
      "NumberField",
      "TextAreaField",
      "DateField",
      "SelectField",
      "CheckboxField",
      "ImagesField",
      "EmojiField",
    ].includes(element.type)
  ).map((element) => ({
    id: element.id,
    label: element.extraAtribbutes?.label,
    required: element.extraAtribbutes?.required,
    type: element.type,
  }));

  // Renderize os detalhes do envio aqui
  return (
    <div>
      <div className="w-full h-full bg-gray-100 p-8 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-black">Detalhes do Envio</h1>
            <Button
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition shadow-md"
              onClick={() => generatePdf(selectedSubmission, columns)}
            >
              Gerar PDF
            </Button>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
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
      node = <ImageGallery images={JSON.parse(value || "[]")} />;
      break;
    default:
      break;
  }

  return (
    <div className="flex items-center justify-between w-full gap-2">{node}</div>
  );
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
