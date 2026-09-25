import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Navbar({ brandLogo = "/rentar-logo.svg", brandAlt = "Rentar Logo" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const isLoginPage = location.pathname === "/login";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate("/login");
  };

  const getNavLinks = () => {
    if (!user) return [];
    if (user.rol === "ADMINISTRADOR") {
      return [
        { path: "/vehiculos", label: "Gestión Vehículos" },
        { path: "/clientes", label: "Gestión Clientes" },
        { path: "/reservas", label: "Todas las Reservas" },
      ];
    } else if (user.rol === "CLIENTE") {
      return [
        { path: "/catalogo", label: "Catálogo de Vehículos" },
        { path: "/mis-reservas", label: "Mis Reservas" },
        { path: "/historial", label: "Historial de Alquileres" },
      ];
    }
    return [];
  };

  const links = getNavLinks();

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Links de navegación */}
          <div className="flex items-center">
            <Link
              to={user?.rol === "ADMINISTRADOR" ? "/vehiculos" : "/catalogo"}
              className="flex-shrink-0 flex items-center bg-blue-300 rounded-lg p-1"
            >
              <img
                src={brandLogo}
                alt={brandAlt}
                className="h-12 w-auto hover:opacity-80 transition-opacity"
              />
            </Link>

            {/* Links de Navegación (ocultos en /login o si no está autenticado) */}
            {!isLoginPage && isAuthenticated && (
              <div className="ml-10 hidden md:flex items-baseline space-x-4">
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
            )}
          </div>

          {/* Dropdown de usuario (oculto en /login) */}
          {!isLoginPage && isAuthenticated && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors focus:outline-none"
              >
                <FaUserCircle size={26} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 text-gray-800">
                  <div className="px-4 py-2 border-b border-gray-100 text-xs text-gray-500">
                    <strong className="text-gray-700">{user?.email}</strong>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FaSignOutAlt />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation links */}
      {!isLoginPage && isAuthenticated && links.length > 0 && (
        <div className="md:hidden px-4 pt-2 pb-3 space-y-1 bg-gray-900 border-t border-gray-700">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
