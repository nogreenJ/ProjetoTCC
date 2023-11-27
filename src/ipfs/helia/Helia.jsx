import { useState, useEffect, useContext } from "react";
import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs'
import { createRemotePinner } from '@helia/remote-pinning'
import { Configuration, RemotePinningServiceClient } from '@ipfs-shipyard/pinning-service-client'
import HeliaContext from "./HeliaContext";
import ServicoSelect from "../servicoselect/ServicoSelect";

const Helia = (props) => {
    const [started, setStarted] = useState(false);
    const [helia, setHelia] = useState(null);
    const [heliaFs, setHeliaFs] = useState(null);
    let pinner = null;

    const createPinner = async (url, key) => {
        console.log("create pinner")
        if (!url || !key) {
            pinner = null;
            return
        }
        const remotePinningClient = new RemotePinningServiceClient(
            new Configuration({
                endpointUrl: url,
                accessToken: key
            })
        )
        pinner = createRemotePinner(helia, remotePinningClient)
    }

    const pinContent = async (content) => {
        console.log("pin content")
        console.log(content)
        try {
            if (!pinner) throw new Error('Sem serviço de pinning selecionado!')
            const cid = await heliaFs.addBytes(content)
            const addPinResult = await pinner.addPin({
                cid,
                name: content.nome
            })
            console.log(addPinResult)
            return cid;
        } catch (e) {
            console.log(e)
            return e
        }
    }

    useEffect(() => {
        console.log('helia init')
        const fn = async () => setHelia(await createHelia());
        fn();
        setHeliaFs(unixfs(helia));
        setStarted(true);
    }, []);

    return (
        <HeliaContext.Provider value={{
            pinContent, createPinner
        }}>
            {props.children}
        </HeliaContext.Provider>
    )
}

export default Helia;