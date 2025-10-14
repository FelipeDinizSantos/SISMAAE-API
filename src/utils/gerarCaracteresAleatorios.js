function gerarCaracteresAleatorios(length, somenteNumeros = false) {
    let caracteres = '0123456789';

    if(!somenteNumeros){
        caracteres += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    }

    let resultado = '';
    for (let i = 0; i < length; i++) {
        resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return resultado;
}

module.exports = {gerarCaracteresAleatorios};