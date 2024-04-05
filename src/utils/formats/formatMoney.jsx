export const formatMoney = (value) => {
  // Remover caracteres não numéricos e zeros à esquerda, exceto o último caractere
  const onlyNums = value.replace(/[^\d]/g, '').replace(/^0+(?=\d)/, '');

  if (onlyNums.length === 0) {
    return '';
  } else if (onlyNums.length === 1) {
    return `0,0${onlyNums}`;
  } else if (onlyNums.length === 2) {
    return `0,${onlyNums}`;
  } else {
    // Inserir a vírgula antes dos dois últimos dígitos
    let formattedValue = onlyNums.slice(0, -2) + ',' + onlyNums.slice(-2);

    // Adicionar pontos a cada três números antes da vírgula
    const integerPart = formattedValue.split(',')[0];
    const decimalPart = formattedValue.split(',')[1];

    // Regex para adicionar pontos
    const integerFormatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${integerFormatted},${decimalPart}`;
  }
};
