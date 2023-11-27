
import { useState, useEffect, useContext } from "react";
import ServicoSelectContext from "./ServicoSelectContext";
import { getServicoServico } from "../../servicos/ServicoServico";
import HeliaContext from "../helia/HeliaContext";

const ServicoSelect = (props, ref) => {

    const { createPinner } = useContext(HeliaContext)
    const [servicos, setServicos] = useState([]);

    const getServicoByCodigo = (codigo) => {
        let retVal = {}
        console.log(servicos)
        servicos.forEach(ser => {
            if (ser.codigo + '' === codigo)
                retVal = ser
        });
        return retVal;
    }

    const onChange = (e) => {
        const ser = getServicoByCodigo(e.target.value);
        createPinner(ser.endpoint, ser.key);
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