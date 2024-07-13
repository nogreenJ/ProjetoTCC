import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Carregando from "../../components/common/Carregando";
import servicesConfigs from "../../configs/servicesConfigs";
import crypto from "../../crypto";
//import notifications from "../../notifications";
import { getUserKey, getUsuario } from "../../seguranca/Autenticacao";
import WithAuth from "../../seguranca/WithAuth";
import {
    cadastraServicoServico,
    deleteServicoServico,
    getServicoServico, getServicoServicoPorCodigoAPI
} from '../../servicos/ServicoServico';
import Form from "./Form";
import ServicoContext from "./ServicoContext";
import Tabela from "./Tabela";

function Servico() {

    const userKey = getUserKey();
    let navigate = useNavigate();

    const [listaObjetos, setListaObjetos] = useState([]);
    const [editar, setEditar] = useState(false);
    const [objeto, setObjeto] = useState({ codigo: "", nome: "", key: "", usuario: "", tipo: "" , sc_key: "" });
    const [carregando, setCarregando] = useState(false);

    const novoObjeto = () => {
        setEditar(false);
        setObjeto({ codigo: 0, nome: "", key: "", usuario: getUsuario().codigo, tipo: "" , sc_key: "" });
    }

    const editarObjeto = async codigo => {
        try {
            setEditar(true);
            const objEdt = await getServicoServicoPorCodigoAPI(codigo);
            if(objEdt.sc_key){
                objEdt.sc_key = crypto.decryptKey(objEdt.sc_key, userKey);
            }
            objEdt.key = crypto.decryptKey(objEdt.key, userKey);
            setObjeto(objEdt);
        } catch (err) {
            window.location.reload();
            navigate("/servicos", { replace: true });
        }
    }

    const acaoCadastrar = async e => {
        e.preventDefault();
        const metodo = editar ? "PUT" : "POST";
        try {
            if(!userKey) return;
            let servico = objeto;
            servico.key = crypto.encryptKey(servico.key, userKey);
            let retornoAPI = await cadastraServicoServico(servico, metodo);
            //notifications.createNotification(retornoAPI.status, retornoAPI.message); 
            setObjeto(retornoAPI.objeto);
            if (!editar) {
                setEditar(true);
            }
        } catch (err) {
            window.location.reload();
            navigate("/servicos", { replace: true });
        }
        recuperaServicos();
    }

    const recuperaServicos = async () => {
        try {
            setCarregando(true);
            const servicos = await getServicoServico();
            for(let i = 0; i < servicos.length; i++){
                const s = servicos[i];
                servicos[i].tipo = servicesConfigs[s.tipo] ? servicesConfigs[s.tipo].name : "Desconhecido";
            }
            setListaObjetos(servicos);
            setCarregando(false);
        } catch (err) {
            window.location.reload();
            navigate("/servicos", { replace: true });
        }
    }

    const remover = async codigo => {
        try {
            if (window.confirm('Deseja remover este objeto')) {
                let retornoAPI = await deleteServicoServico(codigo);
                //notifications.createNotification(retornoAPI.status, retornoAPI.message);
                recuperaServicos();
            }
        } catch (err) {
            window.location.reload();
            navigate("/servicos", { replace: true });
        }
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setObjeto({ ...objeto, [name]: value });
    }

    useEffect(() => {
        recuperaServicos();
    }, []);

    return (
        <ServicoContext.Provider value={{
            listaObjetos, remover,
            objeto, editar, acaoCadastrar,
            handleChange, novoObjeto, editarObjeto
        }}>
            <Carregando carregando={carregando}>
                <Tabela />
            </Carregando>

            <Form />
        </ServicoContext.Provider>
    )
}

export default WithAuth(Servico);