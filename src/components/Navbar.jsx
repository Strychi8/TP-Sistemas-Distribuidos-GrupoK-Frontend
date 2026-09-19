import { useLocation, Link } from "react-router-dom";


function Navbar({brandLogo = '/rentar-logo.svg', brandAlt = 'Rentar Logo', links = [] }) {
  // Para saber qué ruta se encuentra activa
  const location = useLocation();
  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-auto">
          <div className="flex items-center my-3">
            {/* Logo de la Marca clickable que te lleva al Home */}
            <Link to="/" className="flex-shrink-0 flex items-center bg-blue-300">
              <img
                src={brandLogo}
                alt={brandAlt}
                className="h-12 w-auto hover:opacity-80 transition-opacity"
              />
            </Link>
            {/* Links de Navegación */}
            <div className="ml-10 flex items-baseline space-x-4">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;