import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { happy, neutral, sad } from "../../../assets/form/emojis/code64";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const getEmojiSrc = (value) => {
  switch (value) {
    case "happy":
      return happy;
    case "neutral":
      return neutral;
    case "sad":
      return sad;
    default:
      return null;
  }
};

const getFormattedValue = (type, value) => {
  switch (type) {
    case "DateField":
      if (value) {
        const date = new Date(value);
        return format(date, "dd/MM/yyyy", { locale: ptBR });
      } else {
        return "Data não disponível";
      }

    case "CheckboxField":
      return value === "true" ? "Marcado" : "Sem marcação";

    case "SelectField":
      return value ? value : "Sem seleção";

    case "EmojiField":
      const emojiSrc = getEmojiSrc(value);

      if (emojiSrc) {
        return { image: emojiSrc, width: 50, height: 50 };
      }
      return "Sem seleção";

    default:
      return value || "N/A";
  }
};

export const formPdf = (submission, columns) => {
  const docDefinition = {
    pageSize: "A4",
    content: [
      {
        text: `Data de envio: ${format(
          new Date(submission.submittedAt),
          "dd/MM/yyyy",
          { locale: ptBR }
        )}`,
        style: "header",
        alignment: "center",
      },
      ...columns.map((column) => ({
        columns: [
          { text: column.label, bold: true, alignment: 'right', width: 100 },
          getFormattedValue(column.type, submission[column.id]),
        ],
        columnGap: 5,
        margin: [0, 0, 0, 10],
      })),
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 20],
      },
      subheader: {
        fontSize: 14,
        bold: true,
      },
    },
  };

  const pdfDoc = pdfMake.createPdf(docDefinition);

  return new Promise((resolve, reject) => {
    pdfDoc.getBase64(
      (base64) => {
        resolve(base64);
      },
      (error) => {
        reject(error);
      }
    );
  });
};
