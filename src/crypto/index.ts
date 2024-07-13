
const CryptoJS = require("crypto-js");
const appKey = process.env.APPKEY;

const encryptPassword = (senha: string) =>{
    return CryptoJS.SHA3(senha, { outputLength: 128 }).toString();
}

const encryptFile = (data: any, key: any) =>{
    //key = generateSecretKey(key);
    console.log("encrypting:")
    console.log(data)
    console.log("with:")
    console.log(key)
    var wordArray = CryptoJS.lib.WordArray.create(data); 
    var encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();
    console.log("encrypted: ")
    console.log(encrypted)
    return encrypted;
}

const decryptFile = (data: any, key: any) =>{
    //key = generateSecretKey(key);
    console.log("decrypting:")
    console.log(data)
    console.log("with:")
    console.log(key)
    var decrypted = CryptoJS.AES.decrypt(data, key);
    var typedArray = convertWordArrayToUint8Array(decrypted);
    console.log("decrypted: ")
    console.log(typedArray)
    return typedArray;
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
    //console.log("encrypting key " +  value + " with " + key)
    const retval = CryptoJS.AES.encrypt(value, key).toString();
    //console.log("encrypted key: " + retval)
    return retval;
}

const decryptKey = (value: string, key: any) =>{
    //console.log("decrypting key " + value + " with " + key)
    let retval = CryptoJS.AES.decrypt(value, key);
    retval = retval.toString(CryptoJS.enc.Utf8);
    //console.log("decrypted key: " + retval)
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
    return '12345678901234561234567890123456'//crypto.randomString(32);
}

const generateSecretKey = (key:string) =>{
    var salt = //CryptoJS.lib.WordArray.random(128/8);
         {
            "sigBytes": 16,
            "words": [
                3971927999,3365611249, 3901416214, 407666533
            ],
        }
    var key128Bits = CryptoJS.PBKDF2(key, salt, { keySize: 128/32, iterations: 1000 });
    console.log(key128Bits.toString())
    return key128Bits
}

const crypto = {
    CryptoJS, encryptFile, decryptFile, encryptKey, decryptKey, randomString, encryptPassword, generateSecretKey, generateScKeyUsuario
}

export default crypto;