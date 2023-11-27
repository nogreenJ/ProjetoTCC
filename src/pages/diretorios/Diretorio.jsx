import { useState, useEffect, useRef, useContext } from "react";
import DiretorioContext from "./DiretorioContext";
import {
    getDiretorioArquivoServico, getDiretorioServicoPorCodigoAPI,
    deleteDiretorioServico, cadastraDiretorioServico,
    getArquivoServicoPorCodigoAPI, cadastraArquivoServico,
    deleteArquivoServico
}
    from '../../servicos/DiretorioServico';
import Tabela from "./Tabela";
import Carregando from "../../components/common/Carregando";
import WithAuth from "../../seguranca/WithAuth";
import { getUsuario } from "../../seguranca/Autenticacao";
import { useNavigate } from "react-router-dom";
import DiretorioItem from "./arvore/DiretorioItem";
import { DiretorioAddItem } from "./arvore/DiretorioItem";
import FormDiretorio from "./FormDiretorio";
import FormArquivo from "./FormArquivo";
import HeliaContext from "../../ipfs/helia/HeliaContext";


function Diretorio() {

    let navigate = useNavigate();

    const { pinContent } = useContext(HeliaContext)

    const [alerta, setAlerta] = useState({ status: "", message: "" });
    const [listaObjetos, setListaObjetos] = useState([]);
    const [editar, setEditar] = useState(false);
    const [arquivo, setArquivo] = useState({ codigo: "", nome: "", formato: "", parent: "", dono: "", criptografia: "", cid: "" });
    let activeFile = null;
    const [objeto, setObjeto] = useState({ codigo: "", nome: "", parent: "", usuario: "" });
    const [carregando, setCarregando] = useState(false);

    const novoObjeto = async (parentId) => {
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

    const novoArquivo = async (parentId) => {
        setEditar(false);
        setAlerta({ status: "", message: "" });
        setArquivo({ codigo: "", nome: "", formato: "", parent: (parentId ? parentId : ""), dono: getUsuario().codigo, criptografia: "", cid: "" });
    }

    const editarArquivo = async codigo => {
        try {
            setEditar(true);
            setAlerta({ status: "", message: "" });
            setObjeto(await getArquivoServicoPorCodigoAPI(codigo));
        } catch (err) {
            window.location.reload();
            navigate("/", { replace: true });
        }
    }

    const getListaObjetosSemSelf = () => {
        if (!objeto || objeto.formato) return listaObjetos;
        const newArr = listaObjetos.filter(obj => {
            return (obj && objeto) && (obj.codigo !== objeto.codigo) && (!obj.formato);
        });
        return newArr
    }

    const getTreeItemsFromData = (prentId) => {
        let list = listaObjetos
            .filter(obj => !prentId ? obj.parent === "" || !obj.parent : obj.parent === prentId)
            .map(obj => {
                let item;
                if (obj.formato) {
                    item = (
                        <DiretorioItem obj={obj} />
                    );
                } else {
                    const children = getTreeItemsFromData(obj.codigo);
                    item = (
                        <DiretorioItem obj={obj} children={children} />
                    );
                }
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
            setAlerta({
                status: 'error',
                message: 'Erro: ' + err
            });
        }
        recuperaDiretorios();
    }

    const acaoCadastraArquivo = async e => {
        e.preventDefault();
        const metodo = editar ? "PUT" : "POST";
        try {
            let cid = null;
            if (!editar) {
                cid = await pinContent(activeFile)
                if (!cid) throw new Error(cid)
            }
            setObjeto({ ...objeto, 'cid': cid });
            let retornoAPI = await cadastraArquivoServico(arquivo, metodo);
            setAlerta({
                status: retornoAPI.status,
                message: retornoAPI.message
            });
            setObjeto(retornoAPI.objeto);
            if (!editar) {
                setEditar(true);
            }
        } catch (err) {
            setAlerta({
                status: 'error',
                message: 'Erro: ' + err
            });
        }
        recuperaDiretorios();
    }

    const recuperaDiretorios = async () => {
        try {
            setCarregando(true);
            setListaObjetos(await getDiretorioArquivoServico());
            setCarregando(false);
        } catch (err) {
            window.location.reload();
            navigate("/", { replace: true });
        }
    }

    const remover = async codigo => {
        try {
            if (window.confirm('Deseja deletar este diretório?')) {
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

    const removerArquivo = async codigo => {
        try {
            if (window.confirm('Deseja deletar este arquivo?')) {
                let retornoAPI = await deleteArquivoServico(codigo);
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

    const onChangeArquivo = (novoArq, binaryStr) => {
        activeFile = {
            nome: novoArq.name.split('.')[0], binary: binaryStr,
            formato: ('.' + novoArq.name.split('.')[1])
        };
        setArquivo({ ...arquivo, 'nome': activeFile.nome, 'formato': activeFile.formato });
        console.log(activeFile)
    }

    const handleChangeObj = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setObjeto({ ...objeto, [name]: value });
    }

    const handleChangeArq = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setArquivo({ ...arquivo, [name]: value });
    }

    useEffect(() => {
        recuperaDiretorios();
    }, []);

    return (
        <DiretorioContext.Provider value={{
            alerta, setAlerta, listaObjetos, remover,
            objeto, editar, acaoCadastrar, getListaObjetosSemSelf, getListFromData,
            arquivo, getTreeItemsFromData, handleChangeObj, handleChangeArq, novoObjeto, editarObjeto,
            removerArquivo, acaoCadastraArquivo, novoArquivo, editarArquivo, onChangeArquivo
        }}>
            <Carregando carregando={carregando}>
                <Tabela />
            </Carregando>
            <FormDiretorio />
            <FormArquivo />
        </DiretorioContext.Provider>
    )
}

export default WithAuth(Diretorio);
