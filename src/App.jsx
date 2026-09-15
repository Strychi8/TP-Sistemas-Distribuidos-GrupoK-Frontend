import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar Simple (opcional pero ayuda a la navegación) */}
      <nav className="bg-gray-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl tracking-wider text-blue-400">Rentar</span>
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="/vehiculos" className="px-3 py-2 rounded-md text-sm font-medium bg-gray-900 text-white">Vehículos</a>
                <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700">Clientes</a>
                <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700">Reservas</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenedor Principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <AppRoutes />
      </main>

      {/* ToastContainer global para notificaciones */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;
