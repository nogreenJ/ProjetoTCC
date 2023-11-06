import { useState, useEffect } from "react";
import DiretorioContext from "./DiretorioContext";
import {
    getDiretorioServico, getDiretorioServicoPorCodigoAPI,
    deleteDiretorioServico, cadastraDiretorioServico
}
    from '../../servicos/DiretorioServico';
import Tabela from "./Tabela";
import Form from "./Form";
import Carregando from "../../components/common/Carregando";
import WithAuth from "../../seguranca/WithAuth";
import { getUsuario } from "../../seguranca/Autenticacao";
import { useNavigate } from "react-router-dom";
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import FolderIcon from '@mui/icons-material/Folder';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';


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

    const getListaObjetosSemSelf = () => {
        const newArr = listaObjetos.filter(obj => {
            return obj.codigo !== objeto.codigo;
        });
        return newArr
    }

    const getTreeItemsFromData = (prentId) => {
        let list = listaObjetos
            .filter(obj => !prentId ? obj.parent === "" || !obj.parent : obj.parent === prentId)
            .map(obj => {
                const children = getTreeItemsFromData(obj.codigo);
                const item = (
                    <TreeItem
                        key={obj.codigo + ''}
                        nodeId={obj.codigo + ''}
                        label={
                            <div onClick={event => event.stopPropagation()}>
                                <div><FolderIcon />
                                    {obj.nome}
                                    <button className="btn"
                                        onClick={() => editarObjeto(obj.codigo)}
                                        data-bs-toggle="modal" data-bs-target="#modalEdicao">
                                        <BorderColorOutlinedIcon />
                                    </button>
                                    <button className="btn" title="Remover"
                                        onClick={() => { remover(obj.codigo); }}>
                                        <DeleteOutlineOutlinedIcon />
                                    </button>
                                </div>
                            </div>
                        }
                        children={children}
                    >
                    </TreeItem>
                );
                return item;
            })

        list.push(
            (
                <TreeItem
                    key=""
                    nodeId={"new_sub_" + (prentId ? prentId : '')}
                    label={
                        <div onClick={event => event.stopPropagation()}>
                            <button type="button" className="btn"
                                data-bs-toggle="modal" data-bs-target="#modalEdicao"
                                onClick={() => novoObjeto(prentId)}>
                                <CreateNewFolderOutlinedIcon />
                            </button>
                        </div>
                    }
                >
                </TreeItem>
            )
        );

        return list;
    };

    const getListFromData = (prentId) => {
        return listaObjetos
            .filter(obj => !prentId ? obj.parent === "" || !obj.parent : obj.parent === prentId)
            .map(obj => { obj.children = getListFromData(obj.codigo); return obj; });
    };

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

    const acaoCadastrar = async e => {
        e.preventDefault();
        const metodo = editar ? "PUT" : "POST";
        try {
            console.log(editar)
            console.log(objeto)
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

            <Form />
        </DiretorioContext.Provider>
    )
}

export default WithAuth(Diretorio);
