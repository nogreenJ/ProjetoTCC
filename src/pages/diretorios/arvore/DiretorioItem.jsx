import { useContext } from 'react'
import DiretorioContext from '../DiretorioContext';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import FolderIcon from '@mui/icons-material/Folder';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TagIcon from '@mui/icons-material/Tag';
import { styled } from "@mui/material/styles";
import Button from '@mui/material/Button';
import colorConfigs from "../../../configs/colorConfigs";
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';

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

const btnStyle = {
    minWidth: 0
}

export function DiretorioAddItem({ parentId }) {
    const { novoObjeto, novoArquivo } = useContext(DiretorioContext);
    return (
        <ItemArvoreAddRoot
            key={parentId ? 99 + parentId : 0} label={
                <span className="actionBtns">
                    <Button onClick={() => novoObjeto(parentId)} sx={btnStyle} title="Novo diretório"
                        data-bs-toggle="modal" data-bs-target="#modalEdicaoDir">
                        <CreateNewFolderOutlinedIcon />
                    </Button>
                    <Button sx={btnStyle} title="Adicionar arquivo" onClick={() => novoArquivo(parentId)}
                        data-bs-toggle="modal" data-bs-target="#modalEdicaoArq">
                        <UploadFileIcon />
                    </Button>
                </span>}
            nodeId={(parentId ? 99 + parentId : 0) + ''}
        />
    )
}

export default function DiretorioItem({ obj, children }) {

    const { editarObjeto, remover, editarArquivo, removerArquivo } = useContext(DiretorioContext);

    const dirLabel = <div onClick={event => event.stopPropagation()}>
        <div>
            <FolderIcon sx={{ margin: '-7px 5px -6px 0' }} />
            {obj.nome}
            <span className="actionBtns">
                <Button className="btn btn-sm" title="Editar"
                    onClick={() => editarObjeto(obj.codigo)} sx={btnStyle}
                    data-bs-toggle="modal" data-bs-target="#modalEdicaoDir">
                    <BorderColorOutlinedIcon />
                </Button>
                <Button className="btn btn-sm" title="Remover" sx={btnStyle}
                    onClick={() => { remover(obj.codigo); }}>
                    <DeleteOutlineOutlinedIcon />
                </Button>
            </span>
        </div>
    </div>

    const arqLabel = <div onClick={event => event.stopPropagation()}>
        <div>
            <InsertDriveFileIcon sx={{ margin: '-7px 5px -6px 0' }} />
            {obj.nome}
            <span className="actionBtns">
                <Button className="btn btn-sm" title="Baixar" sx={btnStyle}>
                    <FileDownloadIcon />
                </Button>
                <Button className="btn btn-sm" title="Copiar CID" sx={btnStyle}>
                    <TagIcon />
                </Button>
                <Button className="btn btn-sm" title="Editar" sx={btnStyle}
                    onClick={() => editarArquivo(obj.codigo)}
                    data-bs-toggle="modal" data-bs-target="#modalEdicaoArq">
                    <BorderColorOutlinedIcon />
                </Button>
                <Button className="btn btn-sm" title="Remover arquivo" sx={btnStyle}
                    onClick={() => { removerArquivo(obj.codigo); }}>
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
                label={dirLabel}
                children={children}
            />
        )
    } else if (!obj.formato || obj.formato === "") {
        return (
            <ItemArvore
                key={obj.codigo}
                nodeId={obj.codigo + ''}
                label={dirLabel}
                children={children}
            />
        )
    } else {
        return (
            <ItemArvore
                key={obj.codigo * 11}
                nodeId={obj.codigo + 'arq'}
                label={arqLabel}
            />
        )
    }
}