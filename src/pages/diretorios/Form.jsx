import { useContext } from 'react'
import Alerta from '../../components/common/Alerta';
import DiretorioContext from './DiretorioContext';
import CampoEntrada from '../../components/common/CampoEntrada';
import Dialogo from '../../components/common/Dialogo';
import CampoSelect from '../../components/common/CampoSelect';

function Form() {

    const { objeto, handleChange, acaoCadastrar, alerta, getListaObjetosSemSelf } = useContext(DiretorioContext);

    return (
        <Dialogo id="modalEdicao" titulo="Diretorio" idformulario="formEdicao"
            acaoCadastrar={acaoCadastrar}>
            <Alerta alerta={alerta} />
            <CampoEntrada id="txtCodigo" label="Código" tipo="number"
                name="codigo" value={objeto ? objeto.codigo : 0}
                handlechange={handleChange}
                requerido={false} readonly={true}
                maximocaracteres={5} />
            <CampoEntrada id="txtNome" label="Nome" tipo="text"
                name="nome" value={objeto ? objeto.nome : ''}
                handlechange={handleChange}
                requerido={true} readonly={false}
                textovalido="Nome OK" textoinvalido="Informe o nome"
                maximocaracteres={40} />
            <CampoSelect id="txtParent" label="Dir. Pai"
                name="parent" value={objeto ? objeto.parent : ""}
                handlechange={handleChange}
                requerido={false}
                textovalido="Dir. Pai OK">
                <option key="" value="">
                    Sem Dir. Pai
                </option>
                {

                    getListaObjetosSemSelf().map((cat) => (
                        <option key={cat.codigo} value={cat.codigo}>
                            {cat.nome}
                        </option>
                    ))
                }
            </CampoSelect>
        </Dialogo>
    )
}

export default Form;
