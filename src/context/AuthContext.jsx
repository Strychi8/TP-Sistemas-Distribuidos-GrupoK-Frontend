import { createContext, useContext, useState, useEffect } from "react";
import authService from "../features/auth/services/authService";
import clientService from "../features/clients/services/clientService";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("rentar_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem("rentar_token") || null;
  });
  const [clientProfile, setClientProfile] = useState(() => {
    const savedClient = sessionStorage.getItem("rentar_client_profile");
    return savedClient ? JSON.parse(savedClient) : null;
  });

  // Si el usuario es CLIENTE, buscamos o resolvemos su idCliente (necesario para reservas y GraphQL)
  useEffect(() => {
    const fetchClientDetails = async () => {
      if (user && user.rol === "CLIENTE" && !clientProfile) {
        try {
          const clientes = await clientService.getActive();
          const found = clientes.find((c) => c.email.toLowerCase() === user.email.toLowerCase());
          if (found) {
            setClientProfile(found);
            sessionStorage.setItem("rentar_client_profile", JSON.stringify(found));
          }
        } catch (error) {
          console.error("Error al obtener perfil de cliente:", error);
        }
      }
    };
    fetchClientDetails();
  }, [user, clientProfile]);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      // data esperado del backend: { token, email, roles: [...] }
      // Extraemos el primer rol del array y quitamos "ROLE_" si lo tuviera
      const rawRole = data.roles?.[0] || "";
      const rol = rawRole.replace("ROLE_", "");

      const userData = { email: data.email, rol };

      setToken(data.token);
      setUser(userData);
      sessionStorage.setItem("rentar_token", data.token);
      sessionStorage.setItem("rentar_user", JSON.stringify(userData));

      if (rol === "CLIENTE") {
        try {
          const clientes = await clientService.getActive();
          const found = clientes.find(
            (c) => c.email.toLowerCase() === data.email.toLowerCase(),
          );
          if (found) {
            setClientProfile(found);
            sessionStorage.setItem(
              "rentar_client_profile",
              JSON.stringify(found),
            );
          }
        } catch (err) {
          console.error("No se pudo precargar perfil de cliente:", err);
        }
      }

      return userData; // Retornamos userData (que ya tiene .rol normalizado) o data adaptado
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Error en logout del backend:", error);
    } finally {
      setToken(null);
      setUser(null);
      setClientProfile(null);
      sessionStorage.removeItem("rentar_token");
      sessionStorage.removeItem("rentar_user");
      sessionStorage.removeItem("rentar_client_profile");
      toast.info("Sesión cerrada correctamente");
    }
  };

  const value = {
    user,
    token,
    clientProfile,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.rol === "ADMINISTRADOR",
    isClient: user?.rol === "CLIENTE",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};