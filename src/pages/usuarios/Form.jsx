import { useContext } from 'react'
import Alerta from '../../components/common/Alerta';
import UsuarioContext from './UsuarioContext';
import CampoEntrada from '../../components/common/CampoEntrada';
import Dialogo from '../../components/common/Dialogo';

function Form() {

    const { editar, objeto, handleChange, acaoCadastrar, alerta } = useContext(UsuarioContext);

    return (
        <Dialogo id="modalEdicao" titulo="Usuario" idformulario="formEdicao"
            acaoCadastrar={acaoCadastrar}>
            <Alerta alerta={alerta} />
            <CampoEntrada id="txtCodigo" label="Código" tipo="number"
                name="codigo" value={objeto ? objeto.codigo : 0}
                handlechange={handleChange}
                requerido={false} readonly={true}
                maximocaracteres={5} />
            <CampoEntrada id="txtEmail" label="Email" tipo="text"
                name="email" value={objeto ? objeto.email : ''}
                handlechange={handleChange}
                requerido={true} readonly={editar}
                textovalido="Email OK" textoinvalido="Informe o Email"
                maximocaracteres={40} />
            <CampoEntrada id="txtNome" label="Nome" tipo="text"
                name="nome" value={objeto ? objeto.nome : ''}
                handlechange={handleChange}
                requerido={true} readonly={false}
                textovalido="Nome OK" textoinvalido="Informe o nome"
                maximocaracteres={40} />
            <CampoEntrada id="txtSenha" label="Senha" tipo="password"
                name="senha" value={objeto ? objeto.senha : ''}
                handlechange={handleChange}
                requerido={true} readonly={false}
                textovalido="Senha OK" textoinvalido="Informe a Senha"
                maximocaracteres={40} />
        </Dialogo>
    )
}

export default Form;
