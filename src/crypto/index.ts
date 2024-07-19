const base64 = require("byte-base64");

const CryptoJS = require("crypto-js");

const encryptPassword = (senha: string) =>{
    return CryptoJS.SHA3(senha, { outputLength: 128 }).toString();
}

const encryptFile = (data: ArrayBuffer, key: any) =>{
    var wordArray = CryptoJS.lib.WordArray.create(data);
    var encrypted = CryptoJS.AES.encrypt(wordArray, key);
    return encrypted.toString();
}

const decryptFile = (data: any, key: any) =>{
    var decrypted = CryptoJS.AES.decrypt(data, key);
    var uint8array = convertWordArrayToUint8Array(decrypted);
    return uint8array;
}

function convertWordArrayToUint8Array(wordArray: any) {
    var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
    var uInt8Array = new Uint8Array(length), index=0, word, i;
    for (i=0; i<length; i++) {
        word = arrayOfWords[i];
        uInt8Array[index++] = word >> 24;
        uInt8Array[index++] = (word >> 16) & 0xff;
        uInt8Array[index++] = (word >> 8) & 0xff;
        uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
}

const encryptKey = (value: string, key: any) =>{
    const retval = CryptoJS.AES.encrypt(value, key).toString();
    return retval;
}

const decryptKey = (value: string, key: any) =>{
    let retval = CryptoJS.AES.decrypt(value, key);
    retval = retval.toString(CryptoJS.enc.Utf8);
    return retval
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

const generateScKeyUsuario = () =>{
    var password = "test";

    var iterations = 500;
    var keySize = 256;
    var salt = CryptoJS.lib.WordArray.random(128/8);

    var output = CryptoJS.PBKDF2(password, salt, {
        keySize: keySize/32,
        iterations: iterations
    });

    return output.toString(CryptoJS.enc.Base64);
}

const generateSecretKey = (key:string) =>{
    var salt = 
         {
            "sigBytes": 16,
            "words": [
                3971927999,3365611249, 3901416214, 407666533
            ],
        }
    var key128Bits = CryptoJS.PBKDF2(key, salt, { keySize: 128/32, iterations: 1000 });
    return key128Bits
}

const crypto = {
    CryptoJS, encryptFile, decryptFile, encryptKey, decryptKey, randomString, encryptPassword, generateSecretKey, generateScKeyUsuario
}

export default crypto;