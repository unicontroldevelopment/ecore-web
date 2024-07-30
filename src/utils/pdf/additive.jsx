/* eslint-disable react/prop-types */
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { baciaDoJacui, canoas } from "../../assets/folhas/folhas";
import { Formats } from "../formats";

const processText = (text) => {
  const parts = text.split('*');
  const processedText = parts.map((part, index) => {
    if (index % 2 === 1) {
      return { text: part, bold: true, decoration: 'underline' };
    }
    return part;
  });
  return processedText;
};

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

  let background

  if(tecSign.city === "Canoas") {
    background = canoas
  } else if (tecSign.city === "Bacia do Jacui") {
    background = baciaDoJacui
  }

  const docDefinition = {
    pageSize: "A4",
    background: [
        {
            image: background,
            width: 595.28,
            height: 841.89,
            absolutePosition: { x: 0, y: 0 },
        }
    ],
    content: [
      {
        text: "\n\n\n\n\n\nADITIVO DE PRESTAÇÃO DE SERVIÇOS \n\n",
        fontSize: 13,
        bold: true,
        alignment: "center",
      },
      {
        text: processText(`Entre *${name}*, com sede na *${road}*, *${number}* *${complement ? complement : ""}* - *${neighborhood}*, *${city}*/*${state}*, registrada no *${
          cpfcnpj.length >= 18 ? `CNPJ` || cpfcnpj.length === 14 : `CPF`
        }*, sob o nº *${cpfcnpj}*, doravante designada CONTRATANTE, e *${
          tecSign.socialReason
        }* com sede na *${tecSign.address}* registrada no CNPJ nº *${
          tecSign.cnpj
        }* neste ato representada pelo seu sócio gerente, abaixo assinado, doravante designada CONTRATADA, tem entre si justo e acertado este Contrato, mediante as cláusulas e condições que seguem:`),
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
        text: processText(`\nCONTRATANTE \nNOME: ${name} \n${
          cpfcnpj.length >= 18 ? `CNPJ` || cpfcnpj.length === 14 : `CPF`
        }: ${cpfcnpj}\n\n`),
      },
      {
        text: processText(`UNICONTROL \nNOME: ${tecSign.responsibleName}\nCPF: ${tecSign.cpf}`),
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