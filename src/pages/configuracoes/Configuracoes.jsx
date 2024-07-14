import { useState, useEffect } from "react";
import ConfiguracoesContext from "./ConfiguracoesContext";
import { getUsuarioServicoPorCodigoAPI, cadastraUsuarioServico } from '../../servicos/UsuarioServico';
import Carregando from "../../components/common/Carregando";
import WithAuth from "../../seguranca/WithAuth";
import { logout, getUsuario } from "../../seguranca/Autenticacao";
import Form from "./Form";
import { toast } from "react-toastify";

function Configuracoes() {

    const [carregando, setCarregando] = useState(false);
    const [objeto, setObjeto] = useState({ codigo: "", nome: "", senha: "", email: "" , novaSenha: "" , novaChave: "" });

    const getUsuarioObj = async () => {
        setCarregando(true);
        const usr = await getUsuarioServicoPorCodigoAPI(getUsuario().codigo);
        setCarregando(false);
        if (usr == null) {
            toast.error("Erro ao buscar dados", {
                position: "bottom-right"
            });
            setObjeto({ codigo: "", nome: "", senha: "", email: "" , novaSenha: "" , novaChave: ""});
        } else {
            setObjeto({
                codigo: usr.codigo, nome: usr.nome, senha: "", email: usr.email, novaSenha: "", novaChave: ""
            })
        }
    }

    const salvarDados = async () => {
        const user = objeto;
        cadastraUsuarioServico(user, 'PUT')
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
            handleChange, getUsuarioObj, objeto, salvarDados, sair
        }}>
            <Carregando carregando={carregando}>
                <Form />
            </Carregando>
        </ConfiguracoesContext.Provider>
    )
}


export default WithAuth(Configuracoes);