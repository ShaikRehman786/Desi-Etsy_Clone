
import { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api"; // Axios instance with token header support

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading state to prevent flicker

  // Login: set user and token
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) localStorage.setItem("token", token);
  };

  // Logout: clear user and token
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // On mount, restore user session using token
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/auth/me"); // fetch user info with token
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (error) {
        console.error("Failed to fetch user:", error);
        logout(); // clear invalid token/user
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
