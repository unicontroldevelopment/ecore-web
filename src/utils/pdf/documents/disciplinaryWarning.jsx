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
      image: verificaImagemDoDocumento(),
      width: 150,
      alignment: "center",
    },
    {
      text: `\n\nADVERTÊNCIA DISCIPLINAR\n\n`,
      alignment: "center",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `\nEmpregador: ${employee.company}`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `CNPJ: ${verificaCNPJ()}\n\n`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Empregado: ${employee.name}`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `CPF: ${employee.cpf}`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `CTPS: ${employee.ctps}`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `\n\nEsta tem a finalidade de aplicar-lhe a pena de Advertência Disciplinar, em razão da seguinte ocorrência:`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `\n${warningData.reason}`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `\nEsclarecemos, ainda que a repetição de procedimentos como este poderá ser considerada ato faltoso, passível de dispensa por justa causa. Para que não tenhamos, no futuro, de tomar as medidas que nos facultam a legislação vigente, solicitamo-lhe que observe as normal reguladoras da declaração de emprego.`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `\n${verificaEndereco()}, Canoas/RS, ${date.getDate()} de ${ExtenseMonth(date)} de ${date.getFullYear()}\n\n\n\n\n`,
      alignment: "center",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 5,
          x2: 300 - 2 * 40,
          y2: 5,
          lineWidth: 0.5,
        },
      ],
      alignment: "center",
    },
    {
      text: `${employee.name}`,
      alignment: "center",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `\n\nTESTEMUNHAS:\n\n\n`,
      alignment: "center",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 5,
          x2: 300 - 2 * 40,
          y2: 5,
          lineWidth: 0.5,
        },
      ],
      alignment: "center",
    },
    {
      text: `Nome: ${warningData.attestant_01}\nCPF: ${warningData.cpf_01}\n\n\n\n`,
      alignment: "center",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 5,
          x2: 300 - 2 * 40,
          y2: 5,
          lineWidth: 0.5,
        },
      ],
      alignment: "center",
    },
    {
      text: `Nome: ${warningData.attestant_02}\nCPF: ${warningData.cpf_02}\n`,
      alignment: "center",
      fontSize: 13,
      lineHeight: 1.2,
    },
  ];
  const docDefinition = {
    pageSize: "A4",
    content: [content],
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
