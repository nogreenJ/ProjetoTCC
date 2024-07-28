import { useContext } from "react";
import ServicoContext from "./ServicoContext";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Tabela() {

    const { listaObjetos, remover, novoObjeto, editarObjeto } = useContext(ServicoContext);

    const btnStyle = {
        fontSize: 15,
        color: 'white',
    }
    return (
        <div style={{ padding: '20px' }}>
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
                                <button className="btn" title="Editar"
                                    onClick={() => editarObjeto(objeto.codigo)} 
                                    style={{margin: "0 5px", backgroundColor: "#4d7ebb"}}
                                    data-bs-toggle="modal" data-bs-target="#modalEdicao">
                                    <FontAwesomeIcon icon={faPenToSquare} style={btnStyle}/>
                                </button>
                                <button className="btn" title="Remover" 
                                    style={{margin: "0 10px", backgroundColor: "#ff3434"}}
                                    onClick={() => { remover(objeto.codigo); }}>
                                    <FontAwesomeIcon icon={faTrash} style={btnStyle}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    <tr key="0">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td align="center">
                            <button type="button" className="btn" title="Novo"
                                style={{backgroundColor: "rgb(28 161 69)"}}
                                data-bs-toggle="modal" data-bs-target="#modalEdicao"
                                onClick={() => novoObjeto()}>
                                <FontAwesomeIcon icon={faPlus} style={btnStyle}/>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Tabela;