/* eslint-disable react/prop-types */
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {
    baciaDoJacui,
    canaa,
    canoas,
    erechim,
    esteio,
    floresDaCunha,
    limao,
    lucena,
    master,
    poaCentro,
    poaZN,
    recife,
    saoLourenco,
    vacaria,
    valeDosSinos,
} from "../../assets/folhas/folhas";
import { Formats } from "../formats";

export const LooseReajustmentPDF = (index, type, signOnContract, value, name, date) => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const newValue = (valorAtual, indiceReajuste) => {
    const newFloat = parseFloat(valorAtual.replace(",", "."));
    const reajustmentDecimal = indiceReajuste / 100;

    const valueReajustment = newFloat * reajustmentDecimal;
    const newValue = newFloat + valueReajustment;

    const value = newValue.toFixed(2);

    return value;
  };

  const tecSign = signOnContract[0];

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
    background = undefined;
  } else if (
    tecSign.socialReason === "FRANPRAG ESTEIO RS 28 - CONTROLE DE PRAGAS LTDA"
  ) {
    background = esteio;
  } else if (
    tecSign.socialReason ===
    "FRANPRAG POA CENTRO RS 25 - CONTROLE DE PRAGAS LTD..."
  ) {
    background = poaCentro;
  } else if (
    tecSign.socialReason === "UNICONTROL BARDEEN CONTROLE DE PRAGAS LTDA"
  ) {
    background = recife;
  } else if (
    tecSign.socialReason === "FRANPRAG BAURU SP 17 CONTROLE DE PRAGAS LTDA"
  ) {
    background = canaa;
  } else if (
    tecSign.socialReason === "FRANPRAG BAURU SP 17 CONTROLE DE PRAGAS LTDA"
  ) {
    background = limao;
  } else {
    background = undefined;
  }

  const docDefinition = {
    pageSize: "A4",
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
        text: `\n\n\n\n\n${
          tecSign.city
        }, ${new Date().getDate()} de ${Formats.ExtenseMonth(
          date
        )} de ${new Date().getFullYear()}.`,
        alignment: "right",
        margin: [0, 0, 0, 20],
      },
      {
        text: `\n\nÀ ${name}`,
        bold: true,
        margin: [0, 0, 0, 20],
      },
      {
        text: "\nRENOVAÇÃO CONTRATO – REAJUSTE ANUAL",
        alignment: "center",
        bold: true,
        fontSize: 14,
        margin: [0, 0, 0, 20],
      },
      {
        text: `\nA presente proposta tem como objetivo, por parte da ${tecSign.socialReason}, o reajuste anual de seu contrato, previsto para o mês ${Formats.ExtenseMonth(
            date
          )} de ${new Date().getFullYear()}. Índice de ${index}%.`,
        alignment: "justify",
        margin: [0, 0, 0, 20],
      },
      {
        table: {
          widths: [150, "*"],
          body: [
            [
              {
                text: "Preço Atual",
                bold: true,
                fillColor: "#4F81BD",
                color: "white",
              },
              {
                text: `R$ ${value}`,
                alignment: "right",
                fillColor: "white",
                color: "black",
              },
            ],
            [
              {
                text: "Novo Valor",
                bold: true,
                fillColor: "#4F81BD",
                color: "white",
              },
              {
                text: `R$ ${newValue(value, index)}`,
                alignment: "right",
                fillColor: "white",
                color: "black",
              },
            ],
            [
              {
                text: "Índice Reajuste",
                bold: true,
                fillColor: "#4F81BD",
                color: "white",
              },
              {
                text: `${type}`,
                alignment: "right",
                fillColor: "white",
                color: "black",
              },
            ],
            [
              {
                text: "Porcentagem Índice",
                bold: true,
                fillColor: "#4F81BD",
                color: "white",
              },
              {
                text: `${index}%`,
                alignment: "right",
                fillColor: "white",
                color: "black",
              },
            ],
          ],
        },
        layout: {
          hLineColor: function (i, node) {
            return i === 0 || i === node.table.body.length ? "black" : "gray";
          },
          vLineColor: function (i, node) {
            return i === 0 || i === node.table.widths.length ? "black" : "gray";
          },
        },
        margin: [100, 0, 100, 0],
      },
      {
        text: "\n\nO Escopo do Contrato permanece inalterado.",
        alignment: "justify",
        margin: [150, 0, 0, 20],
      },
      {
        text: "\n\nJennifer Lemos",
        bold: true,
        margin: [400, 0, 0, 5],
      },
      {
        text: "Customer Success",
        margin: [400, 0, 0, 20],
      },
      {
        columns: [
          {
            width: "auto",
            text: "Mobile: +55 (51) 98404.1466",
            link: "tel:+5551984041466",
            decoration: "underline",
          },
          {
            width: "auto",
            text: "|",
          },
          {
            width: "auto",
            text: "Web: http://www.unicontrol.net.br",
            link: "http://www.unicontrol.net.br",
            decoration: "underline",
          },
        ],
        alignment: "center",
        margin: [170, 0, 0, 10],
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
