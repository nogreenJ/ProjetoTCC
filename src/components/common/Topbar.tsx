import { AppBar, Toolbar, Typography } from "@mui/material";
import colorConfigs from "../../configs/colorConfigs";
import sizeConfigs from "../../configs/sizeConfigs";
import CampoSelect from '../../components/common/CampoSelect';

const Topbar = () => {
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
          Nome Aplicação
        </Typography>
        <CampoSelect id="gateway" name="gateway"
          sx={{ alignSelf: 'flex-end' }}>
          <option key="" value="">
            Sem Gateway
          </option>
        </CampoSelect>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;