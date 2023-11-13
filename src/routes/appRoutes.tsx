import { RouteType } from "./config";
import Folder from '@mui/icons-material/Folder';
import Person from '@mui/icons-material/Person';
import Diretorio from "../pages/diretorios/Diretorio";
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
    path: "/config",
    element: <Configuracoes />,
    state: "configuracoes",
    sidebarProps: {
      displayText: "Conta",
      icon: <Person />
    },
  },
  /*{
    path: "/usuarios",
    element: <Usuario />,
    state: "usuarios",
    sidebarProps: {
      displayText: "Usuários",
      icon: <Person />
    }
  },
  {
    path: "/config",
    element: <Configuracoes />,
    state: "configuracoes",
    sidebarProps: {
      displayText: "Configurações",
      icon: <Settings />
    },
    child: [
      {
        index: true,
        path: "/config",
        element: <Configuracoes />,
        state: "configuracoes.gateways",
        sidebarProps: {
          displayText: "Gateways"
        },
      },
    ]
  }*/
];

export default appRoutes;