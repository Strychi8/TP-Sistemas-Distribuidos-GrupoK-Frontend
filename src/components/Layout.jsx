import Navbar from "./Navbar";
import { ToastContainer } from "react-toastify";

function Layout({ children, navbarLinks }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Inyectamos el Navbar pasándole los links configurados */}
      <Navbar brand="Rentar" links={navbarLinks} />
      {/* Contenedor dinámico para las páginas */}
      <main className="flex-grow max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      {/* Notificaciones globales en el pie de la app */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default Layout;
