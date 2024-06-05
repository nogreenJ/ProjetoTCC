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

    const { alerta, getTreeItemsFromData } = useContext(DiretorioContext);

    return (
        <div style={{ marginTop: '-16px' }}>
            <Alerta alerta={alerta} />
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
        </div>
    )
}

export default Tabela;