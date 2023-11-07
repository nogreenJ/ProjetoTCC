import { useContext } from 'react'
import DiretorioContext from '../DiretorioContext';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import FolderIcon from '@mui/icons-material/Folder';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Form from "../Form";
import Button from '@mui/material/Button';

export function DiretorioAddItem({ parentId }) {
    return (
        <TreeItem
            key="" label={<Form parent={parentId} />}
            nodeId={"new_sub_" + parentId}
        />
    )
}

export default function DiretorioItem({ obj, children }) {

    const { editarObjeto, remover } = useContext(DiretorioContext);

    return (
        <TreeItem
            key={obj.codigo + ''}
            nodeId={obj.codigo + ''}
            label={
                <div onClick={event => event.stopPropagation()}>
                    <div><FolderIcon />
                        {obj.nome}
                        <Button className="btn"
                            onClick={() => editarObjeto(obj.codigo)}
                            data-bs-toggle="modal" data-bs-target="#modalEdicao">
                            <BorderColorOutlinedIcon />
                        </Button>
                        <Button className="btn" title="Remover"
                            onClick={() => { remover(obj.codigo); }}>
                            <DeleteOutlineOutlinedIcon />
                        </Button>
                    </div>
                </div>
            }
            children={children}
        />
    )
}