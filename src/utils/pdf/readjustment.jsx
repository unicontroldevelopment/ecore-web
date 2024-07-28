/* eslint-disable react/prop-types */
import {
    Document,
    Image,
    PDFViewer,
    Page,
    StyleSheet,
    Text,
    View,
} from "@react-pdf/renderer";
import * as React from "react";
import backgroundImg from "../../assets/background.png";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff", // Cor de fundo da página
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
  backgroundImage: {
    position: "absolute",
    width: "100%", // Largura da imagem de fundo
    height: "100%", // Altura da imagem de fundo
    zIndex: -1, // Coloca a imagem de fundo atrás do conteúdo da página
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  rectangle: {
    width: 200,
    height: 50, // Altura maior para acomodar o conteúdo
    borderWidth: 2,
    borderColor: 'black',
    padding: 10,
  },
  blueBackground: {
    backgroundColor: 'blue',
    color: 'white',
  },
  whiteBackground: {
    backgroundColor: 'white',
    color: 'black',
  },
  innerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%', // Preencher a altura do retângulo externo
  },
});

const MyDocument = ({ name, valueContract, newIndex, newValue }) => {
  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>RENOVAÇÃO CONTRATO – REAJUSTE ANUAL</Text>
          <Text style={styles.paragraph}>{name}</Text>
          <Text style={styles.paragraph}>
            A presente proposta tem como objetivo, por parte da UNICONTROL, o
            reajuste anual de seu contrato, previsto para o mês janeiro 2024.
            Indice de {newIndex}%.
          </Text>
          <View style={styles.container}>
            <View style={[styles.rectangle, styles.blueBackground]}>
              <Text>Indice Reajuste: {newIndex}%</Text>
            </View>
            {/* Segundo retângulo */}
            <View style={[styles.rectangle, styles.whiteBackground]}>
              <Text>Preço atual: {valueContract}</Text>
            </View>

            {/* Terceiro retângulo */}
            <View style={[styles.rectangle, styles.blueBackground]}>
              <Text>Novo Valor: {newValue}</Text>
            </View>
          </View>
          <Text>{"O Escopo do Contrato permanece inalterado.\n\n\n\n\n"}</Text>
          <Text style={styles.paragraph}>
            Jennifer Lemos Customer Success Mobile: + 55 (51) 98404.1466 | Web:
            http://www.unicontrol.net.br
          </Text>
          <Image src={backgroundImg} style={styles.backgroundImage} />
        </Page>
      </Document>
    </>
  );
};

export const MyViewerReajustment = (props) => (
  <PDFViewer width={1000} height={1000}>
    <MyDocument {...props} />
  </PDFViewer>
);
