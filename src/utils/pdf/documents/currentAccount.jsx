/* eslint-disable react/prop-types */
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { logo, logoFitoLog, logoNewsis } from "../../../assets/logos/logo";

export const currentAccount = (employee, sign, date) => {
  const verificaImagemDoDocumento = () => {
    if (employee.company === "NEWSIS SISTEMAS E SERVIÇOS DE INTERNET LTDA") {
      return logoNewsis;
    } else if (employee.company === "UNICONTROL CONTROLE DE PRAGAS LTDA") {
      return logo;
    } else if (employee.company === "FITOLOG LICENCIAMENTO DE FRANQUIAS LTDA") {
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
      alignment: "left",
    },
    {
      text: "\n\nSolicitação de Abertura de conta salário\n\n",
      alignment: "center",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Canoas/RS,\n ${date.getDate()} de ${ExtenseMonth(date)} de ${date.getFullYear()}\n\n\n\n`,
      alignment: "right",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: "Ao Banco Itaú,\n\n\n\n",
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Solicitamos abertura de Conta Salário em nome de ${employee.name} RG ${employee.rg} no cargo de ${employee.office}, recebendo R$ ${employee.initialWage} mensais, sendo que a empresa aceita o comprovante de residência em anexo, sito em ${employee.road}, ${employee.number} - BAIRRO ${employee.neighborhood} - CEP ${employee.cep} ${employee.city}/${employee.state}.\n\n\n\n\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: "Sem mais,\n\n\n\n\n\n",
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
          lineWidth: 0.6,
        },
      ],
      alignment: "center",
    },
    {
      text: `${sign}\n${employee.company}`,
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
