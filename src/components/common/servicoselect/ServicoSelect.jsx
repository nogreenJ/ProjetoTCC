
import { useState, useEffect, useContext } from "react";
import ServicoSelectContext from "./ServicoSelectContext";
import { getServicoServico } from "../../../servicos/ServicoServico";
import { getUserKey } from "../../../seguranca/Autenticacao";
import IpfsContext from "../../../ipfs/IpfsContext";
import crypto from "../../../crypto";
import { toast } from "react-toastify";

const ServicoSelect = (props, ref) => {

    const userKey = getUserKey();
    const { createPinner } = useContext(IpfsContext)
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
        await getServicoServico().then(res => {
            if(res.status && res.status !== "success"){
                toast.error("Erro ao buscar serviços para o seletor",{
                        position: "bottom-right"
                });
            } else {
                setServicos(res)
            }
        });
    }

    useEffect(() => {
        refresh();
    }, []);

    return (
        <ServicoSelectContext.Provider value={{
            getServicoByCodigo, refresh
        }}>
            
        <div className="form-group" style={{ margin: '5px 0 5px 0' }}>
            <div className="row">
                <span className="col-md-12" style={{ display: 'flex' }}>
                    <label htmlFor={props.id}
                        className={(props.labelClasses ? props.labelClasses : "") + " col-md-2 form-label"}
                        style={{ justifyContent: 'right', display: 'flex', padding: '6px 6px 0 0' }}>
                        {props.label}
                    </label>
                    <span className={props.width ? props.width : "col-md-8"}>
                        <select
                            value={props.value}
                            required={props.requerido}
                            className={(props.classes ? props.classes : "") + " form-select"}
                            readOnly id="servico" name="servico"
                            style={{}} onChange={(e) => onChange(e)}>
                            <option value=''>Sem serviço</option>
                            {
                                servicos.map((ser) => (
                                    <option key={ser.codigo} value={ser.codigo}>
                                        {ser.nome}
                                    </option>
                                ))
                            }
                        </select>
                    </span>
                </span>
                <div className="valid-feedback">
                    {props.textovalido}
                </div>
                <div className="invalid-feedback">
                    {props.textoinvalido}
                </div>
            </div>
        </div>
        </ServicoSelectContext.Provider>
    )
}

export default ServicoSelect;