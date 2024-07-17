import { useEffect } from "react";
import IpfsContext from "./IpfsContext";
import crypto from "../crypto"
import { getUserKey } from "../seguranca/Autenticacao";
import { FilebaseClient } from '@filebase/client'
import { toast } from 'react-toastify';

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
            const uint = new Uint8Array(content.binaryStr);
            let hexFile = buf2hex(uint).toString();
            hexFile = await crypto.encryptFile(hexFile, userKey);
            var fileEnc = new Blob([hexFile]);
            if(pinner && hexFile){
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
                        }
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
                                        return;
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
                    //await 
                    return res;
                } 
                //Filebase
                else if (pinner.tipo === 2){
                    const filebaseClient = new FilebaseClient({ token: key })
                    await filebaseClient.storeBlob(fileEnc).then(cid => {
                        if(!cid){
                            toast.warn("Credenciais inválidas, verifique a chave de API do serviço " + pinner.codigo, {
                                position: "bottom-right"
                            });
                            return;
                        }
                        res.cid = cid;
                    })
                    .catch(err => {
                        res.cid = null;
                    });
                }
            }
            return {};
        } catch (e) {
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
            }
            return res;
        } catch (e) {
            return e
        }
    }

    const downloadContent = async (obj) => {
        await toast.promise(
            fetch('https://ipfs.io/ipfs/' + obj.cid)
                .then(async res =>  {
                    const blob = await res.blob();
                    return blob;
                })
                .then(res => res.text())
                .then(res => crypto.decryptFile(res, userKey))
                .then(txt => download(txt, obj.nome + obj.formato)),
                {pending: 'Baixando arquivo, aguarde...'},
                {position: "bottom-right"}
            );

    }

    function download(hexdata, name) {
        hexdata = buf2hex(hexdata).toString();
        var blob = new Blob([hexdata], {type: "application/octet-stream"});

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

    function buf2hex(buffer) { 
        return [...new Uint8Array(buffer)]
            .map(x => x.toString(16).padStart(2, '0'))
            .join('');
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