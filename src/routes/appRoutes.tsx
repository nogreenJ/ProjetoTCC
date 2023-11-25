import { RouteType } from "./config";
import Folder from '@mui/icons-material/Folder';
import Person from '@mui/icons-material/Person';
import TokenIcon from '@mui/icons-material/Token';
import Diretorio from "../pages/diretorios/Diretorio";
import Servico from "../pages/servicos/Servico";
import Configuracoes from "../pages/configuracoes/Configuracoes";

const appRoutes: RouteType[] = [
  {
    index: true,
    path: "/",
    element: <Diretorio />,
    state: "diretorios",
    sidebarProps: {
      displayText: "Diretórios",
      icon: <Folder />
    }
  },
  {
    index: true,
    path: "/servicos",
    element: <Servico />,
    state: "servicos",
    sidebarProps: {
      displayText: "Serviços",
      icon: <TokenIcon />
    }
  },
  {
    index: true,
    path: "/config",
    element: <Configuracoes />,
    state: "configuracoes",
    sidebarProps: {
      displayText: "Conta",
      icon: <Person />
    },
  }
];

export default appRoutes;