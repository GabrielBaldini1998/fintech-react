import { Routes, Route, BrowserRouter } from "react-router-dom";
import { MenuProvider } from "./componentes/MenuLateral/MenuContext/MenuContext";
import MenuLateral from "./componentes/MenuLateral";
import OverlayMenu from "./componentes/MenuLateral/OverlayMenu";
import Inicio from "./paginas/Inicio";
import Investimentos from "./paginas/Investimentos";
import Transferencia from "./paginas/Transferencia";
import Perfil from "./paginas/Perfil";
import Sair from "./paginas/Sair";
import Footer from "./componentes/Footer";

function AppRoutes() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <MenuProvider>
        <div id="wrapper">
          <MenuLateral />
          <OverlayMenu />
          <div id="page-content-wrapper">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/investimentos" element={<Investimentos />} />
              <Route path="/transferir" element={<Transferencia />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/sair" element={<Sair />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </MenuProvider>
    </BrowserRouter>
  )
}

export default AppRoutes;