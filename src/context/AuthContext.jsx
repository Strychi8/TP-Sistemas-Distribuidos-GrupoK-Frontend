import { createContext, useContext, useState } from "react";
import authService from "../features/auth/services/authService";
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

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);

      // Normalizamos el rol removiendo "ROLE_" si lo tuviera
      const rawRole = data.roles?.[0] || data.rol || "";
      const rol = rawRole.replace("ROLE_", "");

      const userData = { email: data.email, rol };

      setToken(data.token);
      setUser(userData);
      sessionStorage.setItem("rentar_token", data.token);
      sessionStorage.setItem("rentar_user", JSON.stringify(userData));

      return userData;
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
      sessionStorage.removeItem("rentar_token");
      sessionStorage.removeItem("rentar_user");
      toast.info("Sesión cerrada correctamente");
    }
  };

  const value = {
    user,
    token,
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
