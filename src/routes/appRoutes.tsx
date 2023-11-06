import { RouteType } from "./config";
import Folder from '@mui/icons-material/Folder';
import Person from '@mui/icons-material/Person';
import Home from "../pages/home/Home";
import Diretorio from "../pages/diretorios/Diretorio";
import Usuario from "../pages/usuarios/Usuario";

const appRoutes: RouteType[] = [
  {
    index: true,
    element: <Home />,
    state: "home"
  },
  {
    path: "/diretorios",
    element: <Diretorio />,
    state: "diretorios",
    sidebarProps: {
      displayText: "Diretórios",
      icon: <Folder />
    }
  },
  {
    path: "/usuarios",
    element: <Usuario />,
    state: "usuarios",
    sidebarProps: {
      displayText: "Usuários",
      icon: <Person />
    }
  },
  /*{
    path: "/dashboard",
    element: <DashboardPageLayout />,
    state: "dashboard",
    sidebarProps: {
      displayText: "Dashboard",
      icon: <DashboardOutlinedIcon />
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "dashboard.index"
      },
      {
        path: "/dashboard/default",
        element: <DefaultPage />,
        state: "dashboard.default",
        sidebarProps: {
          displayText: "Default"
        },
      },
      {
        path: "/dashboard/analytics",
        element: <AnalyticsPage />,
        state: "dashboard.analytics",
        sidebarProps: {
          displayText: "Analytic"
        }
      },
      {
        path: "/dashboard/saas",
        element: <SaasPage />,
        state: "dashboard.saas",
        sidebarProps: {
          displayText: "Saas"
        }
      }
    ]
  },
  {
    path: "/component",
    element: <ComponentPageLayout />,
    state: "component",
    sidebarProps: {
      displayText: "Components",
      icon: <AppsOutlinedIcon />
    },
    child: [
      {
        path: "/component/alert",
        element: <AlertPage />,
        state: "component.alert",
        sidebarProps: {
          displayText: "Alert"
        },
      },
      {
        path: "/component/button",
        element: <ButtonPage />,
        state: "component.button",
        sidebarProps: {
          displayText: "Button"
        }
      }
    ]
  },
  {
    path: "/documentation",
    element: <DocumentationPage />,
    state: "documentation",
    sidebarProps: {
      displayText: "Documentation",
      icon: <ArticleOutlinedIcon />
    }
  },
  {
    path: "/changelog",
    element: <ChangelogPage />,
    state: "changelog",
    sidebarProps: {
      displayText: "Changelog",
      icon: <FormatListBulletedOutlinedIcon />
    }
  }*/
];

export default appRoutes;