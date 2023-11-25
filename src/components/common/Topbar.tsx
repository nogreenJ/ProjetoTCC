import { AppBar, Toolbar, Typography } from "@mui/material";
import colorConfigs from "../../configs/colorConfigs";
import sizeConfigs from "../../configs/sizeConfigs";
import CampoSelect from '../../components/common/CampoSelect';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useState, useEffect } from "react";

const Topbar = () => {
  const { appState } = useSelector((state: RootState) => state.appState);
  const [page, setPage] = useState("Nome Aplicação");

  useEffect(() => {
    switch (appState) {
      case 'diretorios':
        setPage("Diretórios");
        break;
      case 'configuracoes':
        setPage("Conta");
        break;
      case 'servicos':
        setPage("Serviços de Pinning");
        break;
      default:
        setPage("Nome Aplicação");
        break;
    }
  }, [appState]);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${sizeConfigs.sidebar.width})`,
        ml: sizeConfigs.sidebar.width,
        boxShadow: "unset",
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color
      }}
    >
      <Toolbar>
        <Typography variant="h6">
          {page}
        </Typography>
        {appState === 'diretorios' && (
          <select
            className="form-select"
            id="gateway"
            name="gateway"
            style={{ width: 200, marginLeft: 'auto', marginRight: 0 }}>
            <option value='0'>Sem gateway</option>
          </select>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;