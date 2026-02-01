import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Herramientas from './pages/Herramientas';
import Empleados from './pages/Empleados';
import Prestamos from './pages/Prestamos';
import Mantenimientos from './pages/Mantenimientos';
import Perfil from './pages/Perfil';
import Registro from './pages/Registro';
import Configuracion from './pages/Configuracion';
import Usuarios from './pages/Usuarios';
import Escanear from './pages/Escanear';
import Reportes from './pages/Reportes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/herramientas" element={<ProtectedRoute><Herramientas /></ProtectedRoute>} />
        <Route path="/empleados" element={<ProtectedRoute><Empleados /></ProtectedRoute>} />
        <Route path="/prestamos" element={<ProtectedRoute><Prestamos /></ProtectedRoute>} />
        <Route path="/mantenimientos" element={<ProtectedRoute><Mantenimientos /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="/configuracion" element={<ProtectedRoute><Configuracion /></ProtectedRoute>} />
        <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
        <Route path="/escanear" element={<ProtectedRoute><Escanear /></ProtectedRoute>} />
        <Route path="/reportes" element={<ProtectedRoute><Reportes /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
