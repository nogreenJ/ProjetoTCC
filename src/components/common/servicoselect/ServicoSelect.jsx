
import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { getServicoServico } from "../../../servicos/ServicoServico";

const ServicoSelect = forwardRef((props, ref) => {

    const [selectedSer, setSelectedSer] = useState("");
    const [servicos, setServicos] = useState([]);

    useImperativeHandle(ref, () => ({
        getServicoByCodigo(codigo) {
            let retVal = {}
            servicos.forEach(ser => {
                if (ser.codigo === codigo)
                    retVal = ser
            });
            return retVal;
        },
        getServicoSelecionado() {
            let retVal = {}
            servicos.forEach(ser => {
                if (ser.codigo === selectedSer)
                    retVal = ser
            });
            return retVal;
        }
    }));

    useEffect(() => {
        const fn = async () => {
            await getServicoServico().then(res => setServicos(res));
        }
        fn();
    }, []);

    /*
            {
                servicos.map((ser) => (
                    <option key={ser.codigo} value={ser.codigo}>
                        {ser.nome}
                    </option>
                ))
            } */
    return (
        <select
            className="form-select" readOnly
            id="gateway" name="gateway"
            style={{ width: 200, marginLeft: 'auto', marginRight: 0 }}
            value={selectedSer}>
            <option value='0'>Sem gateway</option>
            {
                servicos.map((ser) => (
                    <option key={ser.codigo} value={ser.codigo}>
                        {ser.nome}
                    </option>
                ))
            }
        </select>
    )
})

export default ServicoSelect;