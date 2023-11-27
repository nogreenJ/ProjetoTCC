import { getToken, getUsuario } from "../seguranca/Autenticacao";

export const getDiretorioServico = async () => {
    const user = getUsuario().codigo;

    const response =
        await fetch(`${process.env.REACT_APP_ENDERECO_API}/diretorio`,
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

export const getDiretorioArquivoServico = async (codigo) => {
    const response =
        await fetch(`${process.env.REACT_APP_ENDERECO_API}/dirarquivos`,
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

export const getDiretorioServicoPorCodigoAPI = async codigo => {
    const response =
        await fetch(`${process.env.REACT_APP_ENDERECO_API}/diretorio/${codigo}`,
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

export const getArquivoServicoPorCodigoAPI = async codigo => {
    const response =
        await fetch(`${process.env.REACT_APP_ENDERECO_API}/arquivo/${codigo}`,
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

export const deleteDiretorioServico = async codigo => {
    const response =
        await fetch(`${process.env.REACT_APP_ENDERECO_API}/diretorio/${codigo}`,
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

export const deleteArquivoServico = async codigo => {
    const response =
        await fetch(`${process.env.REACT_APP_ENDERECO_API}/arquivo/${codigo}`,
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


export const cadastraDiretorioServico = async (objeto, metodo) => {
    const response = await fetch(`${process.env.REACT_APP_ENDERECO_API}/diretorio`, {
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


export const cadastraArquivoServico = async (objeto, metodo) => {
    const response = await fetch(`${process.env.REACT_APP_ENDERECO_API}/arquivo`, {
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