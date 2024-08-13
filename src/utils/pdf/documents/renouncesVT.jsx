/* eslint-disable react/prop-types */
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { logo, logoFitoLog, logoNewsis } from "../../../assets/logos/logo";

export const renouncesVT = (employee) => {
    const formatDate = (date) => {
        const dateObj = new Date(date);
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();
      
        return `${day}/${month}/${year}`;
      };

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

  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const content = [
    {
      image: verificaImagemDoDocumento(),
      width: 150,
      alignment: "left",
    },
    {
      text: "\n\nDECLARAÇÃO DE RENÚNCIA DE VALE TRANSPORTE\n\n\n",
      alignment: "center",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `EMPRESA: ${
        employee.company
      }\nCNPJ: ${verificaCNPJ()}\nSito à: ${verificaEndereco()}, Canoas/RS\n\n\n\n`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `EMPREGADO: ${employee.name}\nCPF: ${employee.cpf}\nCTPS: ${employee.ctps}\n\n\n\n`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Declaro para os devidos fins, que não pretendo fazer o uso do Programa Vale Transporte, instituído em anto, renuncia a este benefício.\n\n\n\n`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Canoas, ${formatDate(
        employee.dateAdmission
      )}.\n\n\n\n`,
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
      text: `${employee.name}`,
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
