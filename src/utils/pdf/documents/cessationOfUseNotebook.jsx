/* eslint-disable react/prop-types */
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { logo, logoFitoLog, logoNewsis } from "../../../assets/logos/logo";

export const cessationOfUseNotebook = (
  employee,
  notebookBrand,
  notebookProperty,
  date
) => {

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
      text: "\n\nCESSÃO DE USO DE NOTEBOOK\n",
      alignment: "center",
      fontSize: 18,
      lineHeight: 1.2,
      bold: true,
    },
    {
      text: `________________________________________________________\n\n\n\n`,
      alignment: "center",
      color: "#4C67B0",
    },
    {
      text: `Cedente: ${employee.company}, pessoa jurídica de direito privado, inscrita no CNPJ sob o número ${employee.cpf}, neste ato representado por seu(sua) PRISCILA SOUZA MEDEIROS, inscrito no CPF sob o número  003.436.240-10.\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Cessionário: ${employee.name}, inscrito no CPF sob o número ${employee.cpf}\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Cláusula primeira: A Cedente, através deste contrato e nesta data, cede ao Cessionário, o Notebook ${notebookBrand} com carregador patrimônio ${notebookProperty}.\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Cláusula segunda: O Cessionário passa a ser o único e exclusivo responsável pela guarda, conservação e manutenção do equipamento acima descrito assumindo a responsabilidade pela devolução do equipamento em perfeito estado de conservação e condições de uso.\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Parágrafo primeiro: O Cessionário deverá devolve o notebook à Cedente no mesmo estado em que o recebeu sempre e quando esta solicitar.\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Cláusula terceira: Todas as despesas com manutenção, incluindo reposição de peças, acessórios e mão-de-obra, são de inteira responsabilidade do Cessionário, ficando a Cedente autorizada a efetuar o desconto e/ou compensação das despesas que tiver sobre os créditos do Cessionário, sendo estas causadas por mau uso ou descuido do cessionário.\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Cláusula quarta: A não observância de qualquer das cláusulas acima implica na imediata resilição do presente contrato de Cessão de Uso de Notebook, obrigando o Cessionário a devolver o aparelho.\n\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `As partes elegem o foro da comarca de Canoas para dirimirem qualquer controversa sobre o presente contrato.\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Canoas/RS, ${date.getDate()} de ${ExtenseMonth(date)} de ${date.getFullYear()}.\n\n\n\n\n\n\n`,
      alignment: "center",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Data de entrega:  _____/_____/_____\n\n\n\n`,
      alignment: "left",
      fontSize: 13,
    },
    {
      text: "________________________________________\t\t\t\t\t\t________________________________________\n",
    },
    {
      text: `${employee.company}\t\t\t\t\t\t${employee.name}\n\n\n\n\n\n\n`,
    },
    {
      text: `Data de devolução:  _____/_____/_____\n\n\n\n`,
      alignment: "left",
      fontSize: 13,
    },
    {
      text: "________________________________________\t\t\t\t\t\t________________________________________\n",
    },
    {
      text: `${employee.company}\t\t\t\t\t\t${employee.name}\n\n\n\n`,
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
