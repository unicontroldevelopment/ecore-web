import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

export const formPdf = (submission, columns) => {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const docDefinition = {
    pageSize: "A4",
      content: [
        { text: 'Detalhes do Envio', style: 'header' },
        {
          text: `Data de envio: ${format(
            new Date(submission.submittedAt),
            'dd/MM/yyyy',
            { locale: ptBR }
          )}`,
          style: 'subheader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
              // Cabeçalho da tabela
              ['Campo', 'Valor'],
              // Colocando os dados do envio
              ...columns.map((column) => [
                { text: column.label, bold: true },
                submission[column.id] || 'N/A'
              ]),
            ],
          },
          layout: 'lightHorizontalLines',
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          margin: [0, 10, 0, 5],
        },
      },
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