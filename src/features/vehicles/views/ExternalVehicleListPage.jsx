import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaCar,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaIdCard,
  FaInfoCircle,
  FaBolt,
  FaRedoAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import externalVehicleService from "../services/externalVehicleService";
import { useAuth } from "../../../context/AuthContext";
import dayjs from "dayjs";

const ExternalVehicleListPage = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await externalVehicleService.getAllByCliente(user?.id || 1);
      setVehicles(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar tus vehículos externos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line
  }, []);

  const handleSimulateKafka = async (id, patenteResult, titularidadResult) => {
    try {
      setResolvingId(id);
      const toastId = toast.loading("Simulando eventos de Apache Kafka...");
      const updated = await externalVehicleService.simulateKafkaResolution(id, {
        validacionPatente: patenteResult,
        validacionTitularidad: titularidadResult,
      });

      const message =
        updated.estado === "APROBADO"
          ? "¡Eventos recibidos! El vehículo fue APROBADO e incorporado al sistema."
          : "¡Eventos recibidos! El vehículo fue RECHAZADO por observaciones en las validaciones.";

      toast.update(toastId, {
        render: message,
        type: updated.estado === "APROBADO" ? "success" : "warning",
        isLoading: false,
        autoClose: 4000,
      });

      fetchVehicles();
    } catch (error) {
      console.error(error);
      toast.error("Error al simular la resolución de Kafka");
    } finally {
      setResolvingId(null);
    }
  };

  const handleResetData = () => {
    externalVehicleService.resetMockData();
    toast.info("Datos de prueba restaurados a su estado inicial");
    fetchVehicles();
  };

  const getStatusBadge = (estado) => {
    switch (estado) {
      case "APROBADO":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <FaCheckCircle className="text-emerald-600" /> APROBADO
          </span>
        );
      case "RECHAZADO":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <FaTimesCircle className="text-rose-600" /> RECHAZADO
          </span>
        );
      case "PENDIENTE":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
            <FaClock className="text-amber-600" /> PENDIENTE
          </span>
        );
    }
  };

  const getValidationBadge = (resultado) => {
    switch (resultado) {
      case "VALIDADO":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FaCheckCircle className="text-emerald-500" /> Validado
          </span>
        );
      case "RECHAZADO":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <FaTimesCircle className="text-rose-500" /> Rechazado
          </span>
        );
      case "PENDIENTE":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <FaClock className="text-amber-500" /> En curso
          </span>
        );
    }
  };

  const stats = {
    total: vehicles.length,
    pendientes: vehicles.filter((v) => v.estado === "PENDIENTE").length,
    aprobados: vehicles.filter((v) => v.estado === "APROBADO").length,
    rechazados: vehicles.filter((v) => v.estado === "RECHAZADO").length,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Mis Vehículos Propuestos
            </h1>
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full uppercase tracking-wider">
              Hito 3 • Propietarios Externos
            </span>
          </div>
          <p className="text-gray-500 mt-1 text-sm">
            Registrá tus autos para sumarlos a la flota de alquiler y hacé el seguimiento del proceso de validación asíncrono.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleResetData}
            title="Restablecer datos de prueba a valores iniciales"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <FaRedoAlt /> Reiniciar Demo
          </button>
          <Link
            to="/mis-vehiculos/nuevo"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow transition duration-200 text-sm"
          >
            <FaPlus /> Postular Mi Vehículo
          </Link>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FaCar size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Solicitudes</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <FaClock size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">En Verificación</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pendientes}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <FaCheckCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Aprobados</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.aprobados}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <FaTimesCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Rechazados</p>
            <p className="text-2xl font-bold text-rose-600">{stats.rechazados}</p>
          </div>
        </div>
      </div>

      {/* Cartel Informativo sobre el flujo de eventos Kafka */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-4 rounded-r-lg mb-8 shadow-sm">
        <div className="flex items-start gap-3">
          <FaInfoCircle className="text-blue-600 text-lg mt-0.5 flex-shrink-0" />
          <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-blue-950">
              ¿Cómo funciona la incorporación de vehículos externos?
            </span>
            <p className="mt-1">
              Al postular un vehículo, este inicia en estado <strong>PENDIENTE</strong>. Mediante el broker de eventos <strong>Apache Kafka</strong>, se publican eventos asíncronos para:
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-0.5 text-gray-600">
              <li>
                <strong>Verificación policial de robo:</strong> se contrasta la patente contra el registro policial.
              </li>
              <li>
                <strong>Validación de titularidad:</strong> se constata que tu DNI coincida con el titular en el registro automotor simulado.
              </li>
            </ul>
            <p className="mt-1 text-gray-600">
              Solo cuando ambas validaciones resultan satisfactorias, el auto pasa automáticamente a <strong>APROBADO</strong> y queda disponible para reservas.
            </p>
          </div>
        </div>
      </div>

      {/* Contenido Principal / Listado */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-500">Cargando tus solicitudes...</p>
          </div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCar size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            Aún no has postulado ningún vehículo
          </h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            Podés registrar un vehículo de tu propiedad para incorporarlo a la plataforma y comenzar a generar ingresos.
          </p>
          <Link
            to="/mis-vehiculos/nuevo"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg text-sm shadow transition"
          >
            <FaPlus /> Registrar mi primer vehículo
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Vehículo</th>
                  <th className="px-6 py-4">Patente</th>
                  <th className="px-6 py-4">Año / Tipo</th>
                  <th className="px-6 py-4">Precio Diario</th>
                  <th className="px-6 py-4">Estado General</th>
                  <th className="px-6 py-4">Validaciones Kafka</th>
                  <th className="px-6 py-4 text-center">Simulación / Demo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    {/* Vehículo */}
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                          <FaCar />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {v.marca} {v.modelo}
                          </p>
                          <p className="text-xs text-gray-400">
                            Color: {v.color} • Postulado el {dayjs(v.fechaRegistro).format("DD/MM/YYYY")}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Patente */}
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 bg-gray-900 text-white font-mono text-xs font-bold rounded tracking-wider shadow-sm border border-gray-700">
                        {v.patente}
                      </span>
                    </td>

                    {/* Año / Tipo */}
                    <td className="px-6 py-4">
                      <span className="text-gray-800 font-medium">{v.anio}</span>
                      <span className="text-xs text-gray-400 block">{v.tipoVehiculo}</span>
                    </td>

                    {/* Precio Diario */}
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ${v.precioDiario?.toLocaleString("es-AR")}
                      <span className="text-xs text-gray-400 block font-normal">/día</span>
                    </td>

                    {/* Estado General */}
                    <td className="px-6 py-4">
                      {getStatusBadge(v.estado)}
                      {v.motivoRechazo && (
                        <p className="text-[11px] text-rose-600 mt-1 max-w-xs leading-tight">
                          {v.motivoRechazo}
                        </p>
                      )}
                    </td>

                    {/* Validaciones Kafka */}
                    <td className="px-6 py-4 space-y-1.5">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="flex items-center gap-1 text-gray-500 text-[11px]">
                          <FaShieldAlt className="text-gray-400" /> Registro Policial:
                        </span>
                        {getValidationBadge(v.validacionPatente)}
                      </div>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="flex items-center gap-1 text-gray-500 text-[11px]">
                          <FaIdCard className="text-gray-400" /> Titularidad:
                        </span>
                        {getValidationBadge(v.validacionTitularidad)}
                      </div>
                    </td>

                    {/* Acciones / Simulación Demo */}
                    <td className="px-6 py-4 text-center">
                      {v.estado === "PENDIENTE" ? (
                        <div className="flex flex-col gap-1.5 items-center">
                          <button
                            disabled={resolvingId === v.id}
                            onClick={() =>
                              handleSimulateKafka(v.id, "VALIDADO", "VALIDADO")
                            }
                            className="w-full px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium flex items-center justify-center gap-1 shadow-sm transition disabled:opacity-50"
                          >
                            <FaBolt className="text-[10px]" /> Simular Aprobación
                          </button>
                          <button
                            disabled={resolvingId === v.id}
                            onClick={() =>
                              handleSimulateKafka(v.id, "VALIDADO", "RECHAZADO")
                            }
                            className="w-full px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-xs font-medium flex items-center justify-center gap-1 transition disabled:opacity-50"
                          >
                            <FaBolt className="text-[10px]" /> Simular Rechazo
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          Proceso completado
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalVehicleListPage;
