import { useContext } from 'react'
import DiretorioContext from './DiretorioContext';
import CampoEntrada from '../../components/common/CampoEntrada';
import CampoSelect from '../../components/common/CampoSelect';
import FileField from '../../components/common/FileField';
import Dialogo from '../../components/common/Dialogo';
import 'bootstrap/dist/css/bootstrap.min.css'
import '@popperjs/core/dist/cjs/popper.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import ServicoSelect from '../../components/common/servicoselect/ServicoSelect';

export default function FormArquivo({ parent }) {

    const { editar, arquivo, handleChangeArq, acaoCadastraArquivo, getListaObjetosSemSelf, onChangeArquivo } = useContext(DiretorioContext);

    parent = parent ? parent : (arquivo ? arquivo.parent : "");

    return (
        <div style={{ marginLeft: '-20px' }}>
            <Dialogo id="modalEdicaoArq" titulo="Arquivo" idformulario="formEdicaoArq"
                acaoCadastrar={acaoCadastraArquivo} modal={true}>
                <div>
                    <CampoEntrada id="txtCodigoArq" label="Código" tipo="number"
                        name="codigo" value={arquivo.codigo}
                        handlechange={handleChangeArq}
                        requerido={false} readonly={true}
                        maximocaracteres={5} classes="w-25" />
                    <CampoEntrada id="txtNomeArq" label="Nome" tipo="text"
                        name="nome" value={arquivo.nome}
                        handlechange={handleChangeArq}
                        requerido={true} readonly={false}
                        textovalido="Nome OK" textoinvalido="Informe o nome"
                        maximocaracteres={40} classes="w-50" />
                    <CampoSelect id="txtParentArq" label="Dir. Pai"
                        name="parent" value={parent}
                        handlechange={handleChangeArq}
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
                    {editar && (
                        <CampoEntrada id="txtCidArq" label="CID" tipo="string"
                        name="cid" value={arquivo.cid}
                        handlechange={handleChangeArq}
                        requerido={false} readonly={true}
                        classes="w-100" width="col-md-9" />)}
                    {!editar && (
                        <ServicoSelect label="Serviço" classes="w-50" requerido={!editar}/>)}
                    {!editar && (
                        <FileField id="arquivoSelect" label="Arquivo" tipo="text" handlechange={handleChangeArq}
                        name="nome" requerido={!editar} classes="w-50" onChange={onChangeArquivo}
                        textovalido="Arquivo OK" textoinvalido="Informe o arquivo"/>)}
                </div>
            </Dialogo>
        </div>
    )
}
