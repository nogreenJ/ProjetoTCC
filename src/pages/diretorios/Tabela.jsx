import { useContext } from "react";
import DiretorioContext from "./DiretorioContext";
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
                    ".MuiCollapse-root": {
                        marginLeft: "43px !important",
                        borderLeft: "dashed lightgrey 2px"
                    },
                    "button": {
                        padding: 0,
                        fontSize: "15px",
                        marginLeft: "-5px",
                        marginTop: "-4px",
                        height: "25px",
                        paddingTop: "7px",
                    },
                    ".actionBtns": {
                        paddingLeft: "20px !important"
                    }
                }
            }
        }
    }
});


function Tabela() {

    const { getTreeItemsFromData } = useContext(DiretorioContext);

    return (
        <div style={{ marginTop: '-16px' }}>
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