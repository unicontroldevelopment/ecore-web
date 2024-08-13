/* eslint-disable react/prop-types */
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { logo, logoFitoLog, logoNewsis } from "../../../assets/logos/logo";
import { Formats } from "../../formats";

export const adhesionTermPPO = (employee) => {

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
      alignment: "left",
    },
    {
      text: `\n\nTERMO DE ADESÃO AOS PROGRAMAS DE BONIFICAÇÃO DA ÁREA OPERACIONAL\n\n\n`,
      alignment: "center",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Eu ${employee.name} inscrito(a) no CPF/MF sob o n° ${employee.cpf} funcionário(a) da ${employee.company} abaixo firmado(a), solicito minha inclusão no Programa de Premiação Operacional (PPO). Declaro, também, estar ciente das regras do programa, detalhadas abaixo:`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `\nPremiação 01: Bônus de Não Cancelamento\n`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `1) Periodicidade da premiação: trimestral\n`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `2) Estão aptos a receber este benefício os funcionários que ocupam as seguintes posições: Controlador de Pragas Júnior, Controlador de Pragas Pleno e Controlador de Pragas Sênior\n\na. Critérios de Avaliação para Operadores Roteiro (aquele que atende contratos recorrentes)
      \n  I. Nenhum Cancelamento no Trimestre = Bônus de R$ 200,00
      \n  II. Até 1 cancelamento no Trimestre = Bônus de R$ 100,00
      \n  III. 2 ou mais cancelamentos no Trimestre = Bônus de R$ 0,00
      \nb. Critérios de Avaliação para Operadores de Avulso (aquele que atende serviços avulsos)
      \n  I. Média do PPO no trimestre é superior (ou igual) a 85% = Bônus de R$ 200,00
      \n  II. Média do PPO no trimestre é superior (ou igual) a 75% e inferior a 85% = Bônus de R$ 100,00
      \n  III. Média do PPO no trimestre é inferior a 75% = Bônus de R$ 0,00`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `ADICIONAL: Caso o controlador de pragas tenha mais de 18 meses de empresa e média do PPO superior à 90% no trimestre, ele recebe R$ 150,00 adicionais em sua bonificação.\nObservação1: Este premiação é paga em Ticket-alimentação.\nObservação 2: 15% do valor desta premiação é descontado dos vencimentos do controlador de pragas, conforme a legislação vigente;\nObservação 3: Cada cancelamento é avaliado pela diretoria e departamento comerical da empresa, podendo ser excluído da conta de cancelamentos, se o motivo de tal cancelamento for considerado completamente irreversível, não levando em conta a qualidade do trabalho do operador. \nExemplo: final de período licitatório;\n término de obra atendida;\n fechamento do estabelecimento comercial. \nObservação 4: Para Operadores Roteiro, cada falta (justificado, ou não) conta como 1 cancelamento.\nData de Pagamento: O pagamento do Bônus de Não Cancelamento é disponbilizado aos controladores de pragas até o 25º dia do mês subsequente ao fechamento do trimestre avaliado. \nInício da Vigência: Premiação Vigente\n`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Premiação 02: Qualidade em Serviço: PPO (PROGRAMA DE PREMIAÇÃO OPERACIONAL)\n`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `\n1) Periodicidade da premiação: mensal (acompanhando o período de ponto (de 01 do mês anterior até 30/31 do mês vigente), sendo pago até o dia 25 útil do mês subsequente a avaliação; \n2) Estão aptos a receber este benefício os funcionários que ocupam as seguintes posições: Controlador de Pragas Júnior, Controlador de Pragas Pleno e Controlador de Pragas Sênior. \n3) O prêmio Qualidade em Serviço possuirá valor máximo de R$ 140,00 (em Ticket alimentação ou combustível). Este valor máximo é atingido caso todas as metas abaixo sejam plenamente atingidas.\n`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `\na) Qualidade no serviço \nb) Proatividade \nc) Documentação \nd) Cuidados Pessoais \ne) A premiação será zerada se houver alguma das seguintes situações\n`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `\n*Advertência; \n*Suspensão; \n*Trabalhar menos que 15 dias no mês; \n*Falta sem justificativa; \n*Atestado superior a 1 dia de afastamento (1 dia de atestado não zera, mas reduz a premiação geral em 50%, passando a ser de R$ 70,00 o valor máximo); *Prejuízos/danos à empresa, causados pelo
      funcionário.\nObs(A): Qualquer ocorrência de repasse solicitada pelos clientes é inserida em uma das planilhas de “Controle de Ocorrências de Serviços” (SERRA, CANOAS, e/ou outra unidade), pelo departamento de operações/agendamentos. De acordo com as informações disponíveis, recebidas e/ou coletadas, o departamento de operações/agendamentos irá classificar a ocorrência como “Não Conformidade de Qualidade” ou “Padrão”. A primeira refere-se a problemas decorrentes da falta de qualidade dos serviços e/ou da não conformidade de processos contratados pelos clientes, enquanto a segunda é decorrente da fatores externos ao controle da empresa e/ou dos operadores. \nAs ocorrências de “Não Conformidade de Qualidade” contribuem para a perda do valor deste premiação, enquanto as ocorrências “Padrão”, não. \nInício da Vigência: Premiação Vigente Quero receber a premiação 02 (Qualidade em Serviço) em\n`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `\n\n( ) Ticket - Alimentação(não incide desconto de 20%)\n( ) Combustível\n\n`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `\nOutros Critérios Gerais (se aplicam a todas as três premiações):\n`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `\n1) Em caso de falta (justificada, ou não), o funcionário não se qualifica para receber NENHUMA das premiações acima descritas no mês (mesmo se a falta for abonada e/ou o mesmo for dispensado);\n2) Caso o controlador de pragas não consiga realizar 100% das visitorias que forem a ele
      designadas (operadores roteiro), ou 100% dos serviços (operadores de avulso), sem justificativa aceitável, o mesmo não se qualifica para receber NENHUMA das premiações acima descritas no mês. \n3) No caso de o controlador de pragas ser designado para deixar uma nota fiscal em um cliente e não cumprir esta tarefa, sem justificativa aceitável, o mesmo não se qualifica para receber NENHUMA das premiações acima descritas no mês.\n4) Caso o controlador de pragas trabalhe menos de 15 dias no mês (férias, licença, primeiro mês de trabalho, etc) o mesmo não se qualifica para receber NENHUMA das premiações acima descritas no mês (a exceção do Bônus de não cancelamento cuja base é trimestral. Neste caso, o controlador deve trabalhar, no mínimo, mais de 45 dias no trimestre). \n5) Os valores de prejuízos e danos causados à empresa irão descontar a premiação recebida até a totalidade do valor necessário para o ressarcimento. \n6) Em nenhum dos casos é oferecida premiação em dinheiro. Os únicos itens fornecidos como premiação são: ticket-alimentação e/ou combustível (álcool, gasolina e/ou diesel); \n7) De acordo com os artigos da CLT, nenhuma das premiações aqui descritas se caracteriza como salário; \n8) O Programa de Premiação Operacional é um projeto piloto e pode ser suspenso e/ou modificado a qualquer momento por deliberação da diretoria da UNICONTROL CONTROLE DE PRAGAS LTDA. As modificações podem ser imediatas e não necessitam comunicação prévia.\n`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `\nDeclaro que li com atenção a todas as regras do Programa de Premiação Operacional e que concordo integralmente com elas.\n`,
      alignment: "left",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `\n${verificaEndereco()}, Canoas/RS, ${new Date(
        employee.dateAdmission
      ).getDate()} de ${Formats.ExtenseMonth(
        new Date(employee.dateAdmission).getMonth() + 1
      )} de ${new Date(
        employee.dateAdmission
      ).getFullYear()}\n\n\n\n\n`,
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
