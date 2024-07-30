
export const ClauseOneAdditive = () => {  
    return `CLÁUSULA PRIMEIRA: O presente CONTRATO tem como objeto a INCLUSAO de
    -
    -
    -  \n`
  };

export const ClauseTwoAdditive = (oldValue = 0, newValue = 0) => {

    return `CLÁUSULA SEGUNDA: O valor da mensalidade passa de R$ ${oldValue} reais para R$ ${newValue} reais mensais.
    \nValor do adendo: R$ ${newValue -= oldValue} reais. \n\n`
}

export const ClauseThreeAdditive = () => {
    return `CLÁUSULA TERCEIRA: As demais clausulas permanecem inalteradas.
    \n\nPARAGRAFO ÚNICO: Esse contrato não possui prazo de vigência mínima, podendo ser cancelado a qualquer momento mediante ao aviso prévio de 30 dias.\n`
}