import { useEffect } from "react";
import IpfsContext from "./IpfsContext";
import crypto from "../crypto"
import { getUserKey } from "../seguranca/Autenticacao";
import { FilebaseClient } from '@filebase/client'
import { toast } from 'react-toastify';
import lighthouse from '@lighthouse-web3/sdk'

const Ipfs = (props) => {

    const userKey = getUserKey();
    let pinner = null;

    const createPinner = async (servico) => {
        if (!servico || !servico.codigo) {
            pinner = null;
            return
        }
        pinner = servico
    }

    const pinContent = async (content) => {
        try {
            if (!content) {
                toast.warn("Arquivo não informado!", {
                    position: "bottom-right"
                });
                return;
            }
            if (!pinner || !pinner.key) {
                toast.warn("Serviço de pinning não selecionado!", {
                    position: "bottom-right"
                });
                return;
            }
            const key = crypto.decryptKey(pinner.key, userKey);
            const hexFile = await crypto.encryptFile(content.binaryStr, userKey);
            var fileEnc = new Blob([hexFile]);
            if(pinner && fileEnc){
                let res = {servico: pinner.codigo}
                //Pinata
                if(pinner.tipo === 1){
                    const form = new FormData();
                    form.append("file", fileEnc);
                    form.append("pinataMetadata", "{\n  \"name\": \""+content.nome+ "\"\n}");
                    form.append("pinataOptions", "{\n  \"cidVersion\": 1\n}");

                    const options = {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${key}`
                        },
                        signal: AbortSignal.timeout(30000)
                    };

                    options.body = form;

                    await toast.promise(
                        fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', options)
                            .then(response => {
                                return response.json()})
                            .then(ret => {
                                if(!ret) return;
                                if(ret.error){
                                    if(ret.error.reason === "INVALID_CREDENTIALS"){
                                        toast.warn("Credenciais inválidas, verifique a chave de API do serviço " + pinner.codigo, {
                                            position: "bottom-right"
                                        });
                                    }
                                    res.cid = null;
                                    return;
                                }
                                res.cid = ret.IpfsHash;
                            })
                            .catch(err => {
                                res.cid = null;
                            }),
                        {pending: 'Realizando upload...'},
                        {position: "bottom-right"}
                    );
                    return res;
                } 
                //Filebase
                else if (pinner.tipo === 2){
                    const filebaseClient = new FilebaseClient({ token: key })
                    await toast.promise(
                        await filebaseClient.storeBlob(fileEnc).then(cid => {
                            console.log(cid)
                            if(!cid){
                                toast.warn("Credenciais inválidas, verifique a chave de API do serviço " + pinner.codigo, {
                                    position: "bottom-right"
                                });
                                return;
                            }
                            res.cid = cid;
                        }),
                        {pending: 'Realizando upload...'},
                        {position: "bottom-right"}
                    )
                    .catch(err => {
                        toast.error(err);
                        res.cid = null;
                    });
                }
                else if (pinner.tipo === 3){
                    await toast.promise(
                        lighthouse.upload([new File([fileEnc], content.nome)], key, false, null).then(ret => {
                            if(!ret.data["Hash"]){
                                toast.error("Erro de upload para o serviço " + pinner.codigo, {
                                    position: "bottom-right"
                                });
                                return;
                            }
                            res.cid = ret.data["Hash"];
                        }),
                        {pending: 'Realizando upload...'},
                        {position: "bottom-right"}
                    )
                    .catch(err => {
                        toast.error(err, {position: "bottom-right"});
                        res.cid = null;
                    });
                    console.log(res)
                    return res;
                }
            }
            return {};
        } catch (e) {
            console.log(e)
            return e
        }
    }

    const deleteContent = async (hash, service) => {
        let res = {};
        try {
            if (!hash) {
                res.msg = 'Arquivo não informado para deleção!';
                return res;
            }
            if (!service || !service.key) {
                res.msg = 'Sem serviço de pinning selecionado!';
                return res;
            }
            if(service.tipo === 1){
                const form = new FormData();

                const key = crypto.decryptKey(service.key, userKey);
                const options = {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${key}`
                    }
                }

                options.body = form;

                await toast.promise(
                    fetch('https://api.pinata.cloud/pinning/unpin/' + hash, options)
                        .then(response => {
                            if(response.ok) return {ok: true}
                            return response.json()})
                        .then(ret => {
                            if(ret.ok){
                                res = {success: true}
                            } else if(ret.error){
                                if(ret.error.reason === "INVALID_CREDENTIALS"){
                                    res = {success: false}
                                    toast.warn("Credenciais inválidas, verifique a chave de API do serviço " + pinner.codigo, {
                                        position: "bottom-right"
                                    });
                                } else if(ret.error.reason === "CURRENT_USER_HAS_NOT_PINNED_CID"){
                                    res = {success: true}
                                    toast.warn("Conteúdo não persistido pelo seu serviço, removido do diretório.", {
                                        position: "bottom-right"
                                    });
                                } else {
                                    res = {success: false}
                                }
                            } else {
                                res = {success: false}
                            }
                        })
                        .catch(err => {
                            res = {success: false}
                        }),
                        {pending: 'Excluindo arquivo...'},
                        {position: "bottom-right"}
                    );
            } else if (service.tipo == 3){
                toast.warn("O provedor Lighthouse ainda não possui funcionalidades de unpin de arquivos, o arquivo não pôde ser removido do IPFS", {position: "bottom-right"});
                res = {success: true}
            }
            return res;
        } catch (e) {
            return e
        }
    }

    const downloadContent = async (obj) => {
        await toast.promise(
            fetch('https://ipfs.io/ipfs/' + obj.cid, {signal: AbortSignal.timeout(30000)})
                .then(async res => await res.blob())
                .then(async res => await res.text())
                .then(res => crypto.decryptFile(res, userKey))
                .then(data => download(data, obj.nome + obj.formato))
                .catch(err => {
                    if(err.message === "The user aborted a request."){
                        toast.warn("A requisição expirou, talvez o conteúdo ainda não esteja " +
                            "disponível para download ou tenha sido removido. Tente novamente " +
                            "mais tarde ou verifique seu serviço de pinning.", 
                            {position: "bottom-right"}
                        );
                        return;
                    }
                    toast.error("Erro ao baixar arquivo.", {position: "bottom-right"});
                }),
                {pending: 'Baixando arquivo, aguarde...'},
                {position: "bottom-right"}
            );

    }

    function download(data, name) {
        var blob = new Blob([data]);    
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url); 
    }

    useEffect( () => {   
    }, []);

    return (
        <IpfsContext.Provider value={{
            pinContent, createPinner, downloadContent, deleteContent
        }}>
            {props.children}
        </IpfsContext.Provider>
    )
}

export default Ipfs;