import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaHome, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const ErrorView = ({ status = 404, title, message }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getDefaultContent = (code) => {
    switch (code) {
      case 403:
        return {
          title: "Acceso Denegado",
          message:
            "No cuentas con los permisos necesarios para visualizar esta sección.",
        };
      case 401:
        return {
          title: "Sesión Expirada o No Autorizada",
          message: "Por favor, inicia sesión nuevamente para continuar.",
        };
      case 500:
        return {
          title: "Error del Servidor",
          message:
            "Ocurrió un error inesperado en nuestros servidores. Intenta nuevamente más tarde.",
        };
      case 404:
      default:
        return {
          title: "Página No Encontrada",
          message: "La ruta o recurso que buscas no existe o ha sido movido.",
        };
    }
  };

  const content = getDefaultContent(status);
  const displayTitle = title || content.title;
  const displayMessage = message || content.message;

  const handleHomeRedirect = () => {
    if (!user) {
      navigate("/login");
    } else if (user.rol === "ADMINISTRADOR") {
      navigate("/vehiculos");
    } else {
      navigate("/catalogo");
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-gray-100">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 text-amber-600 rounded-full mb-6">
          <FaExclamationTriangle size={36} />
        </div>
        <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
          Error {status}
        </span>
        <h1 className="text-2xl font-bold text-gray-800 mt-1 mb-3">
          {displayTitle}
        </h1>
        <p className="text-gray-600 mb-8 text-sm leading-relaxed">
          {displayMessage}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
          >
            <FaArrowLeft /> Volver atrás
          </button>
          <button
            onClick={handleHomeRedirect}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow transition"
          >
            <FaHome /> Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorView;