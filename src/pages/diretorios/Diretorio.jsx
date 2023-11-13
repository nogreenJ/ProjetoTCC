import { useState, useEffect } from "react";
import DiretorioContext from "./DiretorioContext";
import {
    getDiretorioServico, getDiretorioServicoPorCodigoAPI,
    deleteDiretorioServico, cadastraDiretorioServico
}
    from '../../servicos/DiretorioServico';
import Tabela from "./Tabela";
import Carregando from "../../components/common/Carregando";
import WithAuth from "../../seguranca/WithAuth";
import { getUsuario } from "../../seguranca/Autenticacao";
import { useNavigate } from "react-router-dom";
import DiretorioItem from "./arvore/DiretorioItem";
import { DiretorioAddItem } from "./arvore/DiretorioItem";


function Diretorio() {

    let navigate = useNavigate();

    const [alerta, setAlerta] = useState({ status: "", message: "" });
    const [listaObjetos, setListaObjetos] = useState([]);
    const [editar, setEditar] = useState(false);
    const [objeto, setObjeto] = useState({ codigo: "", nome: "", parent: "", usuario: "" });
    const [carregando, setCarregando] = useState(false);

    const novoObjeto = (parentId) => {
        setEditar(false);
        setAlerta({ status: "", message: "" });
        setObjeto({ codigo: 0, nome: "", parent: (parentId ? parentId : ""), usuario: getUsuario().codigo });
    }

    const editarObjeto = async codigo => {
        try {
            setEditar(true);
            setAlerta({ status: "", message: "" });
            setObjeto(await getDiretorioServicoPorCodigoAPI(codigo));
        } catch (err) {
            window.location.reload();
            navigate("/", { replace: true });
        }
    }

    const getListaObjetosSemSelf = () => {
        const newArr = listaObjetos.filter(obj => {
            return (obj && objeto) && (obj.codigo !== objeto.codigo);
        });
        return newArr
    }

    const getTreeItemsFromData = (prentId) => {
        let list = listaObjetos
            .filter(obj => !prentId ? obj.parent === "" || !obj.parent : obj.parent === prentId)
            .map(obj => {
                const children = getTreeItemsFromData(obj.codigo);
                const item = (
                    <DiretorioItem obj={obj} children={children} />
                );
                return item;
            })

        const parentId = (prentId ? prentId : '');
        list.push((<DiretorioAddItem parentId={parentId} />));

        return list;
    };

    const getListFromData = (prentId) => {
        return listaObjetos
            .filter(obj => !prentId ? obj.parent === "" || !obj.parent : obj.parent === prentId)
            .map(obj => { obj.children = getListFromData(obj.codigo); return obj; });
    };

    const acaoCadastrar = async e => {
        e.preventDefault();
        const metodo = editar ? "PUT" : "POST";
        try {
            let retornoAPI = await cadastraDiretorioServico(objeto, metodo);
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
        recuperaDiretorios();
    }

    const recuperaDiretorios = async () => {
        try {
            setCarregando(true);
            setListaObjetos(await getDiretorioServico());
            setCarregando(false);
        } catch (err) {
            window.location.reload();
            navigate("/", { replace: true });
        }
    }

    const remover = async codigo => {
        try {
            if (window.confirm('Deseja remover este objeto')) {
                let retornoAPI = await deleteDiretorioServico(codigo);
                setAlerta({
                    status: retornoAPI.status,
                    message: retornoAPI.message
                });
                recuperaDiretorios();
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
        recuperaDiretorios();
    }, []);

    return (
        <DiretorioContext.Provider value={{
            alerta, setAlerta, listaObjetos, remover,
            objeto, editar, acaoCadastrar, getListaObjetosSemSelf, getListFromData,
            getTreeItemsFromData, handleChange, novoObjeto, editarObjeto
        }}>

            <Carregando carregando={carregando}>
                <Tabela />
            </Carregando>
        </DiretorioContext.Provider>
    )
}

export default WithAuth(Diretorio);
