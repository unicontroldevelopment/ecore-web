import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { logo, logoFitoLog, logoNewsis } from "../../../assets/logos/logo";

export const knowledgeOfMonitoring = (employee, currentDate) => {
  const formatDate = (date) => {
    return dayjs(date).locale('pt-br').format('DD [de] MMMM [de] YYYY');
  };

  const formattedDate = formatDate(currentDate);

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
      text: `\n\nTERMO DE CIÊNCIA DE MONITORAMENTO DE ATIVIDADES\n\n\n`,
      alignment: "center",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `EMPREGADOR: ${
        employee.company
      }\nEndereço: ${verificaEndereco()}, Canoas/RS\nCPNJ(MF): ${verificaCNPJ()}\n\n`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `EMPREGADO: ${employee.name}\tEstado Civil: ${employee.maritalStatus}\nNacionalidade: ${employee.nationality}\tC.T.P.S. n˚: ${employee.ctps}\nCéd de identidade n˚: ${employee.rg}\tCPF: ${employee.cpf}\n\n`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Eu, ${employee.name}, declaro que estou ciente que o EMPREGADOR (${employee.company}), e suas demais coligadas (quando aplicáveis), para fins de segurança e controle, utilizam-se de câmeras de monitoramento e rastreadores veiculares para o monitoramento das minhas atividades, bem como da minha localização. Declaro também que os VEÍCULOS DA EMPRESA, utilizados para fins de serviços, são munidos de câmeras, para fins de segurança dos empregados que utilizam veículos fins de execução de serviços e que tenho conhecimento do local onde a(s) câmera(s) esta(ão) instalada(s).\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Também declaro estar ciente que as informações e dados geradas por estes meios constituem prova legal e podem ser utilizadas como justificativa para advertência e/ou demissão por justa causa em caso de constatação de conduta inapropriada por minha parte, conforme previso na CLT e demais códigos de leis brasileiras e internacionais.\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `As partes elegem o foto da comarca de Canoas-RS para dirimir qualquer controversia sobre o presente termo.\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `\n\nCanoas, ${formattedDate}\n\n\n\n`,
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
          lineWidth: 0.5,
        },
      ],
      alignment: "center",
    },
    {
      text: `${employee.name}\n\n\n\n`,
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
          lineWidth: 0.5,
        },
      ],
      alignment: "center",
    },
    {
      text: `${employee.company}\n\n\n\n`,
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
          lineWidth: 0.5,
        },
      ],
      alignment: "center",
    },
    {
      text: `\n\n\n\n`,
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