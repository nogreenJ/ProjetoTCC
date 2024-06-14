import { useEffect, useState } from "react";
import HeliaContext from "./HeliaContext";
import crypto from "../../crypto"
import { getToken, getUsuario } from "../../seguranca/Autenticacao";

/*const helia = await createHelia()
const heliaStrings = strings(helia)*/
const Helia = (props) => {
    const [started, setStarted] = useState(false);
    const [libP2P, setLibP2P] = useState(false);
    //const [client, setClient] = useState(null);
    //const [heliaStrings, setHeliaStrings] = useState(null);
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
                alert('Arquivo não informado!');
                return;
            }
            if (!pinner || !pinner.key) {
                alert('Sem serviço de pinning selecionado!');
                return;
            }
            let hexFile = buf2hex(new Uint8Array(content.binaryStr)).toString();
            hexFile = new Blob([hexFile]);
            hexFile = await crypto.encryptFile(hexFile, pinner.sc_key);
            if(pinner && hexFile){
                let res = {servico: pinner.id}
                if(pinner.tipo == 1){
                    const form = new FormData();
                    form.append("file", new Blob([hexFile]));
                    form.append("pinataMetadata", "{\n  \"name\": \""+content.nome+ "\"\n}");
                    form.append("pinataOptions", "{\n  \"cidVersion\": 1\n}");

                    const options = {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${pinner.key}`
                        }
                    };

                    options.body = form;

                    await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', options)
                            .then(response => response.json())
                            .then(ret => {
                                res.cid = ret.IpfsHash;
                            })
                            .catch(err => {
                                console.error(err)
                                res.cid = null;
                            });
                    return res;
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
            if(service.tipo == 1){
                const form = new FormData();

                const options = {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${service.key}`
                    }
                }

                options.body = form;

                await fetch('https://api.pinata.cloud/pinning/unpin/' + hash, options)
                        .then(ret => {
                            res = {success: ret ? ret.ok : false}
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
                .then(res => res.blob())
                .then(res => res.text())
                .then(txt => download(txt, obj.nome + obj.formato));
    }

    function download(hexdata, name) {
        var byteArray = new Uint8Array(hexdata.length/2);
        for (var x = 0; x < byteArray.length; x++){
            byteArray[x] = parseInt(hexdata.substr(x*2,2), 16);
        }
        var blob = new Blob([byteArray], {type: "application/octet-stream"});

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