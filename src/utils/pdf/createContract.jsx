/* eslint-disable react/prop-types */
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { logo } from "../../assets/logos/logo";

export const MyDocument = ({
  name,
  cpfcnpj,
  cep,
  road,
  number,
  complement,
  neighborhood,
  city,
  state,
  contractNumber,
  date,
  value,
  index,
  signOnContract,
  contracts_Service,
  clauses,
}) => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const content = clauses.map((clause) => ({
    text: clause.description,
    fontSize: 12,
    alignment: "justify",
    margin: [0, 0, 0, 10],
  }));

  const tecSign = signOnContract[0].Contract_Signature;

  const docDefinition = {
    pageSize: "A4",
    content: [
      {
        image: logo,
        width: 150,
        alignment: "center",
      },
      {
        text: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS",
        fontSize: 13,
        bold: true,
        alignment: "center",
      },
      { text: "N°1", fontSize: 13, alignment: "center", margin: [0, 0, 0, 20] },
      {
        text: `Entre ${name}, com sede na ${road}, ${number} - ${neighborhood}, ${city}/${state}, registrada no ${
          cpfcnpj.length >= 18 ? `CNPJ` || cpfcnpj.length === 14 : `CPF`
        }, sob o nº ${cpfcnpj}, doravante designada CONTRATANTE, e ${
          tecSign.socialReason
        } com sede na ${tecSign.address} registrada no CNPJ nº ${
          tecSign.cnpj
        } neste ato representada pelo seu sócio gerente, abaixo assinado, doravante designada CONTRATADA, tem entre si justo e acertado este Contrato, mediante as cláusulas e condições que seguem:`,
        fontSize: 12,
        alignment: "justify",
        margin: [0, 0, 0, 10],
      },
      ...content,
      {
        text: `\nCONTRATANTE \nNOME: ${name} \n${
          cpfcnpj.length >= 18 ? `CNPJ` || cpfcnpj.length === 14 : `CPF`
        }: ${cpfcnpj}\n\n`,
      },
      {
        text: `UNICONTROL \nNOME: ${tecSign.responsibleName}\nCPF: ${tecSign.cpf}\n\nTESTEMUNHAS\n\n\n\n\n`,
      },
      {
        text: "Anexo 1 \n\nO Programa Anual de Controle Integrado de Pragas da Unicontrol foi cuidadosamente desenvolvido por profissionais de nosso próprio corpo funcional e de comprovado reconhecimento no mercado. Estamos em permanente pesquisa, evoluindo em tecnologia, métodos e produtos para o efetivo controle de pragas.\nSabemos, entretanto, que a eficácia do tratamento somente alcança sucesso com a parceria de nossos clientes contratantes, quando adotam medidas preventivas,  adequam ou modificam hábitos comportamentais.  Pedimos assim, sua atenção para o que segue:  \n\n1) HIGIENIZAÇÃO E SANITIZAÇÃO: \n\n• Desengorduramento de superfícies, com limpeza úmidas e quentes, através de mangueiras ou vaporeto. \n\n• Raspagem de camadas de gordura incrustadas em tampos e grelhas de fogões, coifas, etc. Retirada de excesso de poeira. \n\n• Limpeza detalhada de equipamentos, como masseiras, sanduicheiras, espremedores de sucos, etc. \n\nObs.: Quando pulverizados em superfícies gordurosas e sujas, os inseticidas têm uma eficácia reduzida e degradam-se com rapidez. \n\n1) ORGANIZAÇÃO E MANEJO AMBIENTAL \n\n• Descarte de materiais desnecessários; \n\n• Estocagem de material de acordo com as normas sanitárias, em estrados afastados da parede entre si e suspensos do chão.\n\n• Vedação ou selagem de frestas, com silicone, cimento ou massa de vidraceiro (como juntas de azulejos,esquadrias danificadas e soltas de portas e janelas, etc). \n\n• Uso de cantoneiras de alumínio em junções de paredes de azulejo ou alvenaria. \n\n• Manejo de peças do mobiliário, com vedação de vãos de pés tubulares de mesas e cadeiras. \n\n• Eliminação de pontos de vazamento de água (encanamentos, motores e bombas elétricas). \n\n• Bloqueio de vias de acesso, com acessórios de exclusão física (lâminas com borrachas de vedação na parte inferior de portas, tampas de ralos com escotilhas deslizantes, telamento de vãos, etc.) \n\n1) CONSCIENTIZAÇÃO E EDUCAÇÃO AMBIENTAL \n\n- Utilização de material educativo, com folhetos ou circulares sobre o assunto, visando desenvolver hábitos e comportamentos preventivos contra a proliferação de pragas.",
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
