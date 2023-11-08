import { useState, useEffect } from "react";
import { gravaAutenticacao, getToken, logout } from "../../seguranca/Autenticacao";
import Carregando from "../../components/common/Carregando";
import Alerta from "../../components/common/Alerta";
import './signin.css';
import { Navigate, useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";

function Login() {

    let navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [alerta, setAlerta] = useState({ status: "", message: "" });
    const [autenticado, setAutenticado] = useState(false);
    const [carregando, setCarregando] = useState(false);

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
                                <h1 className="h3 mb-3 fw-normal">Login de usuário</h1>

                                <div className="form-floating">
                                    <input type="text" className="form-control" id="floatingInput" placeholder="Nome de usuário"
                                        value={email}
                                        name="email"
                                        onChange={e => setEmail(e.target.value)} />
                                    <label htmlFor="floatingInput">Email</label>
                                </div>
                                <div className="form-floating">
                                    <input type="password" className="form-control" id="floatingPassword" placeholder="Senha"
                                        value={senha}
                                        name="senha"
                                        onChange={e => setSenha(e.target.value)} />
                                    <label htmlFor="floatingPassword">Senha</label>
                                </div>
                                <button className="w-100 btn btn-lg btn-primary" type="submit">Efetuar login</button>
                            </form>
                        </main>
                    </div>
                </div>
            </Carregando>
        </div>
    )
}

export function Logout() {
    logout();
    return <Navigate to="/" />
}

export default Login;