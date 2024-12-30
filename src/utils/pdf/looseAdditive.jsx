/* eslint-disable react/prop-types */
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {
  araras,
  baciaDoJacui,
  bauru,
  canaa,
  canoas,
  erechim,
  esteio,
  farroupilha,
  floresDaCunha,
  limao,
  lucena,
  master,
  orizona,
  poaCentro,
  poaZN,
  recife,
  rioGrande,
  saoLeopoldo,
  saoLourenco,
  vacaria,
  valeDosSinos,
} from "../../assets/folhas/folhas";
import { Formats } from "../formats";

const processText = (text) => {
  const parts = text.split("*");
  const processedText = parts.map((part, index) => {
    if (index % 2 === 1) {
      return { text: part, bold: true };
    }
    return part;
  });
  return processedText;
};

export const LooseAdditivePDF = (
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

  const tecSign = signOnContract[0];

  console.log(signOnContract);

  let background;

  if (tecSign.id === 1) {
    background = canoas;
  } else if (tecSign.id === 2) {
    background = baciaDoJacui;
  } else if (tecSign.id === 3) {
    background = poaZN;
  } else if (tecSign.id === 4) {
    background = vacaria;
  } else if (tecSign.id === 5) {
    background = saoLourenco;
  } else if (tecSign.id === 6) {
    background = valeDosSinos;
  } else if (tecSign.id === 7) {
    background = master;
  } else if (tecSign.id === 8) {
    background = erechim;
  } else if (tecSign.id === 9) {
    background = canaa;
  } else if (tecSign.id === 10) {
    background = floresDaCunha;
  } else if (tecSign.id === 11) {
    background = lucena;
  } else if (tecSign.id === 12) {
    background = canoas;
  } else if (tecSign.id === 13) {
    background = orizona;
  } else if (tecSign.id === 14) {
    background = esteio;
  } else if (tecSign.id === 15) {
    background = poaCentro;
  } else if (tecSign.id === 16) {
    background = recife;
  } else if (tecSign.id === 17) {
    background = bauru;
  } else if (tecSign.id === 18) {
    background = limao;
  } else if (tecSign.id === 19) {
    background = saoLeopoldo;
  } else if (tecSign.id === 20) {
    background = araras;
  } else if (tecSign.id === 21) {
    background = rioGrande;
  } else if (tecSign.id === 22) {
    background = farroupilha;
  } else {
    background = undefined;
  }

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [40, 100, 40, 40],
    background: background
      ? {
          image: background,
          width: 595.28,
          height: 841.89,
          absolutePosition: { x: 0, y: 0 },
        }
      : undefined,
    content: [
      {
        text: "ADITIVO DE PRESTAÇÃO DE SERVIÇOS \n\n",
        fontSize: 13,
        bold: true,
        alignment: "center",
      },
      {
        text: processText(
          `Entre *${name}*, com sede na *${road}*, *${number}* *${
            complement ? complement : ""
          }* - *${neighborhood}*, *${city}*/*${state}*, registrada no *${
            cpfcnpj.length >= 18 ? `CNPJ` || cpfcnpj.length === 14 : `CPF`
          }*, sob o nº *${cpfcnpj}*, doravante designada CONTRATANTE, e *${
            tecSign.socialReason
          }* com sede na *${tecSign.address}* registrada no CNPJ nº *${
            tecSign.cnpj
          }* neste ato representada pelo seu sócio gerente, abaixo assinado, doravante designada CONTRATADA, tem entre si justo e acertado este Contrato, mediante as cláusulas e condições que seguem:`
        ),
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
        text: processText(
          `\nCONTRATANTE \nNOME: ${name} \n${
            cpfcnpj.length >= 18 ? `CNPJ` || cpfcnpj.length === 14 : `CPF`
          }: ${cpfcnpj}\n\n`
        ),
      },
      {
        text: processText(
          `UNICONTROL \nNOME: ${tecSign.responsibleName}\nCPF: ${tecSign.cpf}`
        ),
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
