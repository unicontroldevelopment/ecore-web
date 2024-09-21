import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PDFDocument } from "pdf-lib";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/animations/Loading";
import {
  getFormById,
  getSubmissions,
} from "../../../components/formController/Form";
import FormLinkShare from "../../../components/formDetails/FormLinkShare";
import VisitBtn from "../../../components/formDetails/VisitBtn";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { formPdf } from "../../../utils/pdf/forms/formPdf";
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

  const bounceRate = 100 - submissionsRate;

  return (
    <div className="flex w-full flex-col flex-grow mx-auto">
      <div className="py-10 border-b border-muted bg-slate-200 border rounded-md">
        <div className="flex justify-between container">
          <h1 className="text-4xl font-bold truncate">{form.name}</h1>
          <VisitBtn shareUrl={form.shareUrl} />
        </div>
      </div>
      <div className="py-4 border-b border-muted bg-gray-400">
        <div className="container flex gap-2 items-center justify-between">
          <FormLinkShare shareUrl={form.shareUrl} />
        </div>
      </div>
      <div style={{ width: "100%", height: "100%", backgroundColor: "gray" }}>
        <SubmissionsTable id={form.id} />
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
    return {
      ...content,
      submittedAt: submission.createdAt,
      sendBy: submission.sendBy,
    };
  });

  return (
    <div className="flex w-full h-screen">
      <div className="w-1/4 border-r border-gray-300 rounded-md bg-gray-100 overflow-y-auto">
        <div className="py-4 px-4 border-b border-gray-300">
          <h2 className="text-xl font-bold">Envios</h2>
        </div>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                onClick={() => setSelectedSubmission(row)}
                className={`cursor-pointer hover:bg-gray-200 ${
                  selectedSubmission?.submittedAt === row.submittedAt
                    ? "bg-gray-300"
                    : ""
                }`}
              >
                <TableCell>{row.sendBy || "N/A"}</TableCell>
                <TableCell>
                  {format(new Date(row.submittedAt), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="w-3/4 bg-white p-6">
        {selectedSubmission ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Detalhes do Envio</h1>
              <Button onClick={() => generatePdf(selectedSubmission, columns)}>
                Gerar PDF
              </Button>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <label className="font-bold mr-4" style={{ width: "200px" }}>
                  Data de envio:
                </label>
                <span className="text-lg">
                  {format(
                    new Date(selectedSubmission.submittedAt),
                    "dd/MM/yyyy",
                    { locale: ptBR }
                  )}
                </span>
              </div>
              {columns.map((column) => (
                <div key={column.id} className="flex items-center mb-10 gap-6">
                  <label className="font-bold mr-4" style={{ width: "300px" }}>
                    {column.label} {column.required ? "*" : ""}
                  </label>
                  <RowCell
                    type={column.type}
                    value={selectedSubmission[column.id]}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-500">
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
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {value}
        </span>
      ) : (
        <span className="text-gray-500">Sem seleção</span>
      );
      break;
    default:
      break;
  }

  return <div className="flex items-center gap-2">{node}</div>;
}
