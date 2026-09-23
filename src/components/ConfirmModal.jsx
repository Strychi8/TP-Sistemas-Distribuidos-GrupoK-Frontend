import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({ isOpen, onClose, title, children }) => {
  // Manejar el cierre con la tecla Escape y bloquear el scroll del fondo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop oscuro con blur */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Contenedor del Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto z-10 overflow-hidden transform transition-all animate-fade-in-up">
        {/* Cabecera */}
        {title && (
          <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-2 transition-colors focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>
        )}
        
        {/* Cuerpo */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
