import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

function Navbar({ brandLogo = "/rentar-logo.svg", brandAlt = "Rentar Logo", links = [] }) {
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleLogout = () => {
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-auto">
          {/* Logo + Links de navegación */}
          <div className="flex items-center my-3">
            <Link to="/" className="flex-shrink-0 flex items-center bg-blue-300">
              <img
                src={brandLogo}
                alt={brandAlt}
                className="h-12 w-auto hover:opacity-80 transition-opacity"
              />
            </Link>

            {/* Links de Navegación (ocultos en /login) */}
            {!isLoginPage && (
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
            )}
          </div>

          {/* Dropdown de usuario (oculto en /login) */}
          {!isLoginPage && (
            <div className="relative my-3" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full text-gray-300 hover:text-white hover:bg-gray-700 transition-colors focus:outline-none"
              >
                <FaUserCircle size={24} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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
    </nav>
  );
}

export default Navbar;
