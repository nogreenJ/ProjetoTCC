import { useContext } from "react";
import Alerta from '../../components/common/Alerta';
import CampoEntrada from '../../components/common/CampoEntrada';
import Button from '@mui/material/Button';
import ConfiguracoesContext from "./ConfiguracoesContext";
import Dialogo from '../../components/common/Dialogo';

function Form() {

    const { alerta, objeto, salvarDados, sair, handleChange } = useContext(ConfiguracoesContext);

    (() => {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.querySelectorAll('.needs-validation')

        // Loop over them and prevent submission
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
    })()

    return (
        <div style={{ marginTop: '-16px' }}>
            <Alerta alerta={alerta} />
            <form id="formEdicao" onSubmit={salvarDados}
                className="needs-validation" noValidate>
                <Alerta alerta={alerta} />
                <CampoEntrada id="txtCodigo" label="Código" tipo="number"
                    name="codigo" value={objeto ? objeto.codigo : 0}
                    requerido={false} readonly={true} handlechange={handleChange}
                    maximocaracteres={5} classes="w-25" />
                <CampoEntrada id="txtEmail" label="Email" tipo="text"
                    name="email" value={objeto ? objeto.email : ''}
                    requerido={true} readonly={true} handlechange={handleChange}
                    textovalido="Email OK" textoinvalido="Informe o email"
                    maximocaracteres={40} classes="w-50" />
                <CampoEntrada id="txtNome" label="Nome" tipo="text"
                    name="nome" value={objeto ? objeto.nome : ''}
                    requerido={true} readonly={false} handlechange={handleChange}
                    textovalido="Nome OK" textoinvalido="Informe o nome"
                    maximocaracteres={40} classes="w-50" />
                <CampoEntrada id="txtSenha" label="Senha" tipo="text"
                    name="senha" value={objeto ? objeto.senha : ''}
                    requerido={true} readonly={false} handlechange={handleChange}
                    textovalido="Senha OK" textoinvalido="Informe a senha"
                    maximocaracteres={40} classes="w-50" />
                <div className="w-50" style={{ textAlign: 'center' }}>
                    <Button type="submit" className="w-25 btn btn-lg btn-outline-primary text-primary">
                        Salvar
                    </Button>
                    <Button onClick={() => sair()} className="w-25 btn btn-lg btn-outline-danger text-danger">
                        Sair
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Form;