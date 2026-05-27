import { Routes, Route, BrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { MenuProvider } from '@/contexts/MenuContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Sidebar from '@/components/Sidebar';
import Overlay from '@/components/Sidebar/Overlay';
import Footer from '@/components/Footer';
import LoginPage from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Perfil from '@/pages/Perfil';
import NotFound from '@/pages/NotFound';

import ListaTransacoes from '@/pages/Transacoes/ListaTransacoes';
import FormTransacao from '@/pages/Transacoes/FormTransacao';
import ListaCofrinhos from '@/pages/Cofrinhos/ListaCofrinhos';
import FormCofrinho from '@/pages/Cofrinhos/FormCofrinho';
import ListaUsuarios from '@/pages/Usuarios/ListaUsuarios';
import FormUsuario from '@/pages/Usuarios/FormUsuario';

const ProtectedLayout = () => {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;

  return (
    <MenuProvider>
      <div id="wrapper">
        <Sidebar />
        <Overlay />
        <div id="page-content-wrapper">
          <Outlet />
        </div>
      </div>
      <Footer />
    </MenuProvider>
  );
};

const AppRoutes = () => (
  <ThemeProvider>
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/transacoes" element={<ListaTransacoes />} />
          <Route path="/transacoes/nova" element={<FormTransacao />} />
          <Route path="/transacoes/:id" element={<FormTransacao />} />

          <Route path="/cofrinhos" element={<ListaCofrinhos />} />
          <Route path="/cofrinhos/novo" element={<FormCofrinho />} />
          <Route path="/cofrinhos/:id" element={<FormCofrinho />} />

          <Route path="/usuarios" element={<ListaUsuarios />} />
          <Route path="/usuarios/novo" element={<FormUsuario />} />
          <Route path="/usuarios/:id" element={<FormUsuario />} />

          <Route path="/perfil" element={<Perfil />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
  </ThemeProvider>
);

export default AppRoutes;
