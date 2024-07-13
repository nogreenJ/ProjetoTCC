import { useContext, useEffect, useState } from "react";
import {
    cadastraArquivoServico,
    cadastraDiretorioServico,
    deleteArquivoServico,
    deleteDiretorioServico,
    getArquivoServicoPorCodigoAPI,
    getDiretorioArquivoServico, getDiretorioServicoPorCodigoAPI
} from '../../servicos/DiretorioServico';
import DiretorioContext from "./DiretorioContext";
    
import { useNavigate } from "react-router-dom";
import Carregando from "../../components/common/Carregando";
import HeliaContext from "../../ipfs/helia/HeliaContext";
import notifications from "../../notifications";
import { getUsuario } from "../../seguranca/Autenticacao";
import WithAuth from "../../seguranca/WithAuth";
import { getServicoServicoPorCodigoAPI } from '../../servicos/ServicoServico';
import FormArquivo from "./FormArquivo";
import FormDiretorio from "./FormDiretorio";
import Tabela from "./Tabela";
import DiretorioItem, { DiretorioAddItem } from "./arvore/DiretorioItem";


function Diretorio() {

    let navigate = useNavigate();

    const { pinContent, deleteContent, downloadContent } = useContext(HeliaContext)

    const [listaObjetos, setListaObjetos] = useState([]);
    const [editar, setEditar] = useState(false);
    const [arquivo, setArquivo] = useState({ codigo: "", nome: "", formato: "", parent: "", dono: "", criptografia: "", cid: "" , servico: "" });
    let activeFile = null;
    const [objeto, setObjeto] = useState({ codigo: "", nome: "", parent: "", usuario: "" });
    const [carregando, setCarregando] = useState(false);

    const novoObjeto = async (parentId) => {
        setEditar(false);
        setObjeto({ codigo: 0, nome: "", parent: (parentId ? parentId : ""), usuario: getUsuario().codigo });
    }

    const editarObjeto = async codigo => {
        try {
            setEditar(true);
            setObjeto(await getDiretorioServicoPorCodigoAPI(codigo));
        } catch (err) {
            window.location.reload();
            navigate("/", { replace: true });
        }
    }

    const novoArquivo = async (parentId) => {
        setEditar(false);
        setArquivo({ codigo: "", nome: "", formato: "", parent: (parentId ? parentId : ""), dono: getUsuario().codigo, criptografia: "", cid: "" });
    }

    const editarArquivo = async codigo => {
        try {
            setEditar(true);
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
            notifications.createNotification(retornoAPI.status, retornoAPI.message);
            setObjeto(retornoAPI.objeto);
            if (!editar) {
                setEditar(true);
            }
        } catch (err) {
            notifications.createNotification('error', err);
        }
        recuperaDiretorios();
    }

    const onChangeArquivo = (novoArq, binaryStr) => {
        activeFile = {
            nome: novoArq.name.split('.')[0], binary: binaryStr,
            formato: ('.' + novoArq.name.split('.')[1])
        };
        setArquivo({ ...arquivo, 'nome': activeFile.nome, 'formato': activeFile.formato , 'binaryStr': binaryStr });
    }

    const acaoCadastraArquivo = async e => {
        e.preventDefault();
        const metodo = editar ? "PUT" : "POST";
        try {
            let ret = null;
            if (!editar) {
                await pinContent(arquivo)
                    .then(async (ret) => {
                        if(ret && ret.cid){
                            const arq = arquivo;
                            arq.binaryStr = "";
                            arq.cid = ret.cid.toString();
                            arq.servico = ret.servico;
                            arq.dono = getUsuario().codigo;
                            let retornoAPI = await cadastraArquivoServico(arq, metodo);
                            notifications.createNotification(retornoAPI.status, retornoAPI.message);
                            //setObjeto(retornoAPI.objeto);
                            setEditar(true);
                            recuperaDiretorios();
                        } else {
                            notifications.createNotification('error', "Erro ao tentar fazer upload do arquivo.");
                        }
                    });                
            } else {
                let retornoAPI = await cadastraArquivoServico(arquivo, metodo);
                notifications.createNotification(retornoAPI.status, retornoAPI.message);
                setObjeto(retornoAPI.objeto);
                recuperaDiretorios();
            }
        } catch (err) {
            notifications.createNotification('error', err);
        }
    }

    const acaoDownloadArquivo = async (arq) =>{
        //const arq = await getArquivoServicoPorCodigoAPI(codigo);
        downloadContent(arq)
    }

    const recuperaDiretorios = async () => {
        try {
            setCarregando(true);
            const lista = await getDiretorioArquivoServico();
            if(lista && !lista.status){
                setListaObjetos(lista);
            } else {
                notifications.createNotification(lista.status, lista.message);
            }
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
                notifications.createNotification(retornoAPI.status, retornoAPI.message);
                recuperaDiretorios();
            }
        } catch (err) {
            window.location.reload();
            navigate("/", { replace: true });
        }
    }

    const removerArquivo = async (codigo, hash, servico) => {
        try {
            if (window.confirm('Deseja deletar este arquivo?')) {
                const pinService = await getServicoServicoPorCodigoAPI(servico);
                await deleteContent(hash, pinService)
                    .then( async res => {
                        if(res.success){
                            let retornoAPI = await deleteArquivoServico(codigo);
                            notifications.createNotification(retornoAPI.status, retornoAPI.message);
                            recuperaDiretorios();
                        } else {
                            notifications.createNotification("error", "Erro ao deletar arquivo.");
                        }
                    });
            }
        } catch (err) {
            window.location.reload();
            navigate("/", { replace: true });
        }
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
            listaObjetos, remover,
            objeto, editar, acaoCadastrar, getListaObjetosSemSelf, getListFromData,
            arquivo, getTreeItemsFromData, handleChangeObj, handleChangeArq, novoObjeto, editarObjeto,
            removerArquivo, acaoCadastraArquivo, novoArquivo, editarArquivo, onChangeArquivo, acaoDownloadArquivo
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
