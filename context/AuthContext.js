import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { NEXT_URL } from "../config/index";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => checkUserLoggedIn(), []);

  // Register a new user
  const register = async (user) => {
    console.log(user);
  };

  // Login user
  // email:identifier will be renamed then
  const login = async ({ email: identifier, password }) => {
    const res = await fetch(`${NEXT_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    });

    const data = await res.json();
    if (res.status === 200) {
      setUser(data.user);
      router.push("/account/dashboard");
    } else {
      setError(data.message);
      setError(null);
    }
  };

  // Logout user
  const logout = async () => {
    console.log("logout");
  };

  // Check if user is logged in
  const checkUserLoggedIn = async (user) => {
    console.log("Check started");

    const res = await fetch(`${NEXT_URL}/user`);
    const data = await res.json();
    console.log(res);
    console.log(data);
    if (res.ok) {
      setUser(data.user);
    } else {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
