import { useContext } from 'react'
import DiretorioContext from '../DiretorioContext';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import FolderIcon from '@mui/icons-material/Folder';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Form from "../Form";
import { styled } from "@mui/material/styles";
import Button from '@mui/material/Button';
import colorConfigs from "../../../configs/colorConfigs";

const ItemArvorePai = styled(TreeItem)(({ theme }) => ({
    [`& .${treeItemClasses.content}, .${treeItemClasses.content}`]: {
        backgroundColor: colorConfigs.pallette.quarta,
        borderRadius: theme.shape.borderRadius,
        paddingTop: 4,
        paddingBottom: 4,
        marginTop: 8,
        height: 50,
        '&:hover': {
            cursor: 'default',
        },
    },
    [`& .${treeItemClasses.label}`]: {
        fontSize: 19,
    },
    [`& .${treeItemClasses.group}`]: {
        backgroundColor: colorConfigs.pallette.sexta,
    }
}));

const ItemArvore = styled(TreeItem)(({ theme }) => ({
    [`& .${treeItemClasses.content}`]: {
        backgroundColor: colorConfigs.pallette.sexta + " !important",
        borderRadius: theme.shape.borderRadius,
        paddingTop: 3,
        paddingBottom: 3,
        height: 20,
        '&:hover': {
            cursor: 'default',
        },
    },
    [`& .${treeItemClasses.label}`]: {
        fontSize: 17,
    },
}));

const ItemArvoreAddRoot = styled(TreeItem)(({ theme }) => ({
    [`& .${treeItemClasses.content}`]: {
        backgroundColor: colorConfigs.pallette.sexta + " !important",
        borderRadius: theme.shape.borderRadius,
        fontSize: 17,
        paddingTop: 4,
        paddingBottom: 4,
        marginTop: 8,
        '&:hover': {
            cursor: 'default',
        },
    },
}));

export function DiretorioAddItem({ parentId }) {

    return (
        <ItemArvoreAddRoot
            key={parentId ? 99 + parentId : 0} label={<Form parent={parentId} />}
            nodeId={(parentId ? 99 + parentId : 0) + ''}
        />
    )
}

export default function DiretorioItem({ obj, children }) {

    const { editarObjeto, remover } = useContext(DiretorioContext);

    const label = <div onClick={event => event.stopPropagation()}>
        <div>
            <FolderIcon sx={{ margin: '0 5px -6px 0' }} />
            {obj.nome}
            <span className="actionBtns">
                <Button className="btn"
                    onClick={() => editarObjeto(obj.codigo)}
                    data-bs-toggle="modal" data-bs-target="#modalEdicao">
                    <BorderColorOutlinedIcon />
                </Button>
                <Button className="btn" title="Remover"
                    onClick={() => { remover(obj.codigo); }}>
                    <DeleteOutlineOutlinedIcon />
                </Button>
            </span>
        </div>
    </div>

    if (!obj.parent || obj.parent === "") {
        return (
            <ItemArvorePai
                key={obj.codigo}
                nodeId={obj.codigo + ''}
                label={label}
                children={children}
            />
        )
    } else {
        return (
            <ItemArvore
                key={obj.codigo}
                nodeId={obj.codigo + ''}
                label={label}
                children={children}
            />
        )
    }
}