import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getToken } from "./seguranca/Autenticacao";
import MainLayout from "./components/layout/MainLayout";
import { routes } from "./routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
])

function App() {

  if (getToken() != null) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {routes}
          </Route>
        </Routes>
      </BrowserRouter>
    );
  } else {
    return (
      <RouterProvider router={router} />
    );
  }
}

/*function App() {
  /*if (getToken() != null) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {routes}
          </Route>
        </Routes>
      </BrowserRouter>
    );
  } else {
  return Login();
  //}
}*/

export default App;
