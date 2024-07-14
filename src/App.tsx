import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getToken } from './seguranca/Autenticacao';
import { routes } from './routes';
import MainLayout from "./components/layout/MainLayout";
import "./app.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<MainLayout />}>
          {getToken != null ? routes : null}
        </Route>
      </Routes>
      <ToastContainer autoClose={5000} />
    </BrowserRouter>
  );
}

export default App;
