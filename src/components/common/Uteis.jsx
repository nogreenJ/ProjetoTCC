export const formataMoeda = (valor) => {
    let vlr = Number(valor);
    let valorFormatado = vlr.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL', minimumFractionDigits: 2
    });
    return valorFormatado;
}