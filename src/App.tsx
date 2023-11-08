import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getToken } from './seguranca/Autenticacao';
import { routes } from './routes';
import MainLayout from "./components/layout/MainLayout";

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
    </BrowserRouter>
  );
}

export default App;
