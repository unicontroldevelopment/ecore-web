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

export const LooseReajustmentPDF = (
  index,
  type,
  signOnContract,
  value,
  name,
  date,
  text
) => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const newValue = (valorAtual, indiceReajuste) => {
    const valorFormatado = valorAtual.replace(/\./g, "").replace(",", ".");
    const newFloat = parseFloat(valorFormatado);

    const reajustmentDecimal = indiceReajuste / 100;

    const valueReajustment = newFloat * reajustmentDecimal;

    const novoValor = newFloat + valueReajustment;

    let valorFinal = novoValor.toFixed(2).replace(".", ",");
    valorFinal = valorFinal.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return valorFinal;
  };

  const tecSign = signOnContract[0];

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
        text: `${
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
        text: `\nA presente proposta tem como objetivo, por parte da ${
          tecSign.socialReason
        }, o reajuste anual de seu contrato, previsto para o mês ${Formats.ExtenseMonth(
          date
        )} de ${new Date().getFullYear()}. Índice de ${index}%.`,
        alignment: "justify",
        margin: [0, 0, 0, 20],
      },
      {
        text: `\n${text ? text : ""}.`,
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
