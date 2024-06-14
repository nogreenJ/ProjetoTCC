import { useContext } from "react";
import ServicoContext from "./ServicoContext";
import Alerta from '../../components/common/Alerta';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';

function Tabela() {

    const { alerta, listaObjetos, remover, novoObjeto, editarObjeto } = useContext(ServicoContext);

    const btnStyle = {
        fontSize: 20,
        color: 'white'
    }
    return (
        <div style={{ padding: '20px' }}>
            <Alerta alerta={alerta} />
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Código</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Provedor</th>
                        <th scope="col" style={{ textAlign: 'center' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {listaObjetos.map(objeto => (
                        <tr key={objeto.codigo}>
                            <td>{objeto.codigo}</td>
                            <td>{objeto.nome}</td>
                            <td>{objeto.tipo}</td>
                            <td align="center">
                                <button className="btn btn-info" title="Editar"
                                    onClick={() => editarObjeto(objeto.codigo)}
                                    data-bs-toggle="modal" data-bs-target="#modalEdicao">
                                    <BorderColorOutlinedIcon sx={btnStyle} />
                                </button>
                                <button className="btn btn-danger" title="Remover"
                                    onClick={() => { remover(objeto.codigo); }}>
                                    <DeleteOutlineOutlinedIcon sx={btnStyle} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    <tr key="0">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td align="center">
                            <button type="button" className="btn btn-primary" title="Novo"
                                data-bs-toggle="modal" data-bs-target="#modalEdicao"
                                onClick={() => novoObjeto()}>
                                <AddIcon sx={btnStyle} />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Tabela;