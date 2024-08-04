import { useState, useEffect } from "react";
import ConfiguracoesContext from "./ConfiguracoesContext";
import { getUsuarioServicoPorCodigoAPI, cadastraUsuarioServico } from '../../servicos/UsuarioServico';
import Carregando from "../../components/common/Carregando";
import WithAuth from "../../seguranca/WithAuth";
import { logout, getUsuario, validatePassword } from "../../seguranca/Autenticacao";
import Form from "./Form";
import { toast } from "react-toastify";
import crypto from "../../crypto";
import { getUserKey } from "../../seguranca/Autenticacao";

function Configuracoes() {

    const userKey = getUserKey();

    const [carregando, setCarregando] = useState(false);
    const [objeto, setObjeto] = useState({ codigo: "", nome: "", senha: "", email: "" , novaSenha: "" , sc_key: userKey });

    const getUsuarioObj = async () => {
        setCarregando(true);
        const usr = await getUsuarioServicoPorCodigoAPI(getUsuario().codigo);
        setCarregando(false);
        if (usr == null) {
            toast.error("Erro ao buscar dados", {
                position: "bottom-right"
            });
            setObjeto({ codigo: "", nome: "", senha: "", email: "" , novaSenha: "", sc_key: userKey });
        } else {
            setObjeto({
                codigo: usr.codigo, nome: usr.nome, senha: "", email: usr.email, novaSenha: "", sc_key: userKey 
            })
        }
    }

    const salvarDados = async (e) => {
        e.preventDefault();
        const user = objeto;
        if(!validatePassword(user.novaSenha, user.senha)){
            return;
        }
        if(user.novaSenha){
            user.sc_key = crypto.encryptKey(userKey, user.novaSenha);
        }
        const ret = await cadastraUsuarioServico(user, 'PUT')
        if(ret.status === "success"){
            toast.success(ret.message, {
                position: "bottom-right"
            });
            getUsuarioObj();
        } else {
            toast.error(ret.message, {
                position: "bottom-right"
            });
        }
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