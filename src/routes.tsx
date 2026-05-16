import { Routes, Route, BrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { MenuProvider } from '@/contexts/MenuContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Sidebar from '@/components/Sidebar';
import Overlay from '@/components/Sidebar/Overlay';
import Footer from '@/components/Footer';
import LoginPage from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Despesas from '@/pages/Despesas';
import Receitas from '@/pages/Receitas';
import Investments from '@/pages/Investments';
import Perfil from '@/pages/Perfil';

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
          <Route path="/dashboard"      element={<Dashboard />} />
          <Route path="/despesas"       element={<Despesas />} />
          <Route path="/receitas"       element={<Receitas />} />
          <Route path="/investimentos"  element={<Investments />} />
          <Route path="/perfil"         element={<Perfil />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
  </ThemeProvider>
);

export default AppRoutes;
