import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { logo, logoFitoLog, logoNewsis } from "../../../assets/logos/logo";
dayjs.locale('pt-br');

export const suspensionTerm = (
  employee,
  suspensionData,
  date
) => {
  const suspensionTerm = async (employee, suspensionData, date, returnDate) => {
    const returnDateFormatted = dayjs(returnDate).format('DD [de] MMMM [de] YYYY');
    doc.text(`Reassumindo suas funções em ${returnDateFormatted}`, 50, 180);

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
      alignment: "center",
    },
    {
      text: "\n\nSUSPENSÃO DISCIPLINAR\n\n",
      alignment: "center",
      fontSize: 18,
      lineHeight: 1.2,
      bold: true,
    },
    {
      text: [
        `Sr(a) `,
        { text: employee.name, decoration: 'underline' },
        `, portador da CTPS nº `,
        { text: employee.ctps, decoration: 'underline' },
        `.\n\n`,
      ],
      fontSize: 12,
    },
    {
      text: [
        `Vimos com o presente notificá-lo, de que o Sr(a) está suspenso(a) do exercício de suas funções no período de `,
        { text: `${suspensionData.startDate} a ${suspensionData.endDate}`, decoration: 'underline' },
        `, em razão de:\n\n`,
      ],
      fontSize: 12,
    },
    {
      text: suspensionData.reason,
      fontSize: 12,
      alignment: 'justify',
      margin: [0, 0, 0, 20],
    },
    {
      text: `Informamos que a presente suspensão tem o intuito de evitar a reincidência ou o cometido de outra(s) falta(s) de qualquer natureza, para que não tenhamos, no futuro, de tomar as enérgicas medidas que nos são facultadas pela legislação vigente, podendo inclusive originar a sua demissão por Justa Causa. Reassumindo suas funções em ${suspensionData.returnDate}, observe as normas da empresa e aquelas reguladoras da relação de emprego.\n\n`,
      fontSize: 12,
      alignment: 'justify',
    },
    {
      text: `Canoas/RS, ${dayjs(date).format('D [de] MMMM [de] YYYY')}.\n\n\n`,
      alignment: "right",
      fontSize: 12,
    },
    {
      text: "___________________________________\nAssinatura do(a) Empregador(a)",
      alignment: "center",
      fontSize: 12,
    },
    {
      text: "\n\n\nCiente do(a) Empregado(a):\n\n",
      fontSize: 12,
    },
    {
      text: "Em: ____/_____/_____\n\n___________________________________\nAssinatura do(a) Empregado(a)",
      fontSize: 12,
    },
    {
      text: "\n\nTestemunhas: (Necessário quando o empregado negar-se a assinar a suspensão):\n\n",
      fontSize: 12,
    },
    {
      text: "___________________________________\nNome:\nRG:\n\n___________________________________\nNome:\nRG:",
      fontSize: 12,
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
}}