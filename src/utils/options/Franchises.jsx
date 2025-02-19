export const Franchises = () => {
    const franchises = [
      "UNICONTROL CONTROLE DE PRAGAS LTDA",
      "UNICONTROL TESLA - VACARIA",
      "UNICONTROL SANGER - VALE DOS SINOS",
      "UNICONTROL PAULING - POA CENTRO",
      "UNICONTROL CURIE - SÃO LEOPOLDOO",
      "UNICONTROL DA VINCI - SÃO LOURENÇO",
      "UNICONTROL DARWIN - PRESIDENTE LUCENA",
      "UNICONTROL NOBEL - FLORES DA CUNHA",
      "UNICONTROL DEGRASSE TYSON - POA ZN",
      "UNICONTROL BARDEEN - RECIFE",
      "UNICONTROL MAXWELL - ESTEIO",
      "UNICONTROL COPÉRNICO - BACIA DO JACUI",
      "UNICONTROL O. CRUZ - CANOAS CENTRO",
      "UNICONTROL GALILEU - SÃO PAULO LIMÃO",
      "UNICONTROL BOHR - MASTER",
    ];
  
    return franchises.sort((a, b) => a.localeCompare(b));
  };
