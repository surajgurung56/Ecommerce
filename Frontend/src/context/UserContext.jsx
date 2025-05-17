import { baseUrl } from "@/config";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getUser() {
    try {
      const response = await fetch(`${baseUrl}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      getUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <UserContext.Provider
      value={{ token, setToken, user, setUser, getUser, loading }}
    >
      {children}
    </UserContext.Provider>
  );
}
