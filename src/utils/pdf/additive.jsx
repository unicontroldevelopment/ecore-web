/* eslint-disable react/prop-types */
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { logo } from "../../assets/logos/logo";
import { Formats } from "../formats";

export const Additive = (
  name,
  cpfcnpj,
  road,
  number,
  complement,
  neighborhood,
  city,
  state,
  signOnContract,
  clauses,
  date
) => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const content = clauses.map((clause) => ({
    text: clause.description,
    fontSize: 12,
    alignment: "justify",
    margin: [0, 0, 0, 10],
  }));

  const tecSign = signOnContract[0].Contract_Signature;

  const docDefinition = {
    pageSize: "A4",
    content: [
      {
        image: logo,
        width: 150,
        alignment: "center",
      },
      {
        text: "ADITIVO DE PRESTAÇÃO DE SERVIÇOS \n\n",
        fontSize: 13,
        bold: true,
        alignment: "center",
      },
      {
        text: `Entre ${name}, com sede na ${road}, ${number} - ${neighborhood}, ${city}/${state}, registrada no ${
          cpfcnpj.length >= 18 ? `CNPJ` || cpfcnpj.length === 14 : `CPF`
        }, sob o nº ${cpfcnpj}, doravante designada CONTRATANTE, e ${
          tecSign.socialReason
        } com sede na ${tecSign.address} registrada no CNPJ nº ${
          tecSign.cnpj
        } neste ato representada pelo seu sócio gerente, abaixo assinado, doravante designada CONTRATADA, tem entre si justo e acertado este Contrato, mediante as cláusulas e condições que seguem:`,
        fontSize: 12,
        alignment: "justify",
        margin: [0, 0, 0, 10],
      },
      ...content,
      {
        text: `\n\n - \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t${
          tecSign.city
        }/${tecSign.state}, ${new Date().getDate()} de ${Formats.ExtenseMonth(
          date
        )} de ${new Date().getFullYear()}.\n\n `,
      },
      {
        text: `\nCONTRATANTE \nNOME: ${name} \n${
          cpfcnpj.length >= 18 ? `CNPJ` || cpfcnpj.length === 14 : `CPF`
        }: ${cpfcnpj}\n\n`,
      },
      {
        text: `UNICONTROL \nNOME: ${tecSign.responsibleName}\nCPF: ${tecSign.cpf}`,
      },
    ],
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
