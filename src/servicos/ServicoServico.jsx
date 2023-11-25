import { getToken, getUsuario } from "../seguranca/Autenticacao";

export const getServicoServico = async () => {
    const user = getUsuario().codigo;
    const response =
        await fetch(`${process.env.REACT_APP_ENDERECO_API}/servico/${user}`,
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

export const getServicoServicoPorCodigoAPI = async codigo => {
    const response =
        await fetch(`${process.env.REACT_APP_ENDERECO_API}/servico/edt/${codigo}`,
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

export const deleteServicoServico = async codigo => {
    const response =
        await fetch(`${process.env.REACT_APP_ENDERECO_API}/servico/${codigo}`,
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


export const cadastraServicoServico = async (objeto, metodo) => {
    const response = await fetch(`${process.env.REACT_APP_ENDERECO_API}/servico`, {
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