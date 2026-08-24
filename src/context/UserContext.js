import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { getCurrentUserProfile } from "../services/user";

const UserContext = createContext({
  user: null,
  setUser: () => {},
  refreshUser: async () => ({ success: false }),
  loading: false,
  error: ""
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshUser = useCallback(async () => {
    setLoading(true);
    setError("");
    const response = await getCurrentUserProfile();
    setLoading(false);

    if (!response.success) {
      setError(response.message || "Unable to load your profile.");
      setUser(null);
      return response;
    }

    setUser(response.data || null);
    return response;
  }, []);

  const value = useMemo(() => ({
    user,
    setUser,
    refreshUser,
    loading,
    error
  }), [error, loading, refreshUser, user]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
