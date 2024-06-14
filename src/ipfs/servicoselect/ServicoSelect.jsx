
import { useState, useEffect, useContext } from "react";
import ServicoSelectContext from "./ServicoSelectContext";
import { getServicoServico } from "../../servicos/ServicoServico";
import { getUserKey } from "../../seguranca/Autenticacao";
import HeliaContext from "../helia/HeliaContext";
import crypto from "../../crypto";

const ServicoSelect = (props, ref) => {

    const userKey = getUserKey();
    const { createPinner } = useContext(HeliaContext)
    const [servicos, setServicos] = useState([]);

    const getServicoByCodigo = (codigo) => {
        let retVal = {}
        servicos.forEach(ser => {
            if (ser.codigo + '' === codigo){
                retVal = ser
                if(retVal.sc_key){
                    retVal.sc_key = 
                        crypto.decryptKey(retVal.sc_key, userKey);
                }
            }
        });
        return retVal;
    }

    const onChange = (e) => {
        const ser = getServicoByCodigo(e.target.value);
        createPinner(ser);
    }

    const refresh = async () => {
        await getServicoServico().then(res => setServicos(res));
    }

    useEffect(() => {
        refresh();
    }, []);

    return (
        <ServicoSelectContext.Provider value={{
            getServicoByCodigo, refresh
        }}>
            <select
                className="form-select" readOnly id="servico" name="servico"
                style={{ width: 200, marginLeft: 'auto', marginRight: 0 }} onChange={(e) => onChange(e)}>
                <option value=''>Sem serviço</option>
                {
                    servicos.map((ser) => (
                        <option key={ser.codigo} value={ser.codigo}>
                            {ser.nome}
                        </option>
                    ))
                }
            </select>
        </ServicoSelectContext.Provider>
    )
}

export default ServicoSelect;