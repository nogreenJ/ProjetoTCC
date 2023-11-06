import { useState, useEffect } from "react";
import UsuarioContext from "./UsuarioContext";
import {
    getUsuarioServico, getUsuarioServicoPorCodigoAPI,
    deleteUsuarioServico, cadastraUsuarioServico
}
    from '../../servicos/UsuarioServico';
import Tabela from "./Tabela";
import Form from "./Form";
import Carregando from "../../components/common/Carregando";
import WithAuth from "../../seguranca/WithAuth";
import { useNavigate } from "react-router-dom";
import { getUsuario } from "../../seguranca/Autenticacao";

function Usuario() {

    let navigate = useNavigate();

    const [alerta, setAlerta] = useState({ status: "", message: "" });
    const [listaObjetos, setListaObjetos] = useState([]);
    const [editar, setEditar] = useState(false);
    const [objeto, setObjeto] = useState({ codigo: "", nome: "", email: "", tipo: "", senha: "" });
    const [carregando, setCarregando] = useState(false);

    const isAdm = () => {
        const tipo = getUsuario().tipo;
        return tipo === 1 || tipo === "1";
    }

    const isOwnUser = (cod) => {
        const codigo = getUsuario().codigo;
        return codigo === cod;
    }

    const novoObjeto = () => {
        if (getUsuario().tipo !== 1) {
            setAlerta({ status: "warning", message: "Apenas usuários administradores podem adicionar novos usuários" });
            return;
        }
        setEditar(false);
        setAlerta({ status: "", message: "" });
        setObjeto({ codigo: 0, nome: "", email: "", tipo: 0, senha: "" });
    }

    const editarObjeto = async codigo => {
        try {
            setEditar(true);
            setAlerta({ status: "", message: "" });
            setObjeto(await getUsuarioServicoPorCodigoAPI(codigo));
        } catch (err) {
            window.location.reload();
            navigate("/", { replace: true });
        }
    }

    const acaoCadastrar = async e => {
        e.preventDefault();
        const metodo = editar ? "PUT" : "POST";
        try {
            let retornoAPI = await cadastraUsuarioServico(objeto, metodo);
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
        recuperaUsuarios();
    }

    const recuperaUsuarios = async () => {
        try {
            setCarregando(true);
            setListaObjetos(await getUsuarioServico());
            setCarregando(false);
        } catch (err) {
            window.location.reload();
            navigate("/", { replace: true });
        }
    }

    const remover = async codigo => {
        try {
            if (window.confirm('Deseja remover este objeto')) {
                let retornoAPI = await deleteUsuarioServico(codigo);
                setAlerta({
                    status: retornoAPI.status,
                    message: retornoAPI.message
                });
                recuperaUsuarios();
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
        recuperaUsuarios();
    }, []);

    return (
        <UsuarioContext.Provider value={{
            alerta, setAlerta, listaObjetos, remover,
            objeto, editar, acaoCadastrar, isAdm, isOwnUser,
            handleChange, novoObjeto, editarObjeto
        }}>
            <Carregando carregando={carregando}>
                <Tabela />
            </Carregando>

            <Form />
        </UsuarioContext.Provider>
    )
}

export default WithAuth(Usuario);