export const Money = (value) => {
  const onlyNums = value.replace(/[^\d]/g, '').replace(/^0+(?=\d)/, '');

  if (onlyNums.length === 0) {
    return '';
  } else if (onlyNums.length === 1) {
    return onlyNums;
  } else if (onlyNums.length === 2) {
    return onlyNums;
  } else {
    let formattedValue = onlyNums.slice(0, -2) + ',' + onlyNums.slice(-2);

    const integerPart = formattedValue.split(',')[0];
    const decimalPart = formattedValue.split(',')[1];

    const integerFormatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${integerFormatted},${decimalPart}`;
  }
};