import { Document, PDFViewer, Page, Text } from "@react-pdf/renderer";
import { Button, message } from "antd";
import { PDFDocument } from "pdf-lib";
import { useRef, useState } from "react";

const MyViewer = () => {
  const [mergedPdf, setMergedPdf] = useState(null);
  const [uploadedPdf, setUploadedPdf] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  // Função para mesclar os PDFs
  const mergePdfs = async () => {
    // Verifica se os arquivos foram carregados
    if (!file || !uploadedPdf) {
      alert("Por favor, faça o upload de ambos os arquivos PDF.");
      return;
    }

    try {
      // Carrega o arquivo PDF pré-existente
      const existingPdfBytes = await fetch(
        "/path/to/existing_document.pdf"
      ).then((res) => res.arrayBuffer());

      // Carrega o arquivo PDF enviado
      const uploadedPdfBytes = await fetch(uploadedPdf).then((res) =>
        res.arrayBuffer()
      );

      // Carrega os PDFs em documentos PDF
      const existingPdfDoc = await PDFDocument.load(existingPdfBytes);
      const uploadedPdfDoc = await PDFDocument.load(uploadedPdfBytes);

      // Cria um novo documento PDF mesclando os PDFs existentes
      const mergedPdfDoc = await PDFDocument.create();
      const [existingPage] = await mergedPdfDoc.copyPages(existingPdfDoc, [0]);
      const [uploadedPage] = await mergedPdfDoc.copyPages(uploadedPdfDoc, [0]);
      mergedPdfDoc.addPage(existingPage);
      mergedPdfDoc.addPage(uploadedPage);

      // Converte o PDF mesclado em bytes
      const mergedPdfBytes = await mergedPdfDoc.save();

      // Atualiza o estado com o PDF mesclado
      setMergedPdf(mergedPdfBytes);
    } catch (error) {
      console.error("Erro ao mesclar PDFs:", error);
      message.error("Erro ao mesclar PDFs. Por favor, tente novamente.");
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      setUploadedPdf(URL.createObjectURL(file));
    } else {
      message.error("Selecione um arquivo antes de fazer o upload.");
    }
  };

  const MyDocument = () => {
      return (
        <>
            <Page size="A4">
              <Text>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</Text>
              <Text>N°1</Text>
              <Text>
                {`\nCONTRATANTE \nNOME: \nCNPJ: 10.012.123/0213-32\n\n`}
              </Text>
              <Text>
                {
                  "UNICONTROL \nNOME: Rogerio\nCPF:034.213.432-70\n\nTESTEMUNHAS\n\n\n\n\n"
                }
              </Text>
              <Text>
                {
                  "Anexo 1 \n\nO Programa Anual de Controle Integrado de Pragas da Unicontrol foi cuidadosamente desenvolvido por profissionais de nosso próprio corpo funcional e de comprovado reconhecimento no mercado. Estamos em permanente pesquisa, evoluindo em tecnologia, métodos e produtos para o efetivo controle de pragas.\nSabemos, entretanto, que a eficácia do tratamento somente alcança sucesso com a parceria de nossos clientes contratantes, quando adotam medidas preventivas,  adequam ou modificam hábitos comportamentais.  Pedimos assim, sua atenção para o que segue:  \n\n1) HIGIENIZAÇÃO E SANITIZAÇÃO: \n\n• Desengorduramento de superfícies, com limpeza úmidas e quentes, através de mangueiras ou vaporeto. \n\n• Raspagem de camadas de gordura incrustadas em tampos e grelhas de fogões, coifas, etc. Retirada de excesso de poeira. \n\n• Limpeza detalhada de equipamentos, como masseiras, sanduicheiras, espremedores de sucos, etc. \n\nObs.: Quando pulverizados em superfícies gordurosas e sujas, os inseticidas têm uma eficácia reduzida e degradam-se com rapidez. \n\n1) ORGANIZAÇÃO E MANEJO AMBIENTAL \n\n• Descarte de materiais desnecessários; \n\n• Estocagem de material de acordo com as normas sanitárias, em estrados afastados da parede entre si e suspensos do chão.\n\n• Vedação ou selagem de frestas, com silicone, cimento ou massa de vidraceiro (como juntas de azulejos,esquadrias danificadas e soltas de portas e janelas, etc). \n\n• Uso de cantoneiras de alumínio em junções de paredes de azulejo ou alvenaria. \n\n• Manejo de peças do mobiliário, com vedação de vãos de pés tubulares de mesas e cadeiras. \n\n• Eliminação de pontos de vazamento de água (encanamentos, motores e bombas elétricas). \n\n• Bloqueio de vias de acesso, com acessórios de exclusão física (lâminas com borrachas de vedação na parte inferior de portas, tampas de ralos com escotilhas deslizantes, telamento de vãos, etc.) \n\n1) CONSCIENTIZAÇÃO E EDUCAÇÃO AMBIENTAL \n\n- Utilização de material educativo, com folhetos ou circulares sobre o assunto, visando desenvolver hábitos e comportamentos preventivos contra a proliferação de pragas."
                }
              </Text>
            </Page>
      </>
      );
  };

  const MyDocument = () => {
    return (
      <>
          <Page size="A4">
            <Text>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</Text>
            <Text>N°1</Text>
            <Text>
              {`\nCONTRATANTE \nNOME: \nCNPJ: 10.012.123/0213-32\n\n`}
            </Text>
            <Text>
              {
                "UNICONTROL \nNOME: Rogerio\nCPF:034.213.432-70\n\nTESTEMUNHAS\n\n\n\n\n"
              }
            </Text>
            <Text>
              {
                "Anexo 1 \n\nO Programa Anual de Controle Integrado de Pragas da Unicontrol foi cuidadosamente desenvolvido por profissionais de nosso próprio corpo funcional e de comprovado reconhecimento no mercado. Estamos em permanente pesquisa, evoluindo em tecnologia, métodos e produtos para o efetivo controle de pragas.\nSabemos, entretanto, que a eficácia do tratamento somente alcança sucesso com a parceria de nossos clientes contratantes, quando adotam medidas preventivas,  adequam ou modificam hábitos comportamentais.  Pedimos assim, sua atenção para o que segue:  \n\n1) HIGIENIZAÇÃO E SANITIZAÇÃO: \n\n• Desengorduramento de superfícies, com limpeza úmidas e quentes, através de mangueiras ou vaporeto. \n\n• Raspagem de camadas de gordura incrustadas em tampos e grelhas de fogões, coifas, etc. Retirada de excesso de poeira. \n\n• Limpeza detalhada de equipamentos, como masseiras, sanduicheiras, espremedores de sucos, etc. \n\nObs.: Quando pulverizados em superfícies gordurosas e sujas, os inseticidas têm uma eficácia reduzida e degradam-se com rapidez. \n\n1) ORGANIZAÇÃO E MANEJO AMBIENTAL \n\n• Descarte de materiais desnecessários; \n\n• Estocagem de material de acordo com as normas sanitárias, em estrados afastados da parede entre si e suspensos do chão.\n\n• Vedação ou selagem de frestas, com silicone, cimento ou massa de vidraceiro (como juntas de azulejos,esquadrias danificadas e soltas de portas e janelas, etc). \n\n• Uso de cantoneiras de alumínio em junções de paredes de azulejo ou alvenaria. \n\n• Manejo de peças do mobiliário, com vedação de vãos de pés tubulares de mesas e cadeiras. \n\n• Eliminação de pontos de vazamento de água (encanamentos, motores e bombas elétricas). \n\n• Bloqueio de vias de acesso, com acessórios de exclusão física (lâminas com borrachas de vedação na parte inferior de portas, tampas de ralos com escotilhas deslizantes, telamento de vãos, etc.) \n\n1) CONSCIENTIZAÇÃO E EDUCAÇÃO AMBIENTAL \n\n- Utilização de material educativo, com folhetos ou circulares sobre o assunto, visando desenvolver hábitos e comportamentos preventivos contra a proliferação de pragas."
              }
            </Text>
          </Page>
    </>
    );
};

  return (
    <div>
      <input
        type="file"
        accept=".pdf"
        style={{ display: "none" }}
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      <Button onClick={() => fileInputRef.current.click()}>
        Anexar PDF da Proposta
      </Button>
      <Button onClick={handleUpload} style={{ marginTop: 10 }}>
        Fazer upload
      </Button>
      <Button onClick={mergePdfs} style={{ marginTop: 10 }}>
        Mesclar PDFs
      </Button>

        <PDFViewer width={1000} height={1000}>
            <Document>
            <MyDocument />
            <MyDocument />
            </Document>
        </PDFViewer>
    </div>
  );
};

export default MyViewer;
