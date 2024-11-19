/* eslint-disable react/prop-types */
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { logo, logoFitoLog, logoNewsis } from "../../../assets/logos/logo";

export const experienceContract = (employee) => {
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

  const verificaCargo = () => {
    if(employee.office === "Controlador de Pragas") {
      return `Segunda-feira: das 8:00 às 12:00 e das 13:00 às 17:30\nTerça-feira: das 8:00 às 12:00 e das 13:30 às 17:30\nQuarta-feira: das 8:00 às 12:00 e das 13:30 às 17:30\nQuinta-feira: das 8:00 às 12:00 e das 13:30 às 17:30\nSexta-feira: das 8:00 às 12:00 e das 13:30 às 17:30\nSábado: das 8:00 às 12:00\n\n`
    } else {
      return `Segunda-feira: das 8:00 às 12:00 e das 13:00 às 18:00\nTerça-feira: das 8:00 às 12:00 e das 13:00 às 18:00\nQuarta-feira: das 8:00 às 12:00 e das 13:00 às 18:00\nQuinta-feira: das 8:00 às 12:00 e das 13:00 às 18:00\nSexta-feira: das 8:00 às 12:00 e das 13:00 às 17:00\n\n`
    }
  }

  const verificaFolgas = () => {
    if(employee.office === "Controlador de Pragas") {
      return `Com 1 dia de folga semanal.\n\n`
    } else {
      return `Com 2 dias de folga semanal.\n\n`
    }
  }

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
      text: `\n\nCONTRATO DE TRABALHO POR EXPERIÊNCIA\n\n\n`,
      alignment: "center",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `EMPREGADOR: ${
        employee.company
      }\nENDEREÇO: ${verificaEndereco()}, Canoas/RS\nCNPJ: ${verificaCNPJ()}\nEMPREGADO: ${employee.name}\tESTADO CIVIL: ${
        employee.maritalStatus
      }\nENDEREÇO: ${employee.road}, ${
        employee.number
      }\nBAIRRO: ${employee.neighborhood}\tCIDADE: ${
        employee.city
      }\nNACIONALIDADE: ${employee.nationality}\tCTPS: ${
        employee.ctps
      }\nIDENTIDADE: ${employee.rg}\tCPF: ${
        employee.cpf
      }\t PIS: ${employee.pis}\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `EMPREGADOR (e coligadas, quando aplicável), por seu representante legal, e EMPREGADO(A), ambos, acima qualificados e abaixo assinados, ajustam e convencionam o presente instrumento de Contrato de Trabalho Experimental, que se regerá mediante as seguintes cláusulas e condições:\n\n1. O empregador admite o(a) empregado(a) para o exercício do cargo de ${employee.office}, CBO n°: ${employee.cbo}\n\n2. O empregador pagará ao empregado o Salário Mensal de R$ ${employee.initialWage} sendo o respectivo pagamento efetuado até o 5° DIA ÚTIL DO MÊS SEGUINTE, este salário é correspondente à 220 horas mensais.\n\n2.1. O empregador poderá estipular bonificações ao empregado, as quais serão objeto de instrumento por escrito em separado.\n\n3. O local de trabalho do empregado será INTERNO/EXTERNO, executando suas atividades na localidade de Canoas/RS e região metropolitana de POA, podendo executar serviços na sede da empresa, em outras filias e localidades/regiões, conforme determinações do empregador.\n\n4.O horário de trabalho do empregado irá seguir o padrão detalhado abaixo:\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: verificaCargo(),
      alignment: "center",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: verificaFolgas(),
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `4.1. Empregador e empregado acordam desde já que o horário de almoço (art. 71, da CLT) do segundo poderá ser alterado e/ou estendido, (considerando a especificidade dos serviços, visando não prejudicar atividades dos clientes), não podendo, entretanto, ser inferior a 1 hora. O intervalo de almoço, mesmo que superior ao limite contratual ou legal não caracteriza tempo à disposição do empregador e não enseja pagamento de horas extras.\n\n4.2  A não concessão ou a concessão parcial do intervalo intrajornada mínimo, para repouso e alimentação, implica o pagamento, de natureza indenizatória, apenas do período suprimido, com acréscimo de 50% (cinquenta por cento) sobre o valor da remuneração da hora normal de trabalho, conforme artigo 71, §4º, da CLT\n\n5. Empregador e empregado, expressamente, convencionam que caberá ao primeiro, se assim o desejar, a implantação temporária ou definitiva do regime de supressão parcial ou total do trabalho em um dia da semana, ocorrendo a compensação do horário suprimido através de trabalho excedente nos demais dias da aludida semana, nos termos do art. 59, parágrafo 2º e 60, da Consolidação das Leis do Trabalho.\n\n5.1. O empregador poderá estabelecer horário diverso no estabelecido na cláusula 4, considerando a especificidade do serviço, visando não coincidir ou prejudicar atividades de clientes, sendo que eventuais horários realizados fora do padrão estabelecido na cláusula 4, não ensejarão descontos nos salários ou pagamento de horas extras se respeitado o tempo de trabalho diário e semanal pactuado.\n\n6. Empregado e empregador, ainda, de modo formal, estipulam que, nos casos previstos no art. 61, parágrafo 30. da Consolidação antes aludida, poderá o empregador usar dos direitos de recuperação do tempo perdido.\n\n7. Fica expressamente convencionado que poderá o empregador ampliar o horário normal de trabalho em mais e até duas horas diárias, em regime de compensação, nos termos do artigo 59, 2º e 5º, da CLT. Não havendo adoção de regime de banco de horas, as horas trabalhadas além da duração normal será acrescida dos adicionais legais.\n\n8. O empregado poderá ser transferido de um para outro local de trabalho e, também, de um para outro horário de trabalho, de acordo com a necessidade e critério do empregador, sem que lhe assista direito a qualquer indenização.\n\n9. Além dos descontos legais, o empregador, a seu exclusivo critério, poderá descontar dos haveres do empregado os prejuízos por ele causados por dolo, culpa, imprudência, negligência ou circunstância outras em que haja culpabilidade de sua parte, isto sem prejuízo da penalidade em que o caso importar.\n\n10. Além dos descontos legais aludidos no artigo 462 da CLT e na cláusula 90. Supra, será lícito ao empregador proceder aos seguintes descontos, desde já, autorizados pelo empregado VALE TRANSPORTE E VALE REFEIÇÃO.\n\n11. Além dos descontos previstos em Lei e das importâncias resultantes, reserva-se o EMPREGADOR o direito de descontar do salário do (a) EMPREGADO(a)  a título  de indenização, importâncias correspondentes:\n\nI - à multa de trânsito e aos danos materiais por ele(a) causados por dolo ou culpa, nos termos do Artigo 462, parágrafo 1º, da CLT, independente da aplicação da pena disciplinar administrativa;\n\nII – a prejuízos decorrentes de perda, desvio ou danos causados em equipamentos de segurança, materiais, ferramentas, máquinas, veículos, móveis, utensílios, e ao estabelecimento, causados por dolo ou culpa, na forma do artigo 462, §1º da CLT, independente da aplicação da pena disciplinar administrativa.\n\n12. Terá   o   presente   contrato   caráter   de  experiência,   vigorando   por   30 (dias)   dias,  a   contar  de ${formatData(
        employee.dateAdmission
      )}, em cujo termo poderá ser prorrogado ou extinto, sem que caiba a qualquer das partes, aviso prévio ou indenização, independentemente de quaisquer interrupções ou suspensões.\n\n13. Findo o prazo ajustado na cláusula anterior ou cessado o período máximo de experiência e permanecendo o empregado no desempenho de seu cargo, o pacto laboral transformar-se-á em contrato de duração indeterminada, permanecendo integras todas as cláusulas e condições ora celebradas.\n\n14. Acordam as partes que poderá o presente contrato ser prorrogado por uma única vez, observando, no entanto, o limite máximo estabelecido pelo parágrafo único do art. 445 da Consolidação das Leis do Trabalho, antes aludido.\n\n15. O equipamento de proteção individual, que for entregue ao empregado pelo empregador, deverá ser usado e guardado em local apropriado e previamente indicado, devendo, ao término do contrato, devolvido ao empregador em perfeitas condições de conservação, salvo desgaste natural.\n\n15.1. A danificação de tal material, em decorrência de uso indevido, ou a não devolução nas condições mencionadas acima, obrigará o empregado ao pagamento do valor equivalente ao preço de custo do mesmo em vigor na data de sua substituição ou do término do pacto laboral.\n\n15.2. O empregado fica obrigado ao uso do (s) EPI (s) recebido (s), cujo controle será efetuado em documento à parte, devidamente rubricado pelos contratantes, com visto de entrega e devolução.\n\n15.3. O não uso do (s) EPI (s) pelo empregado, dará motivo à rescisão contratual por justa causa, ficando o empregador, em consequência, isento e liberado de toda e qualquer sanção e responsabilidade, quer trabalhista, previdenciária, civil, acidentaria, etc.\n\n16. Obriga-se o empregado a, além de executar com dedicação e legalidade o seu serviço, a cumprir integralmente o Regulamento Interno do empregador, as instruções de sua administração e as ordens de seus chefes e superiores hierárquicos, relativos às peculiaridades dos serviços que lhe forem confiados.\n\n17. O empregado concorda que todas as informações (escritas, orais, no computador ou sob qualquer outra forma) pertinentes ou relativas ao empregador, seus clientes, fornecedores, afiliadas e coligadas, ou a quaisquer dos negócios do empregador, anteriores, atuais ou contemplados, a menos que tais informações sejam de conhecimento público, e informações de natureza geral que não se refiram exclusivamente ao empregador e que estejam livremente disponíveis, são patrimônio valioso e confidencial do empregador. Essas informações deverão incluir, sem limitação, informações relativas a propriedade intelectual, patentes, marcas de comércio, segredos comerciais, fornecedores, clientes, listas de clientes, acertos de comercialização, métodos operacionais, procedimentos licitatórios, planos, políticas, métodos de negócio, demonstrações financeiras e segredos comerciais ou mercantis do empregador, ou métodos e técnicas usados por este ou qualquer de suas afiliadas em ou com relação a seus respectivos negócios. O empregado se compromete ao cumprimento desta cláusula no limite das informações técnicas e específicas da empresa, de forma que, em violando a presente cláusula, fica sujeito a demissão por juta causa e ao ressarcimento financeiro do empregador de prejuízos oriundos de uma eventual divulgação não autorizada de informações sigilosas de propriedade do empregador, por parte do empregado.\n\n17.1 Reconhece o empregado que, Conforme Art. 88, do Código de Propriedade Industrial, Lei 9279/96, toda e qualquer invenção e modelo de utilidade pertencem exclusivamente ao empregador quando decorrerem de contrato de trabalho cuja execução ocorra no Brasil e que tenha por objeto a pesquisa ou a atividade inventiva, ou resulte esta da natureza dos serviços para os quais foi o empregado contratado. Dessa forma, qualquer invento e/ou processo, incluindo, mas não se limitando, softwares, ferramentas de gestão, máquinas, marcas, desenhos industrial, e/ou outros, desenvolvidos pelo empregado no exercício de suas funções (ou decorrente do desenvolvimento de suas funções), pertencem, exclusivamente, ao empregador. \n\n18. Por esta e melhor forma, o EMPREGADO autoriza o EMPREGADOR (e suas coligas, quando aplicável), a utilizar sua imagem contida em fotos(s) e/ou filmagens que foi (foram) feita(s) com o meu prévio consentimento, para ilustrar filmes, vídeos, clipes, comerciais de TV, peças publicitárias e promocionais, reunidas ou não em campanhas, de caráter comercial e institucional, destinadas a divulgar produtos, nomes, marcas, serviços ou qualquer outra denominação ou atividade ligada ao EMPREGADOR. A presente AUTORIZAÇÃO, que se faz firme e valiosa, é concedida a título não oneroso, sem qualquer limitação quanto ao tempo, território e forma de divulgação e será respeitada pelo EMPREGADOR e seus herdeiros e sucessores.\n\nE, assim por estarem justas e contratadas, firmam o presente em duas vias, de igual teor e forma, na presença das testemunhas abaixo.\n\n`,
      alignment: "justify",
      fontSize: 13,
      lineHeight: 1.2,
    },
    {
      text: `Canoas, ${formatData(
        employee.dateAdmission
      )}.\n\n\n\n`,
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
      text: `${employee.company}\n(e demais coligas, quando aplicáveis)\n\n\n\n`,
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
      text: `${employee.name}\n\n\n`,
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
