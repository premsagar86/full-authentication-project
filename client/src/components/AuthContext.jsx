import React, { createContext, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

export const AuthContextProvider = createContext();

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await axiosInstance.post("/refresh-token");

        setUser({ token: res.data.accessToken });
        console.log("User restored:", res.data);
      } catch (error) {
        console.log("Not logged in");
        setUser(null);
      }
    };

    refresh();
  }, []);

  return (
    <AuthContextProvider.Provider value={{ user, setUser }}>
      {children}
    </AuthContextProvider.Provider>
  );
};

export default AuthContext;