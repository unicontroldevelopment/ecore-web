/* eslint-disable react/prop-types */
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { logo, logoFitoLog, logoNewsis } from "../../../assets/logos/logo";

export const disciplinaryWarining = (employee, warningData, date) => {
  const verificaCNPJ = () => {
    if (employee.company === "NEWSIS SISTEMAS E SERVIÇOS DE INTERNET LTDA") {
      return "28.008.830/0001-84";
    } else if (employee.company === "UNICONTROL CONTROLE DE PRAGAS LTDA") {
      return "11.486.771/0001-57";
    } else if (employee.company === "FITOLOG LICENCIAMENTO DE FRANQUIAS LTDA") {
      return "10.420.329/0001-65";
    } else {
      return "11.486.771/0001-57";
    }
  };

  const verificaEndereco = () => {
    if (employee.company === "NEWSIS SISTEMAS E SERVIÇOS DE INTERNET LTDA") {
      return "Rua Márcio Toboliski Fernandes, 41, Sala 4";
    } else if (employee.company === "UNICONTROL CONTROLE DE PRAGAS LTDA") {
      return "Rua Márcio Toboliski Fernandes, 41";
    } else if (employee.company === "FITOLOG LICENCIAMENTO DE FRANQUIAS LTDA") {
      return "Rua Márcio Toboliski Fernandes, 41, Sala 2";
    } else {
      return "Rua Márcio Toboliski Fernandes, 41";
    }
  };

  const verificaImagemDoDocumento = () => {
    if (
        employee.company ===
      "NEWSIS SISTEMAS E SERVIÇOS DE INTERNET LTDA"
    ) {
      return logoNewsis;
    } else if (
        employee.company === "UNICONTROL CONTROLE DE PRAGAS LTDA"
    ) {
      return logo;
    } else if (
        employee.company ===
      "FITOLOG LICENCIAMENTO DE FRANQUIAS LTDA"
    ) {
      return logoFitoLog;
    } else {
      return logo;
    }
  };

  const ExtenseMonth = (date) => {
    const months = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];
    const month = months[date.getMonth()];
    return month.charAt(0).toUpperCase() + month.slice(1);
  };

  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const content = [
    {
      columns: [
        {
          image: verificaImagemDoDocumento(),
          width: 200,
          alignment: "left",
        },
        {
          text: "ADVERTÊNCIA DISCIPLINAR",
          alignment: "right",
          fontSize: 20,
          bold: true,
        },
        
      ],
      margin: [0, 0, 0, 20],
    },
    {
      text: [
        { text: `Empregador: `, bold: true },
        `${employee.company}\n`,
        { text: `CNPJ: `, bold: true },
        `${verificaCNPJ()}\n`,
        { text: `Empregado: `, bold: true },
        `${employee.name}\n`,
        { text: `CPF: `, bold: true },
        `${employee.cpf}\n`,
        { text: `CTPS: `, bold: true },
        `${employee.ctps}\n`,
      ],
      fontSize: 10,
      lineHeight: 1.2,
      margin: [0, 0, 0, 15],
    },
    {
      text: "Esta tem a finalidade de aplicar-lhe a pena de Advertência Disciplinar, em razão da seguinte ocorrência:",
      fontSize: 10,
      lineHeight: 1.2,
      margin: [0, 0, 0, 40],
    },
    {
      text: warningData.reason,
      fontSize: 10,
      lineHeight: 1.2,
      margin: [0, 0, 0, 10],
    },
    {
      text: "Esclarecemos, ainda que a repetição de procedimentos como este poderá ser considerada ato faltoso, passível de dispensa por justa causa. Para que não tenhamos, no futuro, de tomar as medidas que nos facultam a legislação vigente, solicitamo-lhe que observe as normas reguladoras da relação de emprego.",
      fontSize: 10,
      lineHeight: 1.2,
      margin: [0, 0, 0, 10],
    },
    {
      text: `${verificaEndereco()}, Canoas/RS, ${date.getDate()} de ${ExtenseMonth(date)} de ${date.getFullYear()}`,
      alignment: "center",
      fontSize: 10,
      lineHeight: 1.2,
      margin: [0, 0, 0, 70],
    },
    {
      columns: [
        {
          width: "*",
          text: "",
        },
        {
          width: "auto",
          stack: [
            { canvas: [{ type: "line", x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 0.5 }] },
            { text: employee.name, alignment: "center", fontSize: 10 },
          ],
        },
        {
          width: "*",
          text: "",
        },
      ],
      margin: [0, 0, 0, 60],
    },
    {
      text: "TESTEMUNHAS:",
      alignment: "center",
      fontSize: 10,
      bold: true,
      margin: [0, 0, 0, 60],
    },
    {
      columns: [
        {
          width: "*",
          stack: [
            { canvas: [{ type: "line", x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 0.5 }] },
            { text: `Nome: ${warningData.attestant_01}`, alignment: "center", fontSize: 9 },
            { text: `CPF: ${warningData.cpf_01}`, alignment: "center", fontSize: 9 },
          ],
        },
        {
          width: 20,
          text: "",
        },
        {
          width: "*",
          stack: [
            { canvas: [{ type: "line", x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 0.5 }] },
            { text: `Nome: ${warningData.attestant_02}`, alignment: "center", fontSize: 9 },
            { text: `CPF: ${warningData.cpf_02}`, alignment: "center", fontSize: 9 },
          ],
        },
      ],
    },
  ];

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 40],
    content: content,
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