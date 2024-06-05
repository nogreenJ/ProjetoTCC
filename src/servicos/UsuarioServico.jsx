import { getToken } from "../seguranca/Autenticacao";

var CryptoJS = require("crypto-js");

export const getUsuarioServico = async () => {
    const response =
        await fetch(`${process.env.REACT_APP_ENDERECO_API}/usuario`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": getToken()
                }
            });
    const data = await response.json();
    return data;
}

export const getUsuarioServicoPorCodigoAPI = async codigo => {
    const response =
        await fetch(`${process.env.REACT_APP_ENDERECO_API}/usuario/${codigo}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": getToken()
                }
            });
    const data = await response.json();
    return data;
}

export const deleteUsuarioServico = async codigo => {
    const response =
        await fetch(`${process.env.REACT_APP_ENDERECO_API}/usuario/${codigo}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": getToken()
                }
            });
    const data = await response.json();
    return data;
}

export const cadastraUsuarioServico = async (objeto, metodo) => {
    objeto.senha = CryptoJS.SHA1(objeto.senha).toString();
    objeto.novaSenha = CryptoJS.SHA1(objeto.novaSenha).toString();
    const response = await fetch(`${process.env.REACT_APP_ENDERECO_API}/usuario`, {
        method: metodo,
        headers: {
            "Content-Type": "application/json",
            "authorization": getToken()
        },
        body: JSON.stringify(objeto),
    })
    const data = await response.json();
    return data;
}