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
import IpfsContext from "../../ipfs/IpfsContext";
import { getUsuario } from "../../seguranca/Autenticacao";
import WithAuth from "../../seguranca/WithAuth";
import { getServicoServicoPorCodigoAPI } from '../../servicos/ServicoServico';
import FormArquivo from "./FormArquivo";
import FormDiretorio from "./FormDiretorio";
import Tabela from "./Tabela";
import DiretorioItem, { DiretorioAddItem } from "./arvore/DiretorioItem";
import { confirmAlert } from 'react-confirm-alert';
import $ from 'jquery';

function Diretorio() {

    let navigate = useNavigate();

    const { pinContent, deleteContent, downloadContent } = useContext(IpfsContext)

    const [listaObjetos, setListaObjetos] = useState([]);
    const [editar, setEditar] = useState(false);
    const [arquivo, setArquivo] = useState({ codigo: "", nome: "", formato: "", parent: "", dono: "", cid: "" , servico: "" });
    let activeFile = null;
    const [objeto, setObjeto] = useState({ codigo: "", nome: "", parent: "", usuario: "" });

    const novoObjeto = async (parentId) => {
        setEditar(false);
        setObjeto({ codigo: 0, nome: "", parent: (parentId ? parentId : ""), usuario: getUsuario().codigo });
    }

    const editarObjeto = async codigo => {
        try {
            setEditar(true);
            const obj = await getDiretorioServicoPorCodigoAPI(codigo);
            if(obj && obj.codigo){
                setObjeto(obj);
            } else {
                toast.error("Erro ao buscar diretório", {
                    position: "bottom-right"
                });
            }
        } catch (err) {
            window.location.reload();
            navigate("/", { replace: true });
        }
    }

    const novoArquivo = async (parentId) => {
        setEditar(false);
        setArquivo({ codigo: "", nome: "", formato: "", parent: (parentId ? parentId : ""), dono: getUsuario().codigo, cid: "", servico: "" });
    }

    const editarArquivo = async codigo => {
        try {
            setEditar(true);
            const arq = await getDiretorioServicoPorCodigoAPI(codigo);
            if(arq && arq.codigo){
                setArquivo(arq);
            } else {
                toast.error("Erro ao buscar arquivo", {
                    position: "bottom-right"
                });
            }
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
            if(retornoAPI.status === "success"){
                toast.success(retornoAPI.message, {
                    position: "bottom-right"
                });
                setObjeto(retornoAPI.objeto);
                if (!editar) {
                    setEditar(true);
                }
                $("#formEdicaoDir_closebtn").click();
            } else {
                toast.error(retornoAPI.message, {
                    position: "bottom-right"
                });
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
                            if(retornoAPI.status === "success"){
                                toast.success("Upload realizado!", {
                                    position: "bottom-right"
                                });
                                setEditar(true);
                                recuperaDiretorios();
                                novoArquivo(arquivo.parent);
                                $("#formEdicaoArq_closebtn").click();
                            } else {
                                toast.error("Erro ao criar arquivo", {
                                    position: "bottom-right"
                                });
                            }
                        } else {
                            toast.error("Erro ao tentar fazer upload do arquivo", {
                                position: "bottom-right"
                            });
                        }
                    });                
            } else {
                let retornoAPI = await cadastraArquivoServico(arquivo, metodo);
                if(retornoAPI.status === "success"){
                    $("#formEdicaoArq_closebtn").click();
                    toast.success("Arquivo atualizado com sucesso!", {
                        position: "bottom-right"
                    });
                    recuperaDiretorios();
                } else {
                    toast.error("Erro ao atualizar arquivo", {
                        position: "bottom-right"
                    });
                }
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
        downloadContent(arq);
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
            toast.error("Erro ao buscar diretórios", {
                position: "bottom-right"
            });
        }
    }

    const remover = async codigo => {
        try {
            confirmAlert({
                title: 'Deletar diretório',
                message: 'Deseja deletar este diretório?',
                buttons: [
                  {
                    label: 'Sim',
                    onClick: async () => {
                        let retornoAPI = await deleteDiretorioServico(codigo);
                        if(retornoAPI.status === "success"){
                            toast.success("Diretório removido com sucesso", {
                                position: "bottom-right"
                            });
                            recuperaDiretorios();
                        } else {
                            toast.error("Erro ao deletar diretório", {
                                position: "bottom-right"
                            });
                        }
                    }
                  },
                  {
                    label: 'Não',
                    onClick: () => {}
                  }
                ]
              });
        } catch (err) {
            window.location.reload();
            navigate("/", { replace: true });
            toast.error("Erro ao deletar diretório", {
                position: "bottom-right"
            });
        }
    }

    const removerArquivo = async (codigo, hash, servico) => {
        try {
            confirmAlert({
                title: 'Deletar arquivo',
                message: 'Deseja deletar este arquivo?',
                buttons: [
                  {
                    label: 'Sim',
                    onClick: async () => {
                        const pinService = await getServicoServicoPorCodigoAPI(servico);
                        await deleteContent(hash, pinService)
                            .then( async res => {
                                if(res.success){
                                    let retornoAPI = await deleteArquivoServico(codigo);
                                    if(retornoAPI.status === "success"){
                                        toast.success(retornoAPI.message, {
                                            position: "bottom-right"
                                        });
                                        recuperaDiretorios();
                                    } else {
                                        toast.error("Erro ao deletar arquivo", {
                                            position: "bottom-right"
                                        });
                                    }
                                } else {
                                    toast.error("Erro ao deletar arquivo", {
                                        position: "bottom-right"
                                    });
                                }
                            });
                    }
                  },
                  {
                    label: 'Não',
                    onClick: () => {}
                  }
                ]
              });
        } catch (err) {
            window.location.reload();
            navigate("/", { replace: true });
            toast.error("Erro ao deletar arquivo", {
                position: "bottom-right"
            });
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
