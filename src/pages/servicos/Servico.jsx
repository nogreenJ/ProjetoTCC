import { useState, useEffect } from "react";
import ServicoContext from "./ServicoContext";
import {
    getServicoServico, getServicoServicoPorCodigoAPI,
    deleteServicoServico, cadastraServicoServico
}
    from '../../servicos/ServicoServico';
import Tabela from "./Tabela";
import Form from "./Form";
import Carregando from "../../components/common/Carregando";
import WithAuth from "../../seguranca/WithAuth";
import { useNavigate } from "react-router-dom";
import { getUsuario, getUserKey } from "../../seguranca/Autenticacao";
import crypto from "../../crypto";
import servicesConfigs from "../../configs/servicesConfigs"

function Servico() {

    const userKey = getUserKey();
    let navigate = useNavigate();

    const [alerta, setAlerta] = useState({ status: "", message: "" });
    const [listaObjetos, setListaObjetos] = useState([]);
    const [editar, setEditar] = useState(false);
    const [objeto, setObjeto] = useState({ codigo: "", nome: "", key: "", usuario: "", tipo: "" , sc_key: "" });
    const [carregando, setCarregando] = useState(false);

    const novoObjeto = () => {
        setEditar(false);
        setAlerta({ status: "", message: "" });
        setObjeto({ codigo: 0, nome: "", key: "", usuario: getUsuario().codigo, tipo: "" , sc_key: "" });
    }

    const editarObjeto = async codigo => {
        try {
            setEditar(true);
            setAlerta({ status: "", message: "" });
            const objEdt = await getServicoServicoPorCodigoAPI(codigo);
            if(objEdt.sc_key){
                objEdt.sc_key = crypto.decryptKey(objEdt.sc_key, userKey);
            }
            setObjeto(objEdt);
        } catch (err) {
            window.location.reload();
            navigate("/", { replace: true });
        }
    }

    const acaoCadastrar = async e => {
        e.preventDefault();
        const metodo = editar ? "PUT" : "POST";
        try {
            if(!userKey) return;
            let servico = objeto;
            let sc_key;
            if(!servico.sc_key){
                sc_key = crypto.randomString(32);
            } else {
                sc_key = servico.sc_key;
            }
            servico.sc_key = crypto.encryptKey(sc_key, userKey);
            let retornoAPI = await cadastraServicoServico(servico, metodo);
            setAlerta({
                status: retornoAPI.status,
                message: retornoAPI.message
            });
            setObjeto(retornoAPI.objeto);
            if (!editar) {
                setEditar(true);
            }
        } catch (err) {
            window.location.reload();
            navigate("/", { replace: true });
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
            navigate("/", { replace: true });
        }
    }

    const remover = async codigo => {
        try {
            if (window.confirm('Deseja remover este objeto')) {
                let retornoAPI = await deleteServicoServico(codigo);
                setAlerta({
                    status: retornoAPI.status,
                    message: retornoAPI.message
                });
                recuperaServicos();
            }
        } catch (err) {
            window.location.reload();
            navigate("/", { replace: true });
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
            alerta, setAlerta, listaObjetos, remover,
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