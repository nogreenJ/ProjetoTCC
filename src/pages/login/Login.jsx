import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import '@popperjs/core/dist/cjs/popper.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { useEffect, useState } from "react";
import InputGroup from 'react-bootstrap/InputGroup';
import assets from "../../assets";
import Carregando from "../../components/common/Carregando";
import MainLayout from "../../components/layout/MainLayout";
import crypto from "../../crypto";
////import notifications from "../../notifications";
import { getToken, gravaAutenticacao } from "../../seguranca/Autenticacao";
import { useNavigate } from "react-router-dom";
import './signin.css';

function Login() {

    const [isCadastro, setIsCadastro] = useState(false);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [autenticado, setAutenticado] = useState(false);
    const [carregando, setCarregando] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    let navigate = useNavigate();

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
                senha: crypto.encryptPassword(senha)
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
                    ////notifications.createNotification("error", json.message);
                } else {
                    json.key = crypto.decryptKey(json.key, senha)
                    setAutenticado(true);
                    gravaAutenticacao(json);
                    navigate("/", { replace: true });
                }
            });
        } catch (err) {
            console.log(err)
            ////notifications.createNotification("error", err.message);
        } finally {
            setCarregando(false);
        }
    }

    const acaoCadastro = async () => {
        try {
            const body = {
                nome: nome,
                email: email,
                senha: crypto.encryptPassword(senha),
                sc_key: crypto.encryptKey(crypto.generateScKeyUsuario(), senha)
            };
            await fetch(`${process.env.REACT_APP_ENDERECO_API}/cadastro`, {
                method: "POST",
                mode: 'cors',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            }).then(response => response.json())
                .then(json => {
                    if (json.success === false) {
                        ////notifications.createNotification("error", json.message);
                    } else {
                        ////notifications.createNotification("success", "Cadastro realizado!");
                        changeAcao();
                    }
                })
        } catch (err) {
            ////notifications.createNotification("error", err.message);
    }
    }

    useEffect(() => {
        try {
            setAutenticado(getToken() != null);
        } catch (err) {
            ////notifications.createNotification("error", err);
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
                        <img src={assets.images.logo_full_light} style={{ height: 'auto', width: '25%' }} />
                        <main className="form-signin">
                            <form onSubmit={acaoLogin} style={{ width: 300, marginLeft: 30 }}>
                                {isCadastro && <div className="form-floating">
                                    <div className="form-group" style={{ marginBottom: 5 }}>
                                        <span style={{ display: 'flex' }}>
                                            <label className="form-label" style={labelStyle}>Nome</label>
                                            <input type="text" className="form-control" id="floatingInput" placeholder="Nome de usuário"
                                                value={nome} required={isCadastro}
                                                name="nome" style={inputStyle}
                                                onChange={e => setNome(e.target.value)} />
                                        </span>
                                    </div>
                                </div>}
                                <div className="form-group" style={{ marginBottom: 5 }}>
                                    <span style={{ display: 'flex' }}>
                                        <label className="form-label" style={labelStyle}>Email</label>
                                        <input type="text" className="form-control" id="floatingInput" placeholder="Email"
                                            value={email} required={true}
                                            name="email" style={inputStyle}
                                            onChange={e => setEmail(e.target.value)} />
                                    </span>
                                </div>
                                <div className="form-group" style={{ marginBottom: 5, paddingLeft: 2 }}>
                                    <span style={{ display: 'flex' }}>
                                        <label className="form-label" style={labelStyle}>Senha</label>

                                        <InputGroup className="mb-3">
                                            <input className="form-control" id="floatingPassword"
                                                value={senha} placeholder="Senha" required={true}
                                                name="senha" style={inputStyle}
                                                type={showPassword ? "text" : "password"}
                                                onChange={e => setSenha(e.target.value)} />
                                            <button className="btn" title="Ver Senha" type="button"
                                                style={{ border: "1px solid #dee2e6", height: 38 }}
                                                onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? (
                                                    <VisibilityIcon sx={{ fontSize: 20 }} />
                                                ) : (
                                                    <VisibilityOffIcon sx={{ fontSize: 20 }} />
                                                )}
                                            </button>
                                        </InputGroup>
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