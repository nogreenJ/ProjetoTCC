import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TagIcon from '@mui/icons-material/Tag';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Button from '@mui/material/Button';
import { styled } from "@mui/material/styles";
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { useContext } from 'react';
import colorConfigs from "../../../configs/colorConfigs";
import DiretorioContext from '../DiretorioContext';
import { toast } from 'react-toastify';

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
        borderRadius: theme.shape.borderRadius,
        paddingTop: 4,
        paddingBottom: 4,
        marginTop: 8,
        height: 30,
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

function copyContent(content) {
    var copyFrom = document.createElement("textarea");
    copyFrom.textContent = content;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.blur();
    document.body.removeChild(copyFrom);
    toast.info("CID copiado para a área de transferência.", {
        position: "bottom-right"
    });
}

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

    const { editarObjeto, remover, removerArquivo, acaoDownloadArquivo } = useContext(DiretorioContext);

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
            {obj.nome}{obj.formato}
            <span className="actionBtns">
                <Button className="btn btn-sm" title="Baixar" sx={btnStyle}
                        onClick={() => { acaoDownloadArquivo(obj); }}>
                    <FileDownloadIcon />
                </Button>
                <Button className="btn btn-sm" title="Copiar CID" sx={btnStyle}
                        onClick={() => { copyContent(obj.cid); }}>
                    <TagIcon />
                </Button>
                <Button className="btn btn-sm" title="Remover arquivo" sx={btnStyle}
                    onClick={() => { removerArquivo(obj.codigo, obj.cid, obj.servico); }}>
                    <DeleteOutlineOutlinedIcon />
                </Button>
            </span>
        </div>
    </div>


    if (!obj.formato && (!obj.parent || obj.parent === "")) {
        return (
            <ItemArvorePai
                key={obj.codigo}
                nodeId={obj.codigo + ''}
                label={dirLabel}
                children={children}
            />
        )
    }  else if (obj.cid){
        return (
            <ItemArvore
                key={obj.codigo}
                nodeId={obj.codigo + 'arq'}
                label={arqLabel}
            />
        )
    } else {
        return (
            <ItemArvore
                key={obj.codigo}
                nodeId={obj.codigo + ''}
                label={dirLabel}
                children={children}
            />
        )
    }
}