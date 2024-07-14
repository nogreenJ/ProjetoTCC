import { useEffect } from "react";
import HeliaContext from "./HeliaContext";
import crypto from "../../crypto"
import { getUserKey } from "../../seguranca/Autenticacao";
import { FilebaseClient } from '@filebase/client'
import { toast } from 'react-toastify';

const Helia = (props) => {

    const userKey = getUserKey();
    let pinner = null;

    const createPinner = async (servico) => {
        if (!servico) {
            pinner = null;
            return
        }
        pinner = servico
    }

    const pinContent = async (content) => {
        try {
            if (!content) {
                toast.warning("Arquivo não informado!", {
                    position: "bottom-right"
                });
                return;
            }
            if (!pinner || !pinner.key) {
                toast.warning("Serviço de pinning não selecionado!", {
                    position: "bottom-right"
                });
                return;
            }
            const key = crypto.decryptKey(pinner.key, userKey);
            const uint = new Uint8Array(content.binaryStr);
            let hexFile = buf2hex(uint).toString();
            hexFile = await crypto.encryptFile(hexFile, userKey);
            var fileEnc = new Blob([hexFile]);
            if(!pinner){
                alert("NÃO TEM PINNER")
                return
            }
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

                    await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', options)
                            .then(response => {
                                return response.json()})
                            .then(ret => {
                                if(!ret) return;
                                if(ret.error){
                                    if(ret.error.reason === "INVALID_CREDENTIALS"){
                                        toast.warning("Credenciais inválidas, verifique a chave de API do serviço " + pinner.codigo, {
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
                            });
                    return res;
                } 
                //Filebase
                else if (pinner.tipo === 2){
                    const filebaseClient = new FilebaseClient({ token: key })
                    await filebaseClient.storeBlob(fileEnc).then(cid => {
                        if(!cid){
                            toast.warning("Credenciais inválidas, verifique a chave de API do serviço " + pinner.codigo, {
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

                await fetch('https://api.pinata.cloud/pinning/unpin/' + hash, options)
                        .then(response => {
                            if(response.ok) return {ok: true}
                            return response.json()})
                        .then(ret => {
                            if(ret.ok){
                                res = {success: true}
                            } else if(ret.error){
                                if(ret.error.reason === "INVALID_CREDENTIALS"){
                                    res = {success: false}
                                    toast.warning("Credenciais inválidas, verifique a chave de API do serviço " + pinner.codigo, {
                                        position: "bottom-right"
                                    });
                                } else if(ret.error.reason === "CURRENT_USER_HAS_NOT_PINNED_CID"){
                                    res = {success: true}
                                    toast.warning("Conteúdo não persistido pelo seu serviço, removido do diretório.", {
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
                        });
            }
            return res;
        } catch (e) {
            return e
        }
    }

    const downloadContent = async (obj) => {
        await fetch('https://ipfs.io/ipfs/' + obj.cid)
                .then(async res =>  {
                    const blob = await res.blob();
                    return blob;
                })
                .then(res => res.text())
                .then(res => crypto.decryptFile(res, userKey))
                .then(txt => download(txt, obj.nome + obj.formato));
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
        /*const datastore = new MemoryDatastore(`syphon-datastore`);
        const blockstore = new MemoryBlockstore(`syphon-blockstore`);

        const fn = async () => {
            await createLibp2p({
                datastore,
                addresses: {
                    listen: [
                        //'/ip4/127.0.0.1/tcp/0'
                    ]
                },
                transports: [
                    webSockets()
                ],
                connectionEncryption: [
                    noise()
                ],
                streamMuxers: [
                    yamux()
                ],
                peerDiscovery: [
                    bootstrap({
                        interval: 60e10,
                        enabled: true,
                        list: [
                        '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
                        '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
                        '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
                        ]
                    })
                ],
                services: {
                    //identify: identify()
                }
            }).then(async (libp2pas) => {
                await createHelia(
                    datastore,
                    blockstore,
                    libp2pas
                ).then(async (ret) => {
                    setHelia(ret)
                    setHeliaFs(unixfs(ret));
                    setStarted(true);
                    await ret.libp2p.services.dht.setMode("server");
                });
            })
        };
        fn();*/
        /*const fn = async () => {
            setHelia(await createHelia())
            setHeliaStrings(strings(helia));
            setStarted(true);
        };
        fn();*/
    }, []);

    return (
        <HeliaContext.Provider value={{
            pinContent, createPinner, downloadContent, deleteContent
        }}>
            {props.children}
        </HeliaContext.Provider>
    )
}

export default Helia;