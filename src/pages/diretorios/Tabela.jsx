import { useContext } from "react";
import DiretorioContext from "./DiretorioContext";
import Alerta from '../../components/common/Alerta';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Dialogo from '../../components/common/Dialogo';
import CampoEntrada from '../../components/common/CampoEntrada';

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
        <div style={{ marginTop: '-16px' }}>
            <Alerta alerta={alerta} />
            {listaObjetos.length === 0 && <h1>Nenhum diretório encontrado</h1>}
            {listaObjetos.length > 0 && (
                <TreeView
                    key="keyRoot"
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
}

export default Tabela;