import { createContext, useContext, useState, useEffect } from "react";
import authService from "../features/auth/services/authService";
import clientService from "../features/clients/services/clientService";
import { toast } from "react-toastify";
import { decodeJwt } from "../utils/jwt";

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

  // Indica si el perfil de cliente todavía está siendo cargado de forma asíncrona.
  // Inicia en true si el usuario es CLIENTE pero aún no hay perfil guardado en sesión.
  const [clientProfileLoading, setClientProfileLoading] = useState(() => {
    const savedUser = sessionStorage.getItem("rentar_user");
    const savedClient = sessionStorage.getItem("rentar_client_profile");
    if (!savedUser) return false;
    const parsedUser = JSON.parse(savedUser);
    return parsedUser?.rol === "CLIENTE" && !savedClient;
  });

  // Si el usuario es CLIENTE y no hay perfil cargado, lo busca por email en la lista de activos.
  useEffect(() => {
    const fetchClientDetails = async () => {
      if (user && user.rol === "CLIENTE" && !clientProfile) {
        setClientProfileLoading(true);
        try {
          const profile = await clientService.getMyProfile();
          if (profile) {
            setClientProfile(profile);
            sessionStorage.setItem("rentar_client_profile", JSON.stringify(profile));
          }
        } catch (error) {
          console.error("Error al obtener perfil de cliente:", error);
        } finally {
          setClientProfileLoading(false);
        }
      } else {
        // Si no es CLIENTE o ya tiene perfil, no hay nada que cargar.
        setClientProfileLoading(false);
      }
    };
    fetchClientDetails();
  }, [user, clientProfile]);

  const login = async (credentials) => {
    // El gateway devuelve SOLO { token }: derivamos email y rol decodificando el JWT.
    const { token: jwt } = await authService.login(credentials);
    const claims = decodeJwt(jwt) || {};
    const roles = Array.isArray(claims.roles) ? claims.roles : [];
    const rol = (roles[0] || "").replace("ROLE_", "");

    const userData = { email: claims.sub, rol };

    setToken(jwt);
    setUser(userData);

    // Marcamos el perfil como "cargando" ANTES del setUser
    // para que las páginas ya lo sepan cuando rendericen.
    if (rol === "CLIENTE") {
      setClientProfileLoading(true);
    }

    sessionStorage.setItem("rentar_token", jwt);
    sessionStorage.setItem("rentar_user", JSON.stringify(userData));

    // Precargamos el perfil del cliente en el mismo login.
    if (rol === "CLIENTE") {
      try {
        const profile = await clientService.getMyProfile();
        if (profile) {
          setClientProfile(profile);
          sessionStorage.setItem(
            "rentar_client_profile",
            JSON.stringify(profile),
          );
        }
      } catch (err) {
        console.error("No se pudo precargar perfil de cliente:", err);
      } finally {
        setClientProfileLoading(false);
      }
    }

    return userData;
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
      setClientProfileLoading(false);
      sessionStorage.removeItem("rentar_token");
      sessionStorage.removeItem("rentar_user");
      sessionStorage.removeItem("rentar_client_profile");
      toast.info("Sesión cerrada correctamente");
    }
  };

  const loginMockUser = (
    mockUser = { email: "cliente.demo@rentar.com", rol: "CLIENTE" },
    mockProfile = {
      id: 1,
      nombre: "Carlos",
      apellido: "Gómez",
      documento: "30123456",
      email: "cliente.demo@rentar.com",
    }
  ) => {
    const mockToken = "mock-jwt-token-h3";
    setToken(mockToken);
    setUser(mockUser);
    setClientProfile(mockProfile);
    setClientProfileLoading(false);

    sessionStorage.setItem("rentar_token", mockToken);
    sessionStorage.setItem("rentar_user", JSON.stringify(mockUser));
    sessionStorage.setItem("rentar_client_profile", JSON.stringify(mockProfile));

    toast.success(`Modo Simulado: Sesión iniciada como ${mockUser.rol}`);
    return mockUser;
  };

  const value = {
    user,
    token,
    clientProfile,
    clientProfileLoading,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.rol === "ADMINISTRADOR",
    isClient: user?.rol === "CLIENTE",
    login,
    loginMockUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
