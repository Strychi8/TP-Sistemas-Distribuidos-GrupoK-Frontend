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

### ⚙️ **Configuración Previa**

Antes de ejecutar el proyecto, asegúrate de crear un archivo `.env` en la raíz del repositorio con las URLs de conexión al backend:

```env
VITE_API_URL=http://localhost:8081/api       # URL base para los endpoints REST
VITE_GRAPHQL_URL=http://localhost:8081/graphql # URL para el endpoint de GraphQL
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

### 📌 **Resumen de Funcionalidades**

- **Control de Acceso y Autenticación:** Sistema de Login seguro con tokens JWT y vistas protegidas según el rol del usuario (`ADMINISTRADOR` o `CLIENTE`).
- **Gestión de Clientes:** Listado, alta, modificación, baja lógica (disponible para el rol administrador).
- **Gestión de Vehículos:** Listado, alta, modificación, baja lógica (disponible para el rol administrador).
- **Catálogo de Vehículos:** Visualización de vehículos disponibles y filtrado avanzado consumiendo el servicio de GraphQL (disponible para clientes).
- **Gestión de Reservas:** Flujo para crear reservas (REST) y panel de historial de alquileres (el administrador puede visualizar todas las reservas, mientras que el cliente visualiza únicamente las suyas).

---

### 👉 **Recursos Adicionales**

- [**Documentación de React**](https://react.dev/)
- [**Documentación de Vite**](https://vitejs.dev/)
- [**Documentación de TailwindCSS**](https://tailwindcss.com/docs)
- [**Documentación de Apollo Client**](https://www.apollographql.com/docs/react/)
