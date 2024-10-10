import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { happy, neutral, sad } from "../../../assets/form/emojis/code64";
import { logo } from "../../../assets/logos/logo";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const getEmojiSrc = (value) => {
  switch (value) {
    case "good":
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

export const formPdf = (submission, columns, form) => {
  console.log("form", form);

  const docDefinition = {
    pageSize: "A4",
    content: [
      {
        image: logo,
        width: 150,
        alignment: "center",
        margin: [0, 0, 0, 50],
      },
      ...columns.map((column) => {
        const formattedValue = getFormattedValue(
          column.type,
          submission[column.id]
        );
        return {
          columns: [
            {
              text: column.label,
              bold: true,
              width: "30%",
              alignment: "left",
              margin: [0, 5, 10, 20],
              background: "#f0f0f0",
              padding: [5, 5, 5, 5],
            },
            (() => {
              switch (column.type) {
                case "SelectField":
                  return {
                    text: formattedValue,
                    width: "70%",
                    margin: [0, 5, 0, 15],
                    background: "#e6f2ff",
                    padding: [5, 5, 5, 5],
                    border: [5, 5, 5, 5],
                    borderColor: "#4f76be",
                    borderRadius: 999,
                  };
                case "EmojiField":
                  return {
                    ...formattedValue,
                    margin: [0, 5, 0, 15],
                    alignment: "left",
                  };
                case "CheckboxField":
                  return {
                    text: formattedValue,
                    width: "70%",
                    margin: [0, 5, 0, 15],
                    padding: [5, 5, 5, 5],
                    background:
                      formattedValue === "Marcado" ? "#e6ffe6" : "#fff0f0",
                  };
                case "DateField":
                  return {
                    text: formattedValue,
                    width: "70%",
                    margin: [0, 5, 0, 15],
                    padding: [5, 5, 5, 5],
                    background: "#fff9e6",
                  };
                default:
                  return {
                    text: formattedValue,
                    width: "70%",
                    margin: [0, 5, 0, 15],
                    padding: [5, 5, 5, 5],
                  };
              }
            })(),
          ],
          columnGap: 0,
        };
      }),
      {
        ...(form.type === "PPA" || form === "PPO"
          ? {
              text: "Estágio (16,67 - 33,33 - 50,00) || Auxiliar (33,33 - 66,67 - 100,00) || Assistente (50,00 - 100,00 - 150,00) || Analista (66,67 - 133,33 - 200,00)",
            }
          : {}),
      },
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
