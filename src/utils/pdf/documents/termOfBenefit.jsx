/* eslint-disable react/prop-types */
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { logo, logoFitoLog, logoNewsis } from "../../../assets/logos/logo";

export const termOfBenefit = (employee, date, type) => {

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
      alignment: "center",
    },
    {
        text: `\n\n\nTERMO DE ADESÃO DO BENEFÍCIO\n\n`,
        alignment: "center",
        fontSize: 13,
      },
    {
      text: `\n\nEu ${employee.name}, portador do CPF ${employee.cpf}, ${type === "CLT" ? "funcionário(a)" : "contratado(a)"} da empresa ${employee.company}, autorizo o desconto na ${type === "CLT" ? "folha de pagamento mensal" : "nota de prestação de serviço mensal"}, referente as compras realizadas na farmácia São João, vinculadas ao convênio.\n\n`,
      alignment: "justify",
      fontSize: 13,
    },
    {
      text: `${type === "CLT" ? "Declaro que em caso de demissão. FICAREI OBRIGADO A PAGAR DE UMA SÓ VEZ, todas as parcelas vinculadas ao convênio, SENDO O VALOR TOTAL DESCONTANDO EM MINHA RESCISÃO CONTRATUAL DE TRABALHO" : "Declaro que em caso de contrato de serviço rescindido. FICAREI OBRIGADO A PAGAR DE UMA SÓ VEZ, todas as parcelas vinculadas ao convênio, SENDO O VALOR TOTAL DESCONTANDO"}.\n\n`,
      alignment: "justify",
      fontSize: 13,
    },
    {
      text: `\n\nPor todo exposto, assino de livre e espontânea vontade a presente autorização, para que produza os efeitos jurídicos necessários.\n\n`,
      alignment: "justify",
      fontSize: 13,
    },
    {
      text: `\n\nCanoas, ${date.getDate()} de ${ExtenseMonth(date)} de ${date.getFullYear()}\n\n\n\n\n\n`,
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
