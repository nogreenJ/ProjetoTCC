
const CryptoJS = require("crypto-js");
const appKey = process.env.APPKEY;

const encryptPassword = (senha: string) =>{
    return CryptoJS.SHA3(senha, { outputLength: 128 }).toString();
}

const encryptFile = (value: any, key: string) =>{
    return CryptoJS.AES.encrypt(value, key);
}

const decryptFile = (value: any, key: string) =>{
    return CryptoJS.AES.decrypt(value, key);
}

//Funções que recebem um valor e uma chave, e de/criptografam o valor para um hash de 32 caracteres
const encryptKey = (value: string, key: string) =>{
    return CryptoJS.AES.encrypt(value, key).toString();
}

const decryptKey = (value: string, key: string) =>{
    return CryptoJS.AES.decrypt(value, key).toString(CryptoJS.enc.Utf8);
}

function randomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

const crypto = {
    CryptoJS, encryptFile, decryptFile, encryptKey, decryptKey, randomString, encryptPassword
}

export default crypto;