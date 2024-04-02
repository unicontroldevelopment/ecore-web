/* eslint-disable react/prop-types */
import {
    Document,
    Image,
    PDFDownloadLink,
    PDFViewer,
    Page,
    StyleSheet,
    Text,
} from "@react-pdf/renderer";
import { logo } from "../../assets/logos/logo";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 13,
    textAlign: "justify",
    marginBottom: 10,
  },
  header: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 20,
  },
  image: {
    width: 150,
    alignSelf: "center",
  },
});

const MyDocument = ({
  name,
  cpfCnpj,
  cep,
  road,
  number,
  complement,
  neighborhood,
  city,
  state,
  numberContract,
  dateContract,
  valueContract,
  indexContract,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Image src={logo} style={styles.image} />
      <Text style={styles.title}>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</Text>
      <Text style={styles.header}>N°1</Text>
      <Text style={styles.paragraph}>
        Entre {name}, com sede na {road}, {number} - {neighborhood}, {city}/{state}, registrada no
        CNPJ, sob o nº {cpfCnpj}, doravante designada CONTRATANTE, e
        contratado.razao_social com sede na contratado.endereco registrada no
        CNPJ nº contratado.cnpj neste ato representada pelo seu sócio gerente,
        abaixo assinado, doravante designada CONTRATADA, tem entre si justo e
        acertado este Contrato, mediante as cláusulas e condições que seguem:
      </Text>
      <Text style={styles.paragraph}>
        CLÁUSULA PRIMEIRA: O presente contrato tem por objeto por parte da
        CONTRATADA, a execução dos serviços de Desin e Desrat , conforme Proposta anexa.
      </Text>
      <Text style={styles.paragraph}>
        CLÁUSULA SEGUNDA: A CONTRATANTE obriga-se a pagar a título de
        remuneração à CONTRATADA, a importância de R$ {valueContract} (Valor extenso)
        mensais, equivalente a mão-de-obra (50%), equipamentos e materiais(50%).
        A mensalidade será corrigida na menor periodicidade permitida pela
        legislação, pela variação positiva do 2 no período, ou por negociação
        entre as partes. A primeira parcela vencerá 15 (quinze) dias após o
        início dos serviços, e as demais em igual dia dos meses subsequentes.
        Este contrato poderá ser rescindido, sem aviso prévio, em caso de
        inadimplência superior a 30 (trinta) dias.
      </Text>
      <Text style={styles.paragraph}>
        PARÁGRAFO PRIMEIRO: Após o vencimento incidirá multa de 05% (cinco por
        cento) sobre o valor das faturas, juros legais de 02% (dois por cento)
        ao mês, acrescidos da recuperação de despesas financeiras, nas mesmas
        taxas praticadas pelos Bancos do mercado.
      </Text>
      <Text style={styles.paragraph}>
        PARÁGRAFO SEGUNDO: O agendamento para a realização dos serviços
        previamente contratados deve ser realizado obedecendo-se os itens a
        seguir:
      </Text>
      <Text style={styles.paragraph}>
        {
          "Por parte da CONTRATANTE:\na) O agendamento deve ser realizado com um mínimo de 24 horas de antecedência e dependerá da disponibilidade de dias e horários na agenda da CONTRATADA.\nb) Deve ser realizado através de ligação telefônica à nossa Central de Atendimento, sendo o fone ${contratado.fone} ou no ${contratado.email}.\nc) Em caso de desistência de um horário agendado, em prazo inferior a 24 horas da realização do serviço, ou impossibilidade de realizado por responsabilidade exclusiva da CONTRATANTE, incidirá em uma multa, que será calculada sobre o custo do deslocamento e mão de obra desprendida.\nd) Quando do cancelamento de serviço previamente agendado, será enviado ao CONTRATANTE um comprovante de cancelamento por e-mail, que servirá como comprovação de que os serviços agendados foram cancelados.\ne) Os serviços são contratados para execução em dias úteis, dentro horário comercial, de acordo com o cronograma acordado entre as partes. Em caso de solicitação, por parte da CONTRATANTE, de realização de serviços fora do horário comercial e/ou em feriados e/ou finais de semana, é cobrado um valor extra por operacional alocado no serviço, de acordo com os itens abaixo:"
        }
      </Text>
      <Text style={styles.paragraph}>
        {
          "•    A partir das 18 horas até às 20 horas - R$ 50,00 por hora;\n•    Das 20 horas em diante - R$ 65,00 por hora;\n•    Sábados (das 12 horas até às 20 horas) - R$ 65,00 por hora;\n•    Domingos e Feriados (qualquer horário) - R$ 65,00 por hora.\nA impossibilidade de realização dos serviços por responsabilidade exclusiva da CONTRATANTE incidirá em uma multa de 10% sobre o valor da mensalidade. \n\nObservações : \n\n1) Para orientação de controle de pombos, avaliação de custos para a realização de serviços de vedação, captura, retirada de ninhos e limpeza, serão cotados à parte do contrato; \n\n2) Os porta iscas danificados ou extraviados serão cobrados; \n\n3) Os reajustes correrão por conta da Cláusula Segunda. \n\nPor parte da CONTRATADA: \n\na) O prazo para o cancelamento dos serviços agendados para o Controle de Insetos, Ratos Sinantrópicos será de 24 horas da realização do serviço. Já no serviço da Higienização dos Reservatórios de Água, este poderá ser cancelado no mesmo dia do serviço, isto devido a realização do serviço estar ligada diretamente com as condições climáticas. \n\nb) Quando do cancelamento de serviço previamente agendado, será enviado ao CONTRATANTE um comprovante de cancelamento por e-mail, que servirá como comprovação de que os serviços agendados foram cancelados."
        }
      </Text>
      <Text style={styles.paragraph}>
        CLÁUSULA TERCEIRA: Correrão por conta da UNICONTROL todas as despesas de
        encargos sociais, compreendidos no sentido mais amplo, envolvendo
        obediência às leis trabalhistas e previdenciárias.
      </Text>
      <Text style={styles.paragraph}>
        CLÁUSULA QUARTA: Não caberá a UNICONTROL qualquer responsabilidade por
        acidentes ou danos ocorridos com pessoas ou bens, exceto aqueles
        decorrentes direta e exclusivamente dos seus atos e omissões.
      </Text>
      <Text style={styles.paragraph}>
        CLÁUSULA QUINTA: Este Contrato terá duração de 12 (doze) meses, contados
        a partir do início dos serviços. Caso o presente Contrato não seja
        rescindido a pedido escrito de uma das partes 30 (trinta) dias antes do
        término, entender-se-á que acordaram as partes prorrogarem sua vigência
        por tempo indeterminado, bastando a partir disso um aviso prévio por
        escrito de 30 (trinta) dias para sua rescisão. Os reajustes continuarão
        conforme Cláusula Segunda.
      </Text>
      <Text style={styles.paragraph}>
        PARÁGRAFO ÚNICO: Em caso de rescisão unilateral por parte do CONTRATANTE
        antes do término acordado, o mesmo indenizará a UNICONTROL no valor
        correspondente a 04(quatro) parcelas vigentes ou ao saldo do contrato,
        em moeda corrente, à vista.
      </Text>
      <Text style={styles.paragraph}>
        {
          "CLÁUSULA SEXTA: As cláusulas supra, bem como os casos omissos do presente Contrato serão dirimidos no Foro da cidade de contratado.cidade, contratado.uf. E por estarem justos e acertados assinam o presente Contrato em duas vias de igual teor e forma na presença de duas testemunhas contratuais.\n\nCanoas, 23/09/2023."
        }
      </Text>
      <Text>
        {`\nCONTRATANTE \nNOME: ${name} \nCNPJ: 10.012.123/0213-32\n\n`}
      </Text>
      <Text>
        {
          "UNICONTROL \nNOME: Rogerio\nCPF:034.213.432-70\n\nTESTEMUNHAS\n\n\n\n\n"
        }
      </Text>
      <Text style={styles.paragraph}>
        {
          "Anexo 1 \n\nO Programa Anual de Controle Integrado de Pragas da Unicontrol foi cuidadosamente desenvolvido por profissionais de nosso próprio corpo funcional e de comprovado reconhecimento no mercado. Estamos em permanente pesquisa, evoluindo em tecnologia, métodos e produtos para o efetivo controle de pragas.\nSabemos, entretanto, que a eficácia do tratamento somente alcança sucesso com a parceria de nossos clientes contratantes, quando adotam medidas preventivas,  adequam ou modificam hábitos comportamentais.  Pedimos assim, sua atenção para o que segue:  \n\n1) HIGIENIZAÇÃO E SANITIZAÇÃO: \n\n• Desengorduramento de superfícies, com limpeza úmidas e quentes, através de mangueiras ou vaporeto. \n\n• Raspagem de camadas de gordura incrustadas em tampos e grelhas de fogões, coifas, etc. Retirada de excesso de poeira. \n\n• Limpeza detalhada de equipamentos, como masseiras, sanduicheiras, espremedores de sucos, etc. \n\nObs.: Quando pulverizados em superfícies gordurosas e sujas, os inseticidas têm uma eficácia reduzida e degradam-se com rapidez. \n\n1) ORGANIZAÇÃO E MANEJO AMBIENTAL \n\n• Descarte de materiais desnecessários; \n\n• Estocagem de material de acordo com as normas sanitárias, em estrados afastados da parede entre si e suspensos do chão.\n\n• Vedação ou selagem de frestas, com silicone, cimento ou massa de vidraceiro (como juntas de azulejos,esquadrias danificadas e soltas de portas e janelas, etc). \n\n• Uso de cantoneiras de alumínio em junções de paredes de azulejo ou alvenaria. \n\n• Manejo de peças do mobiliário, com vedação de vãos de pés tubulares de mesas e cadeiras. \n\n• Eliminação de pontos de vazamento de água (encanamentos, motores e bombas elétricas). \n\n• Bloqueio de vias de acesso, com acessórios de exclusão física (lâminas com borrachas de vedação na parte inferior de portas, tampas de ralos com escotilhas deslizantes, telamento de vãos, etc.) \n\n1) CONSCIENTIZAÇÃO E EDUCAÇÃO AMBIENTAL \n\n- Utilização de material educativo, com folhetos ou circulares sobre o assunto, visando desenvolver hábitos e comportamentos preventivos contra a proliferação de pragas."
        }
      </Text>
    </Page>
  </Document>
);

export const CreatingPdf = () => (
  <div>
    <PDFDownloadLink document={<MyDocument />} fileName="contract.pdf">
      {({ loading }) => (loading ? "Loading document..." : "Download now!")}
    </PDFDownloadLink>
  </div>
);

export const ViewerPDF = (props) => (
  <PDFViewer width={1000} height={1000}>
    <MyDocument {...props} />
  </PDFViewer>
);
