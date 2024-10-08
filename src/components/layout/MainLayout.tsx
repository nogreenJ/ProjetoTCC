import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import colorConfigs from "../../configs/colorConfigs";
import sizeConfigs from "../../configs/sizeConfigs";
import Sidebar from "../common/Sidebar";
import Topbar from "../common/Topbar";
import { getToken } from "../../seguranca/Autenticacao";
import Login from "../../pages/login/Login";
import Ipfs from "../../ipfs/Ipfs";

const MainLayout = () => {
  if (getToken() != null) {
    return (
      <Box sx={{ display: "flex" }}>
        <Ipfs>
          <Topbar />
          <Box
            component="nav"
            sx={{
              width: sizeConfigs.sidebar.width,
              flexShrink: 0
            }}
          >
            <Sidebar />
          </Box>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: `calc(100% - ${sizeConfigs.sidebar.width})`,
              minHeight: "100vh",
              backgroundColor: colorConfigs.mainBg
            }}
          >
            <Toolbar />
            <Outlet />
          </Box>
        </Ipfs>
      </Box>
    );
  }
  else {
    return (<Login />);
  }
};

export default MainLayout;