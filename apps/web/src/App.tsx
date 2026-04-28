import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import AppLayout from "./components/layout/AppLayout"
import ConverterPage from "./pages/ConverterPage"
import HistoricoPage from "./pages/HistoricoPage"
import AlertasPage from "./pages/AlertasPage"
import SimuladorPage from "./pages/SimuladorPage"
import SobrePage from "./pages/SobrePage"
import SuportePage from "./pages/SuportePage"
import LoginPage from "./pages/LoginPage"
import CadastroPage from "./pages/CadastroPage"
import PerfilPage from "./pages/PerfilPage"


function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) return null
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<ConverterPage />} />
          <Route path="historico" element={<HistoricoPage />} />
          <Route path="alertas" element={<AlertasPage />} />
          <Route path="simulador" element={<SimuladorPage />} />
          <Route path="sobre" element={<SobrePage />} />
          <Route path="suporte" element={<SuportePage />} />
          <Route path="perfil" element={<PerfilPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}