import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Layout from './components/Layout';
import { ApolloProvider } from '@apollo/client/react';
import { client } from './config/apolloClient';

// Configuración de las rutas de la navbar
const navigationLinks = [
  { path: "/vehiculos", label: "Vehículos" },
  { path: "/clientes", label: "Clientes" },
  { path: "/reservas", label: "Reservas" }
];

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Layout navbarLinks={navigationLinks}>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
