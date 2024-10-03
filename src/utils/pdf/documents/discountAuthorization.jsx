/* eslint-disable react/prop-types */
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { logo, logoFitoLog, logoNewsis } from "../../../assets/logos/logo";
import { Formats } from "../../formats";

export const discountAuthorization = (employee) => {
  const verificaDesconto = () => {
    if (employee.company === "NEWSIS SISTEMAS E SERVIÇOS DE INTERNET LTDA") {
      return "10%";
    } else if (employee.company === "UNICONTROL CONTROLE DE PRAGAS LTDA") {
      return "19%";
    } else if (employee.company === "FITOLOG LICENCIAMENTO DE FRANQUIAS LTDA") {
      return "10%";
    } else {
      return "19%";
    }
  };

  const verificaCNPJ = () => {
    if (employee.company === "NEWSIS SISTEMAS E SERVIÇOS DE INTERNET LTDA") {
      return "28.008.830/0001-84";
    } else if (employee.company === "UNICONTROL CONTROLE DE PRAGAS LTDA") {
      return "11.486.771/0001-57";
    } else if (employee.company === "FITOLOG LICENCIAMENTO DE FRANQUIAS LTDA") {
      return "10.420.329/0001-65";
    } else {
      return "11.486.771/0001-57";
    }
  };

  const verificaEndereco = () => {
    if (employee.company === "NEWSIS SISTEMAS E SERVIÇOS DE INTERNET LTDA") {
      return "Rua Márcio Toboliski Fernandes, 41, Sala 4";
    } else if (employee.company === "UNICONTROL CONTROLE DE PRAGAS LTDA") {
      return "Rua Márcio Toboliski Fernandes, 41";
    } else if (employee.company === "FITOLOG LICENCIAMENTO DE FRANQUIAS LTDA") {
      return "Rua Márcio Toboliski Fernandes, 41, Sala 2";
    } else {
      return "Rua Márcio Toboliski Fernandes, 41";
    }
  };

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

  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const content = [
    {
      image: verificaImagemDoDocumento(),
      width: 150,
      alignment: "center",
    },
    {
      text: `\n\n\nAUTORIZAÇÃO DE DESCONTO\nEmpregador: ${
        employee.company
      }\nCNPJ: ${verificaCNPJ()}\nSito à: ${verificaEndereco()}, Canoas/RS\n\n\n\n`,
      alignment: "center",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Autorizo descontarem mensalmente, e por tempo indeterminado, dos meus vencimentos, as importâncias relativas aos itens assinalados com "Sim".\n\n\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: "De acordo                 Identificação do desconto\n\n",
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `(    ) SIM (    ) NÃO - Mensalidade de sócio do sindicato.\n(    ) SIM (    ) NÃO - Desconto de ${verificaDesconto()} do Vale Refeição fornecido pela empresa.\n(    ) SIM (    ) NÃO - Vale Transporte na forma prevista no D.L. 95.247/87.\n(    ) SIM (    ) NÃO - Ligações Telefônicas.\n(    ) SIM (    ) NÃO - Desconto de 50% do Convenio Médico fornecido pela Empresa.\n(    ) SIM (    ) NÃO - Desconto de 100% do Convenio Médico fornecido pela Empresa para dependentes.\n\n\n\n`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Em ${new Date(employee.dateAdmission).getDate()} de ${Formats.ExtenseMonth(
        new Date(employee.dateAdmission).getMonth() + 1
      )} de ${new Date(employee.dateAdmission).getFullYear()}\n\n\n\n\n\n`,
      alignment: "center",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 5,
          x2: 300 - 2 * 40,
          y2: 5,
          lineWidth: 0.6,
        },
      ],
      alignment: "center",
    },
    {
      text: `${employee.name}`,
      alignment: "center",
      fontSize: 13,
      lineHeight: 1.2,
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
