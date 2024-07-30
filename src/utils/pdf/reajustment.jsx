/* eslint-disable react/prop-types */
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

export const Reajustment = (index, type, signOnContract) => {
  const newValue = (valorAtual, indiceReajuste) => {
    const reajustmentDecimal = indiceReajuste / 100;
  
    const valueReajustment = valorAtual * reajustmentDecimal;
    const newValue = valorAtual + valueReajustment;
  
    return newValue.toFixed(2);
  };

  const tecSign = signOnContract[0].Contract_Signature;

  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const docDefinition = {
    pageSize: "A4",
    content: [
      {
        text: `\n\n\n\n\n${tecSign.city}, 25 de janeiro de 2024`,
        alignment: "right",
        margin: [0, 0, 0, 20],
      },
      {
        text: "\n\nÀ DISTRIBUIDORA MERIDIONAL DE MOTORES CUMMINS S.A",
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
        text: `\nA presente proposta tem como objetivo, por parte da UNICONTROL, o reajuste anual de seu contrato, previsto para o mês janeiro 2024. Índice de ${index}%.`,
        alignment: "justify",
        margin: [0, 0, 0, 20],
      },
      {
        table: {
          widths: [150, '*'],
          body: [
            [
              { text: 'Preço Atual', bold: true, fillColor: '#4F81BD', color: 'white' }, 
              { text: 'R$ 600,00', alignment: 'right', fillColor: 'white', color: 'black' }
            ],
            [
              { text: 'Novo Valor', bold: true, fillColor: '#4F81BD', color: 'white' }, 
              { text: `R$ ${newValue(600, index)}`, alignment: 'right', fillColor: 'white', color: 'black' }
            ],
            [
              { text: 'Índice Reajuste', bold: true, fillColor: '#4F81BD', color: 'white' }, 
              { text: `${type}`, alignment: 'right', fillColor: 'white', color: 'black' }
            ],
            [
              { text: 'Porcentagem Índice', bold: true, fillColor: '#4F81BD', color: 'white' }, 
              { text: `${index}%`, alignment: 'right', fillColor: 'white', color: 'black' }
            ]
          ]
        },
        layout: {
          hLineColor: function (i, node) {
            return i === 0 || i === node.table.body.length ? 'black' : 'gray';
          },
          vLineColor: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 'black' : 'gray';
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
            width: 'auto',
            text: 'Mobile: +55 (51) 98404.1466',
            link: 'tel:+5551984041466',
            decoration: 'underline'
          },
          {
            width: 'auto',
            text: '|'
          },
          {
            width: 'auto',
            text: 'Web: http://www.unicontrol.net.br',
            link: 'http://www.unicontrol.net.br',
            decoration: 'underline'
          }
        ],
        alignment: 'center',
        margin: [170, 0, 0, 10]
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