import { useContext } from 'react'
import Alerta from '../../components/common/Alerta';
import ServicoContext from './ServicoContext';
import CampoEntrada from '../../components/common/CampoEntrada';
import Dialogo from '../../components/common/Dialogo';

function Form() {

    const { objeto, handleChange, acaoCadastrar, alerta } = useContext(ServicoContext);

    return (
        <Dialogo id="modalEdicao" titulo="Serviço" idformulario="formEdicao"
            acaoCadastrar={acaoCadastrar}>
            <Alerta alerta={alerta} />
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
            <CampoEntrada id="txtEndpoint" label="Endpoint" tipo="text"
                name="endpoint" value={objeto ? objeto.endpoint : ''}
                handlechange={handleChange} width="col-md-6"
                requerido={true} readonly={false}
                textovalido="Endpoint OK" textoinvalido="Informe o endpoint"
                maximocaracteres={200} />
            <CampoEntrada id="txtKey" label="Chave" tipo="password"
                name="key" value={objeto ? objeto.key : ''}
                handlechange={handleChange} width="col-md-6"
                requerido={true} readonly={false}
                textovalido="Chave API OK" textoinvalido="Informe a Chave API"
                maximocaracteres={40} />
        </Dialogo>
    )
}

export default Form;
