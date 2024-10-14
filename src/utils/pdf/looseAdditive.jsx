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

  if (tecSign.socialReason === "UNICONTROL CONTROLE DE PRAGAS LTDA") {
    background = canoas;
  } else if (
    tecSign.socialReason ===
    "FRANPRAG BACIA DO JACUI RS 06 - CONTROLE DE PRAGAS LTDA"
  ) {
    background = baciaDoJacui;
  } else if (tecSign.socialReason === "EVERTON LISANDRO DE OLIVEIRA MESQUITA") {
    background = poaZN;
  } else if (
    tecSign.socialReason === "FRANPRAG VACARIA RS 01 - CONTROLE DE PRAGAS LTDA"
  ) {
    background = vacaria;
  } else if (
    tecSign.socialReason ===
    "FRANPRAG SAO LOURENCO DO OESTE SC 05 - CONTROLE DE PRAGAS LTDA"
  ) {
    background = saoLourenco;
  } else if (
    tecSign.socialReason ===
    "FRANPRAG VALE DOS SINOS RS 03 CONTROLE DE PRAGAS LTDA"
  ) {
    background = valeDosSinos;
  } else if (
    tecSign.socialReason === "FRANPRAG MASTER SPA 11 CONTROLE DE PRAGAS LTDA"
  ) {
    background = master;
  } else if (
    tecSign.socialReason === "FRANPRAG ERECHIM RS 04 CONTROLE DE PRAGAS LTDA"
  ) {
    background = erechim;
  } else if (
    tecSign.socialReason ===
    "FRANPRAG CANAA DOS CARAJAS PA 22 - CONTROLE DE PRAGAS LTDA"
  ) {
    background = canaa;
  } else if (tecSign.socialReason === "QUALITY CONTROLE DE PRAGAS LTDA") {
    background = floresDaCunha;
  } else if (
    tecSign.socialReason ===
    "FRANPRAG PRESIDENTE LUCENA RS 30 - CONTROLE DE PRAGAS"
  ) {
    background = lucena;
  } else if (
    tecSign.socialReason ===
    "FRANPRAG CANOAS CENTRO RS 27 - CONTROLE DE PRAGAS "
  ) {
    background = canoas;
  } else if (
    tecSign.socialReason === "UNICONTROL PASTEUR CONTROLE DE PRAGAS LTDA"
  ) {
    background = orizona;
  } else if (
    tecSign.socialReason === "FRANPRAG ESTEIO RS 28 - CONTROLE DE PRAGAS LTDA"
  ) {
    background = esteio;
  } else if (
    tecSign.socialReason ===
    "FRANPRAG POA CENTRO RS 25 - CONTROLE DE PRAGAS LTDA"
  ) {
    background = poaCentro;
  } else if (
    tecSign.socialReason === "UNICONTROL BARDEEN CONTROLE DE PRAGAS LTDA"
  ) {
    background = recife;
  } else if (
    tecSign.socialReason === "FRANPRAG BAURU SP 17 CONTROLE DE PRAGAS LTDA"
  ) {
    background = bauru;
  } else if (
    tecSign.socialReason === "FRANPRAG BAURU SP 17 CONTROLE DE PRAGAS LTDA"
  ) {
    background = limao;
  } else if (tecSign.socialReason === "FRANPRAG SAO LEOPOLDO RS 07 - CONTROLE DE PRAGAS LTDA") { 
    background = saoLeopoldo;
  } else if (tecSign.socialReason === "FRANPRAG ARARAS SP 34 CONTROLE DE PRAGAS LTDA") { 
    background = araras;
  } else if (tecSign.socialReason === "UNICONTROL CARSON CONTROLE DE PRAGAS LTDA") { 
    background = rioGrande;
  } else {
    background= undefined
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
