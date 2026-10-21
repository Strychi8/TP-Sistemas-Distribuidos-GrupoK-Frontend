import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaCar,
  FaCheck,
  FaShieldAlt,
  FaInfoCircle,
} from "react-icons/fa";
import externalVehicleService from "../services/externalVehicleService";
import { useAuth } from "../../../context/AuthContext";

const TIPOS_VEHICULO = ["SEDAN", "SUV", "PICKUP", "HATCHBACK", "COUPE"];

const ExternalVehicleFormPage = () => {
  const navigate = useNavigate();
  const { user, clientProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      patente: "",
      marca: "",
      modelo: "",
      anio: new Date().getFullYear(),
      color: "",
      tipoVehiculo: "SEDAN",
      precioDiario: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Enviando postulación de vehículo...");

    try {
      const payload = {
        clienteId: clientProfile?.id || user?.id || 1,
        patente: data.patente.toUpperCase(),
        marca: data.marca,
        modelo: data.modelo,
        anio: parseInt(data.anio, 10),
        color: data.color,
        tipoVehiculo: data.tipoVehiculo,
        precioDiario: parseFloat(data.precioDiario),
      };

      await externalVehicleService.create(payload);

      toast.update(toastId, {
        render:
          "¡Vehículo postulado con éxito! Se inició el proceso de validación asíncrono (Kafka).",
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });

      navigate("/mis-vehiculos");
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al registrar la solicitud de vehículo";

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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Botón Volver y Título */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/mis-vehiculos"
          className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
          title="Volver a mis vehículos"
        >
          <FaArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Postular Mi Vehículo
          </h1>
          <p className="text-sm text-gray-500">
            Completá los datos del vehículo para incorporarlo al catálogo de Rentar
          </p>
        </div>
      </div>

      {/* Cartel Informativo sobre el proceso */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <FaShieldAlt className="text-blue-600 text-xl mt-0.5 flex-shrink-0" />
        <div className="text-xs sm:text-sm text-blue-900 leading-relaxed">
          <p className="font-semibold mb-1">
            Proceso de Incorporación Asíncrono (Hito 3)
          </p>
          <p className="text-blue-800">
            Tu vehículo comenzará en estado <strong>PENDIENTE</strong>. Mediante
            eventos de mensajería (Kafka), se dispararán automáticamente las
            siguientes verificaciones:
          </p>
          <ul className="list-disc pl-5 mt-1 space-y-0.5 text-blue-700">
            <li>Chequeo contra registro de vehículos robados (policial).</li>
            <li>
              Cotejo de titularidad en el registro automotor con tu DNI{" "}
              <span className="font-semibold font-mono">
                ({clientProfile?.documento || "DNI Asociado"})
              </span>
              .
            </li>
          </ul>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Patente */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Patente / Dominio <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={7}
                placeholder="Ej: AA123BB o ABC123"
                {...register("patente", {
                  required: "La patente es obligatoria",
                  pattern: {
                    value: /^([A-Z]{3}\d{3}|[A-Z]{2}\d{3}[A-Z]{2})$/i,
                    message: "Formato inválido (Ej: ABC123 o AA123BB)",
                  },
                })}
                className={`w-full px-4 py-2 border rounded-lg uppercase tracking-wider font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                  errors.patente ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.patente ? (
                <p className="text-xs text-red-600 mt-1">
                  {errors.patente.message}
                </p>
              ) : (
                <p className="text-[11px] text-gray-400 mt-1">
                  Formato Mercosur (AA123BB) o tradicional (ABC123)
                </p>
              )}
            </div>

            {/* Tipo de Vehículo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tipo de Vehículo <span className="text-red-500">*</span>
              </label>
              <select
                {...register("tipoVehiculo", {
                  required: "El tipo de vehículo es obligatorio",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white transition"
              >
                {TIPOS_VEHICULO.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Marca <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Toyota, Volkswagen, Ford"
                {...register("marca", {
                  required: "La marca es obligatoria",
                  minLength: {
                    value: 2,
                    message: "Debe tener al menos 2 caracteres",
                  },
                })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                  errors.marca ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.marca && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.marca.message}
                </p>
              )}
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Modelo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Corolla XEI, Nivus, Hilux"
                {...register("modelo", {
                  required: "El modelo es obligatorio",
                  minLength: {
                    value: 2,
                    message: "Debe tener al menos 2 caracteres",
                  },
                })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                  errors.modelo ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.modelo && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.modelo.message}
                </p>
              )}
            </div>

            {/* Año de Fabricación */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Año de Fabricación <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Ej: 2022"
                {...register("anio", {
                  required: "El año es obligatorio",
                  min: {
                    value: 2000,
                    message: "El vehículo no puede ser anterior al año 2000",
                  },
                  max: {
                    value: new Date().getFullYear() + 1,
                    message: "El año no puede ser superior al próximo año",
                  },
                })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                  errors.anio ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.anio && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.anio.message}
                </p>
              )}
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Color <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Blanco Perlado, Gris Platino, Negro"
                {...register("color", {
                  required: "El color es obligatorio",
                })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                  errors.color ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.color && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.color.message}
                </p>
              )}
            </div>
          </div>

          {/* Precio Diario Sugerido */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Precio Diario Estimado de Alquiler ($ ARS){" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 font-semibold">
                $
              </span>
              <input
                type="number"
                step="500"
                placeholder="Ej: 45000"
                {...register("precioDiario", {
                  required: "El precio diario es obligatorio",
                  min: {
                    value: 1000,
                    message: "El precio diario mínimo es $1.000",
                  },
                })}
                className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                  errors.precioDiario
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
            </div>
            {errors.precioDiario ? (
              <p className="text-xs text-red-600 mt-1">
                {errors.precioDiario.message}
              </p>
            ) : (
              <p className="text-[11px] text-gray-400 mt-1">
                Monto que se cobrará por día de reserva una vez que el auto sea aprobado.
              </p>
            )}
          </div>

          {/* Acciones */}
          <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
            <Link
              to="/mis-vehiculos"
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Procesando postulación...
                </>
              ) : (
                <>
                  <FaCheck /> Postular Vehículo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExternalVehicleFormPage;
