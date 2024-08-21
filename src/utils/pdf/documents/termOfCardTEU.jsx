/* eslint-disable react/prop-types */
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { logo, logoFitoLog, logoNewsis } from "../../../assets/logos/logo";

export const termOfCardTEU = (employee, values, date) => {

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
      text: `\n\n\nTERMO DE RESPONSABILIDADE CARTÃO TEU\n\n`,
      alignment: "center",
      fontSize: 13,
    },
    {
      text: `\n\nTermo de responsabilidade e outras avenças que fazem, entre si, de um lado, EMPREGADOR, definido como ${employee.company}, e de outro ${employee.name}, doravante designado EMPREGADO, mediante as seguintes condições:\n\n1. O EMPREGADO declara que recebe, neste ato, a primeira via do CARTÃO TEU VALE-TRANSPORTE, Nº ${values.number} destinado a utilização no Sistema de Transporte de Passageiros na Região Metropolitana das operadoras pertencentes ao Teu Consórcio Gestor, ficando o citado cartão, a partir desta data, sob sua guarda e responsabilidade.\n\n2. O CARTÃO TEU VALE-TRANSPORTE é pessoal e intransferível, sendo de responsabilidade exclusiva do EMPREGADO o uso indevido do mesmo, inclusive por terceiros. Ficando o EMPREGADO responsável por perdas e danos decorrentes do seu ato.\n\n3. O CARTÃO TEU VALE-TRANSPORTE deve ser manuseado com cuidado, evitando-se sempre o contato com as mãos ou com outros materiais no respectivo chip eletrônico.\n\n4. O CARTÃO TEU VALE-TRANSPORTE não pode ser dobrado, perfurado amassado ou molhado. Não deixá-lo exposto ao sol, calor e agentes abrasivos; não riscar; não escrever no mesmo ou sobre o mesmo, não afixar adesivos nos cartões.\n\n5. O CARTÃO TEU VALE-TRANSPORTE, quando não estiver sendo usado pelo EMPREGADO, devera estar em local seco e ao abrigo da luz solar direta.\n\n6. Em caso de perda ou dano injustificados, arcará o EMPREGADO com o custo da emissão de segunda via do CARTÃO TEU VALE-TRANSPORTE, no valor de R$ ${values.value} a unidade, autorizando, desde já, o desconto do valor no salário do mês respectivo da emissão de segunda via.\n\n7. No caso de rescisão do contrato de trabalho do EMPREGADO, o CARTÃO TEU VALE-TRANSPORTE deverá ser devolvido à empresa, sob pena de desconto do valor previsto no item anterior, o qual fica desde já, expressamente autorizado, a ser procedido nas verbas rescisórias.`,
      alignment: "justify",
      fontSize: 13,
    },
    {
      text: `\n\nCanoas, ${date.getDate()} de ${ExtenseMonth(date)} de ${date.getFullYear()}\n\n\n\n\n\n\n\n\n\n\n\n\n\n`,
      alignment: "center",
      fontSize: 13,
    },
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 5,
          x2: 300 - 2 * 40,
          y2: 5,
          lineWidth: 0.5,
        },
      ],
      alignment: "center",
    },
    {
      text: `${employee.company}\n\n\n\n\n\n\n`,
      alignment: "center",
      fontSize: 13,
    },
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 5,
          x2: 300 - 2 * 40,
          y2: 5,
          lineWidth: 0.5,
        },
      ],
      alignment: "center",
    },
    {
      text: `${employee.name}`,
      alignment: "center",
      fontSize: 13,
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
