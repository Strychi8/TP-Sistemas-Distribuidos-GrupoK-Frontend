import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Layout from './components/Layout';

// Configuración de las rutas de la navbar
const navigationLinks = [
  { path: "/vehiculos", label: "Vehículos" },
  { path: "/clientes", label: "Clientes" },
  { path: "/reservas", label: "Reservas" },
  { path: "/mis-reservas", label: "Mis Reservas" },
  { path: "/catalogo", label: "Catálogo"}
];

function App() {
  return (
      <BrowserRouter>
        <Layout navbarLinks={navigationLinks}>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
  );
}

export default App;
