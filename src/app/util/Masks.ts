import { ToastType, showToast } from "./ShowToast";

// Aplica máscara de dinheiro
export function moneyApplyMask(value: number) {

    // Verifica se o valor é um número
    if (isNaN(value)) {
        showToast(ToastType.ERROR, "Erro", "Nao é um numero")
    }

    // Formata o número para valor monetário em reais
    const valorEmReais = (value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
    return valorEmReais;
}

// Remove máscara de dinheiro
export function moneyRemoveMask(value: string) {
    // Remove o símbolo R$, os pontos e a vírgula
    let cleanedValue = value.replace(/[^0-9,-]+/g, "");

    cleanedValue = cleanedValue.replace(',', '.');

    let numberValue = parseFloat(cleanedValue);

    return Number(numberValue.toFixed(2));
}

export function cpfCnpjMask(value: string) {
    // Limpa o valor removendo tudo que não é dígito
    const cleanedValue = value.replace(/\D/g, '');

    // Verifica se tem 11 ou 14 dígitos
    if (cleanedValue.length <= 11) {
        // Formata CPF: 000.000.000-00
        let formattedValue = '';
        for (let i = 0; i < cleanedValue.length; i++) {
            if (i === 3 || i === 6) {
                formattedValue += '.';
            } else if (i === 9) {
                formattedValue += '-';
            }
            formattedValue += cleanedValue.charAt(i);
        }
        return formattedValue;
    } else if (cleanedValue.length > 11 && cleanedValue.length <= 14) {
        // Formata CNPJ: 99.999.999/9999-99
        let formattedValue = '';
        for (let i = 0; i < cleanedValue.length; i++) {
            if (i === 2 || i === 5) {
                formattedValue += '.';
            } else if (i === 8) {
                formattedValue += '/';
            } else if (i === 12) {
                formattedValue += '-';
            }
            formattedValue += cleanedValue.charAt(i);
        }
        return formattedValue;
    } else {
        // Retorna o valor original se tiver mais de 14 dígitos (não deveria acontecer)
        return value.slice(0, 14);
    }
}

export function removeCpfCnpjMask(value: string): number {
    // Remove tudo que não é dígito
    const cleanedValue = value.replace(/\D/g, '');
    return Number(cleanedValue);
}

export function formatPercentInput(value: string): string {
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/[^\d]/g, '');

    let divideNumber = 100
    if (value.substring(2, 4).length === 1) {
        divideNumber = 10
    }
    // Converte para número e divide por 100 para obter o formato correto
    let numValue = parseInt(numericValue, 10) / divideNumber;

    if (numValue > 0.99) {
        numValue = parseInt("0000", 10) / 100;
    }

    //
    const finalFormatted = numValue.toFixed(2);
    // Formata com duas casas decimais
    return finalFormatted
}


