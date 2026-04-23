import { BrowserRouter, Routes, Route } from "react-router-dom"
import AppLayout from "./components/layout/AppLayout"
import ConverterPage from "./pages/ConverterPage"
import HistoricoPage from "./pages/HistoricoPage"
import AlertasPage from "./pages/AlertasPage"
import SimuladorPage from "./pages/SimuladorPage"
import SobrePage from "./pages/SobrePage"
import SuportePage from "./pages/SuportePage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<ConverterPage />} />
          <Route path="historico" element={<HistoricoPage />} />
          <Route path="alertas" element={<AlertasPage />} />
          <Route path="simulador" element={<SimuladorPage />} />
          <Route path="sobre" element={<SobrePage />} />
          <Route path="suporte" element={<SuportePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}