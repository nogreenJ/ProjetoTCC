import Login from "./login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { routes } from "../routes";
import { getToken } from "../seguranca/Autenticacao";

const Menu = () => {
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
        return Login();
    }
};

export default Menu;