"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Check for token on mount
    const token = sessionStorage.getItem("admin_token");

    if (token) {
      // In a more complex app, you could verify the JWT expiry here
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    setLoading(false);
  }, []);

  const logout = () => {
    sessionStorage.removeItem("admin_token");
    setIsAdmin(false);
    router.push("/");
    router.refresh();
  };

  return { isAdmin, loading, logout };
}
