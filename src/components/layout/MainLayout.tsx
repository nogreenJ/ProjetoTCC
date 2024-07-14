import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import colorConfigs from "../../configs/colorConfigs";
import sizeConfigs from "../../configs/sizeConfigs";
import Sidebar from "../common/Sidebar";
import Topbar from "../common/Topbar";
import { getToken } from "../../seguranca/Autenticacao";
import Login from "../../pages/login/Login";
import Helia from "../../ipfs/helia/Helia";

const MainLayout = () => {
  if (getToken() != null) {
    return (
      <Box sx={{ display: "flex" }}>
        <Helia>
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
        </Helia>
      </Box>
    );
  }
  else {
    return (<Login />);
  }
};

export default MainLayout;