import { useContext } from "react";
import UsuarioContext from "./UsuarioContext";
import Alerta from '../../components/common/Alerta';

function Tabela() {

    const { alerta, listaObjetos, remover, novoObjeto,
        editarObjeto, isAdm, isOwnUser } = useContext(UsuarioContext);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Usuarios</h1>
            <Alerta alerta={alerta} />
            {isAdm() && (
                <button type="button" className="btn btn-primary"
                    data-bs-toggle="modal" data-bs-target="#modalEdicao"
                    onClick={() => novoObjeto()}>
                    Novo <i className="bi bi-file-earmark-plus"></i>
                </button>
            )}
            {listaObjetos.length === 0 && <h1>Nenhuma usuario encontrada</h1>}
            {listaObjetos.length > 0 && (
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Código</th>
                            <th scope="col">Nome</th>
                            <th scope="col">Email</th>
                            <th scope="col">Tipo</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaObjetos.map(objeto => (
                            <tr key={objeto.codigo}>
                                <td>{objeto.codigo}</td>
                                <td>{objeto.nome}</td>
                                <td>{objeto.email}</td>
                                <td>{objeto.tipo === 1 ? "Administrador" : "Comum"}</td>
                                <td align="center">
                                    <button className="btn btn-info"
                                        onClick={() => editarObjeto(objeto.codigo)}
                                        disabled={!isOwnUser(objeto.codigo)}
                                        data-bs-toggle="modal" data-bs-target="#modalEdicao">
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button className="btn btn-danger" title="Remover"
                                        disabled={!isAdm() || isOwnUser(objeto.codigo)}
                                        onClick={() => { remover(objeto.codigo); }}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default Tabela;