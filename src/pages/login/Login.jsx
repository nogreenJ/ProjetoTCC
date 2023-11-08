import { useState, useEffect } from "react";
import { gravaAutenticacao, getToken, logout } from "../../seguranca/Autenticacao";
import Carregando from "../../components/common/Carregando";
import Alerta from "../../components/common/Alerta";
import './signin.css';
import MainLayout from "../../components/layout/MainLayout";
import 'bootstrap/dist/css/bootstrap.min.css'
import '@popperjs/core/dist/cjs/popper.js'
import 'bootstrap/dist/js/bootstrap.min.js'

function Login() {

    const [isCadastro, setIsCadastro] = useState(false);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [alerta, setAlerta] = useState({ status: "", message: "" });
    const [autenticado, setAutenticado] = useState(false);
    const [carregando, setCarregando] = useState(false);

    const changeAcao = () => {
        if (isCadastro) {
            setIsCadastro(false);
        } else {
            setIsCadastro(true);
        }
    }

    const acaoLogin = async e => {
        e.preventDefault();
        try {
            const body = {
                email: email,
                senha: senha
            };
            setCarregando(true);
            await fetch(`${process.env.REACT_APP_ENDERECO_API}/login`, {
                method: "POST",
                mode: 'cors',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            }).then(response => response.json())
                .then(json => {
                    if (json.auth === false) {
                        setAlerta({ status: "error", message: json.message })
                    } else {
                        setAutenticado(true);
                        gravaAutenticacao(json);
                        //navigate("/", { replace: true });
                    }
                })
        } catch (err) {
            setAlerta({ status: "error", message: err.message });
        } finally {
            setCarregando(false);
        }
    }

    const acaoCadastro = async () => {
        try {
            const body = {
                nome: nome,
                email: email,
                senha: senha
            };
            await fetch(`${process.env.REACT_APP_ENDERECO_API}/cadastro`, {
                method: "POST",
                mode: 'cors',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            }).then(response => response.json())
                .then(json => {
                    if (json.success === false) {
                        setAlerta({ status: "error", message: json.message })
                    } else {
                        setAlerta({ status: "success", message: "Cadastro realizado!" });
                        changeAcao();
                    }
                })
        } catch (err) {
            setAlerta({ status: "error", message: err.message });
        }
    }

    useEffect(() => {
        try {
            setAutenticado(getToken() != null);
        } catch (err) {
            setAlerta({ status: "error", message: err });
        }
    }, [])

    if (autenticado === true) {
        return <MainLayout />
    }

    return (
        <div>
            <Carregando carregando={carregando}>
                <div>
                    <div className="text-center">
                        <Alerta alerta={alerta} />
                        <main className="form-signin">
                            <form onSubmit={acaoLogin}>
                                <h1 className="h3 mb-3 fw-normal">{isCadastro ? "Cadastrar" : "Entrar"}</h1>

                                {isCadastro && <div className="form-floating">
                                    <label htmlFor="floatingInput">Nome</label>
                                    <input type="text" className="form-control" id="floatingInput" placeholder="Nome de usuário"
                                        value={nome}
                                        name="nome"
                                        onChange={e => setNome(e.target.value)} />
                                </div>}
                                <div className="form-floating">
                                    <input type="text" className="form-control" id="floatingInput" placeholder="Email"
                                        value={email}
                                        name="email"
                                        onChange={e => setEmail(e.target.value)} />
                                    <label htmlFor="floatingInput">Email</label>
                                </div>
                                <div className="form-floating">
                                    <label htmlFor="floatingPassword">Senha</label>
                                    <input type="password" className="form-control" id="floatingPassword" placeholder="Senha"
                                        value={senha}
                                        name="senha"
                                        onChange={e => setSenha(e.target.value)} />
                                </div>
                                {!isCadastro &&
                                    <button className="w-100 btn btn-lg btn-primary" type="submit">
                                        Entrar
                                    </button>
                                }
                                {isCadastro &&
                                    <button className="w-100 btn btn-lg btn-primary" type="button"
                                        onClick={() => acaoCadastro()} >
                                        Cadastrar
                                    </button>
                                }
                                <br />
                                <button className="w-100 btn btn-lg btn-secondary"
                                    sx={{ marginTop: 10 }}
                                    onClick={() => changeAcao()} type="button">
                                    {isCadastro ? "Já possui uma conta?" : "Não possui uma conta?"}
                                </button>
                            </form>
                        </main>
                    </div>
                </div>
            </Carregando>
        </div>
    )
}

export default Login;