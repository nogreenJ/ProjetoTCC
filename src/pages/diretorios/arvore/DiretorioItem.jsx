import { faDownload, faFile, faFileArrowUp, faFileAudio, faFileExcel, 
    faFileImage, faFileLines, faFilePdf, faFilePowerpoint, faFileVideo, 
    faFolder, faFolderPlus, faHashtag, faPenToSquare, faTrash } 
    from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@mui/material/Button';
import { styled } from "@mui/material/styles";
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import colorConfigs from "../../../configs/colorConfigs";
import DiretorioContext from '../DiretorioContext';

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
        marginTop: 4,
        height: 30,
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

const iconMiscStyle = {
    margin: '-7px 5px 0px 7px',
    fontSize: "20px",
    color: "#6c6c6c"
}

const iconDocStyle = {
    margin: '-7px 5px 0px 7px',
    fontSize: "20px",
    color: "#488d9d"
}

const iconPdfStyle = {
    margin: '-7px 5px 0px 7px',
    fontSize: "20px",
    color: "#cf6161"
}

const iconXlsStyle = {
    margin: '-8px 5px 0px 7px',
    fontSize: "20px",
    color: "#408e28"
}

const iconSlidesStyle = {
    margin: '-8px 5px 0px 7px',
    fontSize: "20px",
    color: "rgb(189 201 31)"
}

const iconMultimediaStyle = {
    margin: '-8px 5px 0px 7px',
    fontSize: "20px",
    color: "rgb(160 104 177)"
}

const getTipoIcone = (tipoFile) =>{
    tipoFile = (new String(tipoFile)).toLowerCase();
    switch(tipoFile){
        case ".mp3": case ".wav": case ".ogg":
            return <FontAwesomeIcon icon={faFileAudio} style={iconMultimediaStyle} />
        case ".mp4":case ".avi":case ".mov":
            return <FontAwesomeIcon icon={faFileVideo} style={iconMultimediaStyle} />
        case ".png":case ".jpg":case ".gif":case ".webp":
            return <FontAwesomeIcon icon={faFileImage} style={iconMultimediaStyle} />
        case ".pdf":
            return <FontAwesomeIcon icon={faFilePdf} style={iconPdfStyle} />
        case ".pptx":
            return <FontAwesomeIcon icon={faFilePowerpoint} style={iconSlidesStyle} />
        case ".xlsx":case ".xls":case ".ods":
            return <FontAwesomeIcon icon={faFileExcel} style={iconXlsStyle} />
        case ".doc":case ".docx":
            return <FontAwesomeIcon icon={faFileLines} style={iconDocStyle} />
        default:
            return <FontAwesomeIcon icon={faFile} style={iconMiscStyle} />
    }
}

const btnStyle = {
    minWidth: 0,
    width: "fit-content",
    height: "fit-content"
}

const iconLstStyle = {
    margin: '-7px 5px 0px 7px',
    fontSize: "20px",
    color: "rgb(59 59 59)"
}

const iconActionLstStyle = {
    margin: '-7px 5px 0px 7px',
    fontSize: "20px",
    color: "#6c6c6c"
}

const iconActionsStyle = {
    margin: '-7px 5px 0px 7px',
    fontSize: "15px",
    color: "#6c6c6c"
}

export function DiretorioAddItem({ parentId }) {
    const { novoObjeto, novoArquivo } = useContext(DiretorioContext);
    return (
        <ItemArvoreAddRoot sx={{marginLeft: "5px"}}
            key={(parentId ? 99 + parentId : 0) + ''} label={
                <span>
                    <Button onClick={() => novoObjeto(parentId)} sx={btnStyle} title="Novo diretório"
                        data-bs-toggle="modal" data-bs-target="#modalEdicaoDir">
                        <FontAwesomeIcon icon={faFolderPlus} style={iconActionLstStyle} />
                    </Button>
                    <Button sx={btnStyle} title="Adicionar arquivo" onClick={() => novoArquivo(parentId)}
                        data-bs-toggle="modal" data-bs-target="#modalEdicaoArq">
                        <FontAwesomeIcon icon={faFileArrowUp} style={iconActionLstStyle} />
                    </Button>
                </span>}
            nodeId={(parentId ? 99 + parentId : 0) + ''}
        />
    )
}

export default function DiretorioItem({ obj, children }) {

    const { editarObjeto, editarArquivo, remover, removerArquivo, acaoDownloadArquivo } = useContext(DiretorioContext);

    const dirLabel = <div onClick={event => event.stopPropagation()}>
        <div>
            <FontAwesomeIcon icon={faFolder} style={iconLstStyle} />
            <label sx={{marginRight:"20px"}}>{obj.nome}</label>
            <span className="actionBtns" sx={{paddingLeft: "30px"}}>
                <Button className="btn btn-sm" title="Editar"
                    onClick={() => editarObjeto(obj.codigo)} sx={btnStyle}
                    data-bs-toggle="modal" data-bs-target="#modalEdicaoDir">
                    <FontAwesomeIcon icon={faPenToSquare} style={iconActionLstStyle}/>
                </Button>
                <Button className="btn btn-sm" title="Remover" sx={btnStyle}
                    onClick={() => { remover(obj.codigo); }}>
                    <FontAwesomeIcon icon={faTrash} style={iconActionLstStyle}/>
                </Button>
            </span>
        </div>
    </div>

    const arqLabel = <div onClick={event => event.stopPropagation()}>
        <div>
            {getTipoIcone(obj.formato)}
            <label>{obj.nome}{obj.formato}</label>
            <span className="actionBtns" sx={{paddingLeft: "30px"}}>
                <Button className="btn btn-sm" title="Baixar" sx={btnStyle}
                        onClick={() => { acaoDownloadArquivo(obj); }}>
                    <FontAwesomeIcon icon={faDownload} style={iconActionsStyle}/>
                </Button>
                <Button className="btn btn-sm" title="Copiar CID" sx={btnStyle}
                        onClick={() => { copyContent(obj.cid); }}>
                    <FontAwesomeIcon icon={faHashtag} style={iconActionsStyle}/>
                </Button>
                <Button className="btn btn-sm" title="Editar arquivo" sx={btnStyle}
                    onClick={() => { editarArquivo(obj.codigo); }} data-bs-toggle="modal" data-bs-target="#modalEdicaoArq">
                    <FontAwesomeIcon icon={faPenToSquare} style={iconActionsStyle}/>
                </Button>
                <Button className="btn btn-sm" title="Remover arquivo" sx={btnStyle}
                    onClick={() => { removerArquivo(obj.codigo, obj.cid, obj.servico); }}>
                    <FontAwesomeIcon icon={faTrash} style={iconActionsStyle}/>
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
    } else if (obj.cid || obj.servico){
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