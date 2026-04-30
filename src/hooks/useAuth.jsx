import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await api.get("/auth/me");
      console.log("checkAuth response:", res.data);
      setUser(res.data.userData);
    } catch (error) {
      console.log("checkAuth error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
    };
    initAuth();
  }, []);

  const loginWithGithub = async () => {
    try {
      await api.get("/auth/github");
      window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/github`;
    } catch (error) {
      if (error.response?.status === 429) {
        throw new Error("Too many login attempts. Please try again later.", { cause: error });
      }
      window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/github`;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: loginWithGithub,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
