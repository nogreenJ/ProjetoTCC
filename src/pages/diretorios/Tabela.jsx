import { useContext } from "react";
import DiretorioContext from "./DiretorioContext";
import Alerta from '../../components/common/Alerta';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
    components: {
        MuiTreeItem: {
            styleOverrides: {
                root: {
                    ".MuiTreeItem-label": {
                        fontSize: "20px"
                    },
                    "button": {
                        padding: 0,
                        fontSize: "15px",
                        color: "grey"
                    }
                }
            }
        }
    }
});


function Tabela() {

    const { alerta, listaObjetos, remover, novoObjeto, editarObjeto, getTreeItemsFromData, getListFromData } = useContext(DiretorioContext);

    return (
        <div style={{ padding: '20px' }}>
            <Alerta alerta={alerta} />
            {listaObjetos.length === 0 && <h1>Nenhum diretório encontrado</h1>}
            {listaObjetos.length > 0 && (
                <TreeView
                    aria-label="file system navigator"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                >
                    <ThemeProvider theme={theme}>
                        {getTreeItemsFromData()}
                    </ThemeProvider>
                </TreeView>
            )}
        </div>
    )
    /*
    
            <button type="button" className="btn btn-primary"
                data-bs-toggle="modal" data-bs-target="#modalEdicao"
                onClick={() => novoObjeto()}>
                <i className="bi bi-folder-plus"></i>
            </button>
    */
}

export default Tabela;