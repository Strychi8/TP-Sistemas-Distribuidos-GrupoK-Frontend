import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import clientService from "../services/clientService";

const ClientFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(isEditMode);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      dni: "",
      email: "",
      telefono: "",
      direccion: "",
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchClient = async () => {
        try {
          const data = await clientService.getById(id);
          reset(data);
        } catch (error) {
          toast.error("Error al cargar los datos del cliente");
          navigate("/clientes");
        } finally {
          setLoading(false);
        }
      };
      fetchClient();
    }
  }, [id, isEditMode, reset, navigate]);

  const onSubmit = async (data) => {
    const toastId = toast.loading(
      isEditMode ? "Actualizando cliente..." : "Registrando cliente...",
    );
    try {
      if (isEditMode) {
        await clientService.update(id, data);
        toast.update(toastId, {
          render: "Cliente actualizado correctamente",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        await clientService.create(data);
        toast.update(toastId, {
          render: "Cliente registrado correctamente",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }
      navigate("/clientes");
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || "Error al guardar el cliente";
      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex items-center mb-6 gap-4">
        <Link
          to="/clientes"
          className="text-gray-500 hover:text-gray-700 transition"
        >
          <FaArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? "Editar Cliente" : "Nuevo Cliente"}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                {...register("nombre", {
                  required: "El nombre es obligatorio",
                })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white ${errors.nombre ? "border-red-500" : "border-gray-300"}`}
                placeholder="Ej: Juan"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido *
              </label>
              <input
                type="text"
                {...register("apellido", {
                  required: "El apellido es obligatorio",
                })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white ${errors.apellido ? "border-red-500" : "border-gray-300"}`}
                placeholder="Ej: Pérez"
              />
              {errors.apellido && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.apellido.message}
                </p>
              )}
            </div>

            {/* DNI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DNI *
              </label>
              <input
                type="text"
                {...register("dni", {
                  required: "El DNI es obligatorio",
                  pattern: {
                    value: /^[0-9]{7,8}$/,
                    message: "DNI inválido (debe tener 7 u 8 dígitos)",
                  },
                })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white ${errors.dni ? "border-red-500" : "border-gray-300"}`}
                placeholder="Ej: 38123456"
              />
              {errors.dni && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.dni.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico *
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Formato de email inválido",
                  },
                })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white ${errors.email ? "border-red-500" : "border-gray-300"}`}
                placeholder="Ej: juan.perez@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                {...register("telefono")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                placeholder="Ej: 1123456789"
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                {...register("direccion")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                placeholder="Ej: Av. Corrientes 1234"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Link
              to="/clientes"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 mr-4 transition"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 shadow transition"
            >
              <FaSave /> {isEditMode ? "Guardar Cambios" : "Registrar Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientFormPage;
