
export const ClauseOneAdditive = () => {  
    return `CLÁUSULA PRIMEIRA: O presente CONTRATO tem como objeto a INCLUSAO de:\n\n`
  };

  export const ClauseTwoAdditive = (oldValue = "0,00", newValue = "0,00") => {
    if (oldValue && newValue) {
      const oldFloat = parseFloat(oldValue.replace(/\./g, '').replace(',', '.'));
      const newFloat = parseFloat(newValue.replace(/\./g, '').replace(',', '.'));
  
      const difference = newFloat - oldFloat;
  
      const formatValue = (value) => {
        return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      };
  
      const formattedOldValue = formatValue(oldFloat);
      const formattedNewValue = formatValue(newFloat);
      const formattedDifference = formatValue(difference);
  
      return `CLÁUSULA SEGUNDA: O valor da mensalidade passa de R$ ${formattedOldValue} reais para R$ ${formattedNewValue} reais mensais.
      \nValor do adendo: R$ ${formattedDifference} reais. \n\n`;
    } else {
      return `CLÁUSULA SEGUNDA: O valor da mensalidade passa de R$ reais para R$ reais mensais.
      \nValor do adendo: R$ reais. \n\n`;
    }
  }

export const ClauseThreeAdditive = () => {
    return `CLÁUSULA TERCEIRA: As demais clausulas permanecem inalteradas.
    \n\nPARAGRAFO ÚNICO: Esse contrato não possui prazo de vigência mínima, podendo ser cancelado a qualquer momento mediante ao aviso prévio de 30 dias.\n`
}