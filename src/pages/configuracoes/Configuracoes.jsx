import { useState, useEffect } from "react";
import ConfiguracoesContext from "./ConfiguracoesContext";
import { getUsuarioServicoPorCodigoAPI, cadastraUsuarioServico } from '../../servicos/UsuarioServico';
import Carregando from "../../components/common/Carregando";
import WithAuth from "../../seguranca/WithAuth";
import { logout, getUsuario } from "../../seguranca/Autenticacao";
import Form from "./Form";

function Configuracoes() {

    const [alerta, setAlerta] = useState({ status: "", message: "" });
    const [carregando, setCarregando] = useState(false);
    const [objeto, setObjeto] = useState({ codigo: "", nome: "", senha: "", email: "" });

    const getUsuarioObj = async () => {
        setAlerta({ status: "", message: "" });
        setCarregando(true);
        const usr = await getUsuarioServicoPorCodigoAPI(getUsuario().codigo);
        setCarregando(false);
        if (usr == null) {
            setAlerta({ status: "error", message: "Erro ao buscar dados" });
            setObjeto({ codigo: "", nome: "", senha: "", email: "" });
        } else {
            setObjeto({
                codigo: usr.codigo, nome: usr.nome, senha: usr.senha, email: usr.email
            })
        }
    }

    const salvarDados = async () => {
        cadastraUsuarioServico(objeto, 'PUT')
    }

    const sair = async () => {
        logout();
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setObjeto({ ...objeto, [name]: value });
    }

    useEffect(() => {
        getUsuarioObj();
    }, []);

    return (
        <ConfiguracoesContext.Provider value={{
            alerta, setAlerta, handleChange, getUsuarioObj, objeto, salvarDados, sair
        }}>
            <Carregando carregando={carregando}>
                <Form />
            </Carregando>
        </ConfiguracoesContext.Provider>
    )
}


export default WithAuth(Configuracoes);