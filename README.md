# TP Sistemas Distribuidos - Grupo K - Frontend

Este proyecto es el **frontend web** del **Sistema web Rentar para alquiler de vehículos**, desarrollado como parte del Trabajo Práctico de Sistemas Distribuidos. Su objetivo principal es ofrecer una interfaz para el consumo de los servicios web del backend, implementados con **REST** y **GraphQL**.

---

### 🏗️ **Tecnologías y Librerías Principales**

- **Framework:** React 19 + Vite 8
- **Enrutamiento:** React Router DOM v7
- **Peticiones HTTP:** Axios (API REST) y Apollo Client (GraphQL)
- **Estilos:** TailwindCSS
- **Manejo de Estado:** Context API (`AuthContext`)
- **Utilidades:** React Toastify (notificaciones), React Icons, Dayjs

---

### 📂 **Estructura del Proyecto**

La arquitectura del proyecto está basada en características (features) para mantener el código modular y escalable:

```text
src/
├── App.jsx       # Componente raíz y configuración de providers globales
├── main.jsx      # Punto de entrada principal de la aplicación React
├── components/   # Componentes transversales y reutilizables de UI (Layout, Navbar, Buttons)
├── config/       # Configuración de clientes HTTP (instancias de Axios y Apollo GraphQL)
├── context/      # Proveedores de contexto global (ej: AuthContext para la sesión JWT)
├── features/     # Módulos por dominio de negocio:
│   ├── auth/          # Vistas y servicios de autenticación (Login)
│   ├── clients/       # Vistas y servicios de gestión de clientes
│   ├── reservations/  # Vistas y servicios para la creación y consulta de reservas
│   └── vehicles/      # Vistas y servicios del catálogo de vehículos
└── routes/       # Definición del enrutador central y componentes de rutas protegidas
```

---

### 📋 **Requisitos Previos**

- **Node.js** (versión 18 o superior recomendada).
- **Backend en ejecución:** Es indispensable tener corriendo el servidor Backend del TP localmente en el puerto `8081` para que el frontend pueda consumir las APIs REST y GraphQL sin problemas.

---

### ⚙️ **Configuración Previa**

Antes de ejecutar el proyecto, asegúrate de crear un archivo `.env` en la raíz del repositorio con las URLs de conexión al backend:

```env
VITE_API_URL=http://localhost:8081/api              # URL base para los endpoints REST
VITE_GRAPHQL_URL=http://localhost:8081/graphql      # URL para el endpoint de GraphQL
```

---

### 🚀 **Ejecución**

1. Clonar el repositorio:

    ```bash
    git clone https://github.com/Strychi8/TP-Sistemas-Distribuidos-GrupoK-Frontend
    cd TP-Sistemas-Distribuidos-GrupoK-Frontend
    ```

2. Instalar dependencias:

    ```bash
    npm install
    ```

3. Ejecutar en desarrollo:

    ```bash
    npm run dev
    ```

El frontend quedará disponible en `http://localhost:5173`.

---

### 🔑 **Credenciales de Prueba**

Para facilitar las pruebas, el backend inicializa la base de datos con los siguientes usuarios predeterminados:

- **Administrador:**
  - **Email:** `admin@empresarentar.com`
  - **Contraseña:** `admin123`
- **Cliente:**
  - **Email:** `juan.perez@gmail.com`
  - **Contraseña:** `123456`

---

### 📌 **Resumen de Funcionalidades**

- **Control de Acceso y Autenticación:** Sistema de Login seguro con tokens JWT y vistas protegidas según el rol del usuario (`ADMINISTRADOR` o `CLIENTE`).
- **Gestión de Clientes:** Listado, alta, modificación, baja lógica (disponible para el rol administrador).
- **Gestión de Vehículos:** Listado, alta, modificación, baja lógica (disponible para el rol administrador).
- **Catálogo de Vehículos:** Visualización de vehículos disponibles y filtrado avanzado consumiendo el servicio de GraphQL (disponible para clientes).
- **Gestión de Reservas:** Flujo para crear reservas (REST) y panel de historial de alquileres (el administrador puede visualizar todas las reservas, mientras que el cliente visualiza únicamente las suyas).
- **Incorporación de Vehículo Propio (Hito 3 - Cliente):**
  - Vista para postular vehículo propio (`/mis-vehiculos/nuevo`) con validaciones de patente (formato tradicional o Mercosur) y precio sugerido.
  - Panel de seguimiento de solicitudes (`/mis-vehiculos`) con badges de estado (`PENDIENTE`, `APROBADO`, `RECHAZADO`), métricas de solicitudes, detalle de validaciones policial y titularidad, y polling en segundo plano cada 10 segundos para capturar resoluciones asíncronas de Kafka.
- **Inhabilitación de Vehículos por Denuncia de Robo (Hito 3 - Kafka):**
  - Panel del administrador: Los vehículos marcados como `ROBADO` tras la verificación asíncrona exhiben un badge destacado `INHABILITADO` con alerta visual en la tabla de flota.
  - Catálogo de clientes: Los vehículos inhabilitados son excluidos de las búsquedas de disponibilidad y bloqueados para cualquier intento de reserva o alquiler operativo.
- **Mantenimiento Preventivo Asíncrono en Reservas (Hito 3 - Kafka):**
  - Vistas de reservas (`/reservas` y `/mis-reservas`): Se incluye una columna dedicada para el dictamen del mantenimiento preventivo con badges visuales (`REALIZADO`, `NO_REALIZADO`, `EN REVISIÓN` con animación de pulso).
  - Actualización reactiva mediante polling periódico (cada 8 segundos) en Apollo Client para reflejar la resolución del evento en segundo plano sin recargar la página.

---

### 👉 **Recursos Adicionales**

- [**Documentación de React**](https://react.dev/)
- [**Documentación de Vite**](https://vitejs.dev/)
- [**Documentación de TailwindCSS**](https://tailwindcss.com/docs)
- [**Documentación de Apollo Client**](https://www.apollographql.com/docs/react/)
