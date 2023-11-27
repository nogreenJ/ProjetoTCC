import { useContext } from 'react'
import Alerta from '../../components/common/Alerta';
import DiretorioContext from './DiretorioContext';
import CampoEntrada from '../../components/common/CampoEntrada';
import CampoSelect from '../../components/common/CampoSelect';
import Dialogo from '../../components/common/Dialogo';
import 'bootstrap/dist/css/bootstrap.min.css'
import '@popperjs/core/dist/cjs/popper.js'
import 'bootstrap/dist/js/bootstrap.min.js'


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function FormDiretorio({ parent }) {

    const { editar, objeto, handleChangeObj, acaoCadastrar, alerta, getListaObjetosSemSelf } = useContext(DiretorioContext);

    parent = parent ? parent : (objeto ? objeto.parent : "");

    return (
        <div style={{ marginLeft: '-20px' }}>
            <Dialogo id="modalEdicaoDir" titulo="Diretorio" idformulario="formEdicaoDir"
                acaoCadastrar={acaoCadastrar} modal={true}>
                <Alerta alerta={alerta} />
                <div>
                    <CampoEntrada id="txtCodigo" label="Código" tipo="number"
                        name="codigo" value={objeto ? objeto.codigo : 0}
                        handlechange={handleChangeObj}
                        requerido={false} readonly={true}
                        maximocaracteres={5} classes="w-25" />
                    <CampoEntrada id="txtNome" label="Nome" tipo="text"
                        name="nome" value={objeto ? objeto.nome : ''}
                        handlechange={handleChangeObj}
                        requerido={true} readonly={false}
                        textovalido="Nome OK" textoinvalido="Informe o nome"
                        maximocaracteres={40} classes="w-50" />
                    <CampoSelect id="txtParent" label="Dir. Pai"
                        name="parent" value={parent}
                        handlechange={handleChangeObj}
                        requerido={false} classes="w-50"
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
                </div>
            </Dialogo>
        </div>
    )
}
