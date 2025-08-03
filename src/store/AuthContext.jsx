import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("authToken");
    if (!stored) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(stored);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("authToken");
        setLoading(false);
        return;
      }
      setToken(stored);
      setUser(decoded);
    } catch {
      localStorage.removeItem("authToken");
    }
    setLoading(false);
  }, []);

  const login = ({ jwt }) => {
    try {
      const decoded = jwtDecode(jwt);
      if (decoded.exp * 1000 < Date.now()) {
        throw new Error("Token expired");
      }
      setToken(jwt);
      setUser(decoded);
      localStorage.setItem("authToken", jwt);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
  };

  const isAuthenticated = !!token;
  const isVerified = user?.verified === true;

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const timeout = decoded.exp * 1000 - Date.now();

      const timer = setTimeout(() => {
        logout();
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        isVerified,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
