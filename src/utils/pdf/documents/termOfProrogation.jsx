/* eslint-disable react/prop-types */
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { logo, logoFitoLog, logoNewsis } from "../../../assets/logos/logo";

export const termOfProrrogation = (employee) => {
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

  const formatData60Dias = (date) => {
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + 90);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
  
    return `${day}/${month}/${year}`;
  };

  const formatData = (date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
  
    return `${day}/${month}/${year}`;
  };

  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const content = [
    {
      image: verificaImagemDoDocumento(),
      width: 150,
      alignment: "center",
    },
    {
      text: "\n\n\n\n\nProrrogação de contrato de trabalho por experiência\n\n\n\n\n",
      alignment: "center",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Entre, ${
        employee.company
      } (e demais coligados, quando aplicáveis), empregador e ${
        employee.name
      }, empregado, fica ajustado a prorrogação do contrato de trabalho por experiência, firmado em ${formatData(
        employee.dateAdmission
      )}, por mais 60 dias, ou seja, até ${formatData60Dias(
        employee.dateAdmission
      )}, mantida as cláusulas e condições contratuais acima estabelecidas.\n\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: "________________________________________\t\t\t\t\t\t________________________________________\n\n",
    },
    {
      text: `${employee.company}\t\t\t\t\t\t${employee.name}\n\n`,
    },
    {
      text: "\n\n\n\nTestemunha\n\n",
      alignment: "center",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: "________________________________________\t\t\t\t\t\t________________________________________\n\n",
    },
    {
      text: "CPF: \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tCPF: \n\n",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: "Nomes: \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  Nomes: ",
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
