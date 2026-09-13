import { toast } from "react-toastify";

function EjemploVehiculo() {
  
  const guardarVehiculo = async () => {
    try {
      // 1. Mostrar un toast de "cargando"
      const idToast = toast.loading("Guardando vehículo...");
      
      // Simulamos la llamada a la API con un timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aca va la lógica real con axios...

      // 2. Actualizar el toast a "éxito"
      toast.update(idToast, { 
        render: "¡Vehículo guardado exitosamente!", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });

      // Alternativa más simple si no usas el toast de carga:
      // toast.success("¡Vehículo guardado exitosamente!");

    } catch (error) {
      // 3. Mostrar un toast de error si algo falla
      toast.error("Ocurrió un error al guardar. Verifica los datos.");
    }
  };

  const mostrarAviso = () => {
    toast.info("Recuerda que la patente debe ser única.");
    // toast.warning("Estás a punto de cancelar una reserva.");
  }

  return (
    <div style={{ padding: "20px", display: "flex", gap: "10px" }}>
      <button onClick={guardarVehiculo}>Guardar Vehículo (Simulado)</button>
      <button onClick={mostrarAviso}>Mostrar Info</button>
    </div>
  );
}

export default EjemploVehiculo;
