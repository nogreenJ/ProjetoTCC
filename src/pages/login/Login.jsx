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

    const labelStyle = { justifyContent: 'right', display: 'flex', padding: '6px 6px 0 0', width: '20%' };
    const inputStyle = { justifyContent: 'right', display: 'flex', width: '80%' };

    return (
        <div>
            <Carregando carregando={carregando}>
                <div>
                    <div className="text-center">
                        <Alerta alerta={alerta} />
                        <main className="form-signin">
                            <form onSubmit={acaoLogin} style={{ width: 300, marginLeft: 30 }}>
                                <h1 className="h3 mb-3 fw-normal">{isCadastro ? "Cadastrar" : "Entrar"}</h1>

                                {isCadastro && <div className="form-floating">
                                    <div className="form-group" style={{ marginBottom: 5 }}>
                                        <span style={{ display: 'flex' }}>
                                            <label className="form-label" style={labelStyle}>Nome</label>
                                            <input type="text" className="form-control" id="floatingInput" placeholder="Nome de usuário"
                                                value={nome}
                                                name="nome" style={inputStyle}
                                                onChange={e => setNome(e.target.value)} />
                                        </span>
                                    </div>
                                </div>}
                                <div className="form-group" style={{ marginBottom: 5 }}>
                                    <span style={{ display: 'flex' }}>
                                        <label className="form-label" style={labelStyle}>Email</label>
                                        <input type="text" className="form-control" id="floatingInput" placeholder="Email"
                                            value={email}
                                            name="email" style={inputStyle}
                                            onChange={e => setEmail(e.target.value)} />
                                    </span>
                                </div>
                                <div className="form-group" style={{ marginBottom: 5 }}>
                                    <span style={{ display: 'flex' }}>
                                        <label className="form-label" style={labelStyle}>Senha</label>
                                        <input type="password" className="form-control" id="floatingPassword" placeholder="Senha"
                                            value={senha}
                                            name="senha" style={inputStyle}
                                            onChange={e => setSenha(e.target.value)} />
                                    </span>
                                </div>
                                <div className="form-group">
                                    {!isCadastro &&
                                        <button className="w-50 btn btn-lg btn-primary" type="submit">
                                            Entrar
                                        </button>
                                    }
                                    {isCadastro &&
                                        <button className="w-50 btn btn-md btn-primary" type="button"
                                            onClick={() => acaoCadastro()} >
                                            Cadastrar
                                        </button>
                                    }
                                    <br />
                                    <button className="w-75 btn btn-md btn-secondary"
                                        style={{ marginTop: 3 }}
                                        onClick={() => changeAcao()} type="button">
                                        {isCadastro ? "Já possui uma conta?" : "Não possui uma conta?"}
                                    </button>
                                </div>
                            </form>
                        </main>
                    </div>
                </div>
            </Carregando>
        </div>
    )
}

export default Login;