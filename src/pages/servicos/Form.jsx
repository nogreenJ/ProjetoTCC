import { useContext } from 'react'
import ServicoContext from './ServicoContext';
import CampoEntrada from '../../components/common/CampoEntrada';
import Dialogo from '../../components/common/Dialogo';
import CampoSelect from '../../components/common/CampoSelect';

function Form() {

    const { objeto, handleChange, acaoCadastrar } = useContext(ServicoContext);

    return (
        <Dialogo id="modalEdicao" titulo="Serviço" idformulario="formEdicao"
            acaoCadastrar={acaoCadastrar}>
            <CampoEntrada id="txtCodigo" label="Código" tipo="number"
                name="codigo" value={objeto ? objeto.codigo : 0}
                handlechange={handleChange} width="col-md-3"
                requerido={false} readonly={true}
                maximocaracteres={5} />
            <CampoEntrada id="txtNome" label="Nome" tipo="text"
                name="nome" value={objeto ? objeto.nome : ''}
                handlechange={handleChange} width="col-md-6"
                requerido={true} readonly={false}
                textovalido="Nome OK" textoinvalido="Informe o nome"
                maximocaracteres={40} />
            <CampoSelect id="txtTipo" label="Provedor"
                    name="tipo" value={objeto ? objeto.tipo : 0}
                    requerido={true} classes="w-50"
                    handlechange={handleChange}
                    textovalido="Provedor OK">
                    <option key="" value="">
                        Selecione
                    </option>
                    <option key="Piñata" value="1">
                        Piñata
                    </option>
                    <option key="Lighthouse" value="3">
                        Lighthouse
                    </option>
            </CampoSelect>
            <CampoEntrada id="txtKey" label="Chave API" tipo="password"
                name="key" value={objeto ? objeto.key : ''}
                handlechange={handleChange} width="col-md-9"
                requerido={true} readonly={false}
                textovalido="Chave API OK" textoinvalido="Informe a Chave API"
                maximocaracteres={1000} />
        </Dialogo>
    )
}

export default Form;
