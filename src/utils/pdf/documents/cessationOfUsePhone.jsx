/* eslint-disable react/prop-types */
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { logo } from "../../../assets/logos/logo";

export const cessationOfUsePhone = (employee, phone, date) => {
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
      image: logo,
      width: 150,
      alignment: "left",
    },
    {
      text: "\n\nTERMO DE ENTREGA DE CELULAR\n",
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
      text: `Cedente: ${
        employee.company
      } pessoa jurídica de direito privado, inscrita no CNPJ sob o número ${verificaCNPJ()} neste ato representado por seu(sua) PRISCILA SOUZA MEDEIROS, inscrito no CPF sob o número  003.436.240-10.\n\n`,
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
      text: `Cláusula primeira: A Cedente, através deste contrato e nesta data, cede ao Cessionário, o aparelho celular da marca ${phone.brand}, modelo ${phone.model} com os seguintes acessórios: ${phone.acessories}, com o IMEI ${phone.imei}. O aparelho descrito nesse formulário tem o valor de R$${phone.value}, a situação do celular é ${phone.state}.\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Cláusula segunda: O Cessionário passa a ser o único e exclusivo responsável pela guarda, conservação e 	manutenção   do aparelho celular, acima   descrito   assumindo   a   responsabilidade pela devolução do celular em perfeito estado de conservação e condições de uso.\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Parágrafo primeiro: O Cessionário deverá restituir o aparelho à Cedente no mesmo estado em que o recebeu, salvo desgaste natural do uso, sempre, e quando, esta solicitar.\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Cláusula terceira: A tarifa referente ao uso do equipamento em serviço e em consequência deste, será paga mensalmente pela Cedente, na data aprazada, sem implicar qualquer ônus ao Cessionário.\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Parágrafo primeiro:  A Cedente reserva-se o direito de cobrar do Cessionário a tarifa apurada em desconformidade com a cláusula acima e a eventual responsabilidade derivada do mau uso do equipamento.\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Cláusula quarta: Todas as despesas com manutenção, incluindo reposição de peças, acessórios e mão-de-obra, são de inteira responsabilidade do Cessionário, ficando a Cedente autorizada a efetuar o desconto e/ou compensação das despesas que tiver sobre os créditos do Cessionário, sendo o desconto efetuado em folha de pagamento.\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Parágrafo primeiro: Fica o cessionário ciente do desconto a danos causados nos aparelhos de celulares cedidos pela empresa, os danos serão cobrados em folha de pagamento.\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Cláusula quinta:  A não observância de qualquer das cláusulas acima implica na imediata resilição do presente contrato de Cessão de Uso de Aparelho Celular, autorizando a Cedente a bloquear o número e o serial junto à operadora e obrigando o Cessionário a devolver o aparelho.\n\nAs partes elegem o foro da comarca de Canoas-RS para dirimirem qualquer controversa sobre o presente contrato.\n\n\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Canoas/RS, ${date.getDate()} de ${ExtenseMonth(date)} de ${date.getFullYear()}.\n\n\n\n`,
      alignment: "center",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: "________________________________________\t\t\t\t\t\t________________________________________\n\n",
    },
    {
      text: `${employee.company}\t\t\t\t\t\t${employee.name}\n\n`,
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
