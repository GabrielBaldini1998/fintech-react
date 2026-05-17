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

import ListaDespesas from '@/pages/Despesas/ListaDespesas';
import FormDespesa from '@/pages/Despesas/FormDespesa';
import ListaReceitas from '@/pages/Receitas/ListaReceitas';
import FormReceita from '@/pages/Receitas/FormReceita';
import ListaInvestimentos from '@/pages/Investimentos/ListaInvestimentos';
import FormInvestimento from '@/pages/Investimentos/FormInvestimento';

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

          <Route path="/despesas" element={<ListaDespesas />} />
          <Route path="/despesas/novo" element={<FormDespesa />} />
          <Route path="/despesas/:id" element={<FormDespesa />} />

          <Route path="/receitas" element={<ListaReceitas />} />
          <Route path="/receitas/novo" element={<FormReceita />} />
          <Route path="/receitas/:id" element={<FormReceita />} />

          <Route path="/investimentos" element={<ListaInvestimentos />} />
          <Route path="/investimentos/novo" element={<FormInvestimento />} />
          <Route path="/investimentos/:id" element={<FormInvestimento />} />

          <Route path="/perfil" element={<Perfil />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
  </ThemeProvider>
);

export default AppRoutes;
