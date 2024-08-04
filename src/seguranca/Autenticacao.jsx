import jwt_decode from 'jwt-decode';
import passwordValidator from 'password-validator';
import { toast } from 'react-toastify';

const NOMEAPP = 'syphonio';
const schema = new passwordValidator();

export const getToken = () => {
    const localStorageAutenticacao = localStorage.getItem(NOMEAPP + '/autenticacao');
    const autenticacao = localStorageAutenticacao ?
        JSON.parse(localStorageAutenticacao) : null;
    if (autenticacao == null || autenticacao.auth === false) {
        return null;
    } else {
        var decoded = jwt_decode(autenticacao.token);
        if (decoded.exp <= Math.floor(new Date() / 1000)) {
            logout();
            return null;
        } else {
            return autenticacao.token;
        }
    }
}

export const getUsuario = () => {
    const localStorageAutenticacao = localStorage.getItem(NOMEAPP + '/autenticacao');
    const autenticacao = localStorageAutenticacao ?
        JSON.parse(localStorageAutenticacao) : null;
    if (autenticacao == null || autenticacao.auth === false) {
        return null;
    } else {
        var decoded = jwt_decode(autenticacao.token);
        if (decoded.exp <= Math.floor(new Date() / 1000)) {
            logout();
        } else {
            return decoded.usuario;
        }
    }
}

export const getUserKey = () => {
    const localStorageAutenticacao = localStorage.getItem(NOMEAPP + '/autenticacao');
    const autenticacao = localStorageAutenticacao ?
        JSON.parse(localStorageAutenticacao) : null;
    if (autenticacao == null || autenticacao.auth === false) {
        return null;
    } else {
        var decoded = jwt_decode(autenticacao.token);
        if (decoded.exp <= Math.floor(new Date() / 1000)) {
            logout();
        } else {
            return autenticacao.key;
        }
    }
}

export const gravaAutenticacao = (json) => {
    localStorage.setItem(NOMEAPP + '/autenticacao', JSON.stringify(json));
}

export const logout = () => {
    localStorage.setItem(NOMEAPP + '/autenticacao', JSON.stringify({ auth: false, token: "" }));
    window.location.reload();
}

export const validatePassword = (password, oldPassword) =>{
    if(oldPassword){
        if(password === oldPassword){
            toast.warn("A nova senha não pode ser igual à senha atual.", {
                position: "bottom-right"
            });
            return false;
        }
    }
    schema
        .is().min(8)                                    
        .is().max(100)                                  
        .has().uppercase()                              
        .has().lowercase()                            
        .has().symbols()                              
        .has().digits(2)                       
        .has().not().spaces();
    const list = schema.validate(password, { list: true })
    if(list.length > 0){
        trataMensagemValidacaoSenha(list[0]);
        return false;
    }
    return true;
}

const trataMensagemValidacaoSenha = (tipo) =>{
    switch(tipo){
        case "min":
            return toast.warn("A senha precisa ter ao menos 8 caracteres.", {
                position: "bottom-right"
            });
        case "max":
            return toast.warn("A senha precisa ter menos de 100 caracteres.", {
                position: "bottom-right"
            });
        case "uppercase":
            return toast.warn("A senha precisa ter caracteres minúsculos.", {
                position: "bottom-right"
            });
        case "lowercase":
            return toast.warn("A senha precisa ter caracteres maiúsculos.", {
                position: "bottom-right"
            });
        case "symbols":
            return toast.warn("A senha precisa ter símbolos.", {
                position: "bottom-right"
            });
        case "digits":
            return toast.warn("A senha precisa ter ao menos 2 números.", {
                position: "bottom-right"
            });
        case "spaces":
            return toast.warn("A senha não pode ter espaços.", {
                position: "bottom-right"
            });
    }
}