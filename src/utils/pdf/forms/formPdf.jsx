import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import pdfMake from "pdfmake/build/pdfmake";
import { happy, neutral, sad } from "../../../assets/form/emojis/code64";

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
        return { image: emojiSrc, width: 100, height: 120 };
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
      },
      {
        table: {
          widths: ["*", "*"],
          body: [
            ...columns.map((column) => [
              { text: column.label, bold: true },
              getFormattedValue(column.type, submission[column.id]),
            ]),
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 14,
        margin: [0, 10, 0, 5],
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
