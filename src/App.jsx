import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EjemploVehiculo from "./features/vehicles/views/VehicleFormPage";


function App() {
  

  return (
    <>
      {/* ToastContainer global para notificaciones */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
        theme="dark"
      />
     <EjemploVehiculo />
    </>
  )
}

export default App
