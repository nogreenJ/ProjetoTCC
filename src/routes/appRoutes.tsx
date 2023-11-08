import { RouteType } from "./config";
import Folder from '@mui/icons-material/Folder';
import Person from '@mui/icons-material/Person';
import Settings from '@mui/icons-material/Settings';
import Diretorio from "../pages/diretorios/Diretorio";
import Usuario from "../pages/usuarios/Usuario";
import { Logout } from "../pages/login/Login"
import MainLayout from "../components/layout/MainLayout";

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
  /*{
    path: "/usuarios",
    element: <Usuario />,
    state: "usuarios",
    sidebarProps: {
      displayText: "Usuários",
      icon: <Person />
    }
  },*/
  {
    path: "/",
    element: <Diretorio />,
    state: "diretorios.configuracoes",
    sidebarProps: {
      displayText: "Configurações",
      icon: <Settings />
    },
    child: [
      {
        path: "/",
        index: true,
        element: <Diretorio />,
        state: "diretorios.configuracoes.conta",
        sidebarProps: {
          displayText: "Conta"
        },
      },
      {
        path: "/",
        index: true,
        element: <Diretorio />,
        state: "dashboard.configuracoes.gateways",
        sidebarProps: {
          displayText: "Gateways"
        },
      },
      {
        path: "/",
        element: <Logout />,
        state: "",
        sidebarProps: {
          displayText: "Sair"
        },
      },
    ]
  }
];

export default appRoutes;