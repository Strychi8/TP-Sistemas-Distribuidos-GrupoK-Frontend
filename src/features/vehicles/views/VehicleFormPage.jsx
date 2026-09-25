import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import vehicleService from '../services/vehicleService';

const TIPOS_VEHICULO = ['SEDAN', 'SUV', 'PICKUP', 'COUPE', 'HATCHBACK'];

const VehicleFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(isEditMode);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      patente: '',
      marca: '',
      modelo: '',
      anio: new Date().getFullYear(),
      color: '',
      tipoVehiculo: 'SEDAN',
      precioDiario: '',
      estado: 'DISPONIBLE'
    }
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchVehicle = async () => {
        try {
          const data = await vehicleService.getById(id);
          reset(data);
        } catch {
          toast.error('Error al cargar los datos del vehículo');
          navigate('/vehiculos');
        } finally {
          setLoading(false);
        }
      };
      fetchVehicle();
    }
  }, [id, isEditMode, reset, navigate]);

  const onSubmit = async (data) => {
    const toastId = toast.loading(isEditMode ? 'Actualizando vehículo...' : 'Creando vehículo...');
    try {
      if (isEditMode) {
        // En edición no se envía la patente, y se envía el estado actual
        const payload = {
          marca: data.marca,
          modelo: data.modelo,
          anio: parseInt(data.anio, 10),
          color: data.color,
          tipoVehiculo: data.tipoVehiculo,
          precioDiario: parseFloat(data.precioDiario),
          estado: data.estado
        };
        await vehicleService.update(id, payload);
        toast.update(toastId, { render: 'Vehículo actualizado correctamente', type: 'success', isLoading: false, autoClose: 3000 });
      } else {
        // En creación enviamos la patente y no enviamos estado (el backend pone DISPONIBLE)
        const payload = {
          patente: data.patente.toUpperCase(),
          marca: data.marca,
          modelo: data.modelo,
          anio: parseInt(data.anio, 10),
          color: data.color,
          tipoVehiculo: data.tipoVehiculo,
          precioDiario: parseFloat(data.precioDiario)
        };
        await vehicleService.create(payload);
        toast.update(toastId, { render: 'Vehículo creado correctamente', type: 'success', isLoading: false, autoClose: 3000 });
      }
      navigate('/vehiculos');
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Error al guardar el vehículo';
      toast.update(toastId, { render: errorMessage, type: 'error', isLoading: false, autoClose: 5000 });
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
        <Link to="/vehiculos" className="text-gray-500 hover:text-gray-700 transition">
          <FaArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? 'Editar Vehículo' : 'Nuevo Vehículo'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Patente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patente <span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('patente', { required: 'La patente es obligatoria' })}
                disabled={isEditMode}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 uppercase ${isEditMode ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white border-gray-300'} ${errors.patente ? 'border-red-500' : ''}`}
                placeholder="Ej: AA123BB"
              />
              {errors.patente && <p className="mt-1 text-sm text-red-600">{errors.patente.message}</p>}
            </div>

            {/* Tipo de Vehículo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo <span className="text-red-500">*</span></label>
              <select
                {...register('tipoVehiculo', { required: 'El tipo es obligatorio' })}
                className="w-full px-4 py-2 border border-gray-300 bg-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {TIPOS_VEHICULO.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              {errors.tipoVehiculo && <p className="mt-1 text-sm text-red-600">{errors.tipoVehiculo.message}</p>}
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca <span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('marca', { required: 'La marca es obligatoria' })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white ${errors.marca ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Ej: Toyota"
              />
              {errors.marca && <p className="mt-1 text-sm text-red-600">{errors.marca.message}</p>}
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo <span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('modelo', { required: 'El modelo es obligatorio' })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white ${errors.modelo ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Ej: Corolla"
              />
              {errors.modelo && <p className="mt-1 text-sm text-red-600">{errors.modelo.message}</p>}
            </div>

            {/* Año */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Año <span className="text-red-500">*</span></label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                {...register('anio', { 
                  required: 'El año es obligatorio',
                  min: { value: 1900, message: 'Año inválido' },
                  max: { value: new Date().getFullYear() + 1, message: 'Año inválido' }
                })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white ${errors.anio ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.anio && <p className="mt-1 text-sm text-red-600">{errors.anio.message}</p>}
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="text"
                {...register('color')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                placeholder="Ej: Blanco"
              />
            </div>

            {/* Precio Diario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Diario ($) <span className="text-red-500">*</span></label>
              <input
                type="number"
                step="0.01"
                {...register('precioDiario', { 
                  required: 'El precio es obligatorio',
                  min: { value: 0.01, message: 'El precio debe ser mayor a 0' }
                })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white ${errors.precioDiario ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Ej: 15000"
              />
              {errors.precioDiario && <p className="mt-1 text-sm text-red-600">{errors.precioDiario.message}</p>}
            </div>
            
            {/* Estado (Solo visible en Edición según la lógica de negocio) */}
            {isEditMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Disponibilidad <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register('estado')}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 bg-gray-100 text-gray-500 rounded-md focus:outline-none cursor-not-allowed"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Link
              to="/vehiculos"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 mr-4 transition"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 shadow transition"
            >
              <FaSave /> {isEditMode ? 'Guardar Cambios' : 'Registrar Vehículo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleFormPage;
