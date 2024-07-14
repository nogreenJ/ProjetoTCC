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
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import HeliaContext from "../../ipfs/helia/HeliaContext";
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
            toast.success(retornoAPI.message, {
                position: "bottom-right"
            });
            setObjeto(retornoAPI.objeto);
            if (!editar) {
                setEditar(true);
            }
        } catch (err) {
            toast.error(err, {
                position: "bottom-right"
            });
        }
        recuperaDiretorios();
    }

    const onChangeArquivo = (novoArq, binaryStr) => {
        if(!novoArq || !binaryStr){
            activeFile = null;
            setArquivo({ ...arquivo, 'nome': "", 'formato':  "", 'binaryStr':  ""});
            return;
        }
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
                            toast.success(retornoAPI.message, {
                                position: "bottom-right"
                            });
                            //setObjeto(retornoAPI.objeto);
                            setEditar(true);
                            recuperaDiretorios();
                            novoArquivo(arquivo.parent);
                        } else {
                            toast.error("Erro ao tentar fazer upload do arquivo", {
                                position: "bottom-right"
                            });
                        }
                    });                
            } else {
                let retornoAPI = await cadastraArquivoServico(arquivo, metodo);
                toast.success(retornoAPI.message, {
                    position: "bottom-right"
                });
                setObjeto(retornoAPI.objeto);
                recuperaDiretorios();
            }
        } catch (err) {
            toast.error(err, {
                position: "bottom-right"
            });
        }
    }

    const acaoDownloadArquivo = async (arq) =>{
        //const arq = await getArquivoServicoPorCodigoAPI(codigo);
        downloadContent(arq)
    }

    const recuperaDiretorios = async () => {
        try {
            const lista = await getDiretorioArquivoServico();
            if(lista && !lista.status){
                setListaObjetos(lista);
            } else {
                toast.success(lista.message, {
                    position: "bottom-right"
                });
            }
        } catch (err) {
            window.location.reload();
            navigate("/", { replace: true });
        }
    }

    const remover = async codigo => {
        try {
            if (window.confirm('Deseja deletar este diretório?')) {
                let retornoAPI = await deleteDiretorioServico(codigo);
                toast.success(retornoAPI.message, {
                    position: "bottom-right"
                });
                recuperaDiretorios();
            }
        } catch (err) {
            window.location.reload();
            navigate("/", { replace: true });
            
            /*toast.success(retornoAPI.message, {
                position: "bottom-right"
            });*/
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
                            toast.success(retornoAPI.message, {
                                position: "bottom-right"
                            });
                            recuperaDiretorios();
                        } else {
                            toast.error("Erro ao deletar arquivo", {
                                position: "bottom-right"
                            });
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
            <Tabela />
            <FormDiretorio />
            <FormArquivo />
        </DiretorioContext.Provider>
    )
}

export default WithAuth(Diretorio);
