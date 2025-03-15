import React, { createContext, useContext, useState } from "react";

// Create a Context for authentication
const AuthContext = createContext();

// Custom hook to access AuthContext values
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to provide auth state to your app
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Log in function (can be replaced with your actual login logic)
  const login = () => {
    setIsLoggedIn(true);
  };

  // Log out function
  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
