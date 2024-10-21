/* eslint-disable react/prop-types */
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { logo, logoFitoLog, logoNewsis } from "../../../assets/logos/logo";

export const discountAuthorization = (employee, type, description, value, parcelas, employeeType, date, dateObj) => {
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
        text: `\n\n\nTERMO DE AUTORIZAÇÃO DE DESCONTO EM ${employeeType === "CLT" ? "FOLHA" : "NOTA"}\n\n`,
        alignment: "center",
        fontSize: 13,
      },
    {
      text: `\n\nEu ${employee.name}, ${employeeType === "CLT" ? "funcionário(a)" : "contratado(a)"} da empresa ${employee.company}, autorizo o desconto na ${employeeType === "CLT" ? "folha de pagamento mensal" : "nota de prestação de serviço mensal"}, no valor de RS ${value}, relacionado a compra ${type}, ${description ? description : "sem dscrição"} no dia ${formatData(date)}.\n\n`,
      alignment: "justify",
      fontSize: 13,
    },
    {
      text: `Desejo parcelar em ${parcelas} vezes, sendo assim descontadas nos meses seguintes.\n\n`,
      alignment: "justify",
      fontSize: 13,
    },
    {
      text: `\n\n${employeeType === "CLT" ? "Em caso de demissão, o valor restante será descontado na minha recisão" : "Em caso de contrato de serviço rescindido. ficarei obrigado a pagar de uma só vez, todas as parcelas sendo o valor total descontado na nota de serviço"}.\n\n`,
      alignment: "justify",
      fontSize: 13,
    },
    {
      text: `\n\nCanoas, ${dateObj.getDate()} de ${ExtenseMonth(dateObj)} de ${dateObj.getFullYear()}\n\n\n\n\n\n`,
      alignment: "center",
      fontSize: 13,
    },
    {
      text: "________________________________________\n",
      alignment: "center",
    },
    {
      text: `\t\t\t\t${employee.name}\n\n\n\n\n\n\n`,
      alignment: "center",
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
