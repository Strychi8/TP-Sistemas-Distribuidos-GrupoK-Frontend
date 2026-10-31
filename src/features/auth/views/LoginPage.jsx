import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaSignInAlt, FaCar } from "react-icons/fa";
import dayjs from "dayjs";
import { useAuth } from '../../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Iniciando sesión...");

    try {
      const response = await login(data);

      toast.update(toastId, {
        render: `Bienvenido (${response.rol})`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      if (response.rol === 'ADMINISTRADOR') {
        navigate("/vehiculos");
      } else {
        navigate("/catalogo");
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || "Error al iniciar sesión";
      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FaCar className="text-blue-600 text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Rentar</h1>
            <p className="text-gray-500 mt-1">
              Iniciá sesión para continuar
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  {...register("email", {
                    required: "El email es obligatorio",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Formato de email inválido",
                    },
                  })}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaLock />
                </span>
                <input
                  type="password"
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 6,
                      message:
                        "La contraseña debe tener al menos 6 caracteres",
                    },
                  })}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <FaSignInAlt />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>
        </div>

        {/* Copyright */}
        <p className="text-center text-sm text-gray-400 mt-6">
          &copy; {dayjs().year()} Rentar. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
