"use client";

import { useState, useEffect } from "react";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    const token = sessionStorage.getItem("admin_token");
    const storedEmail = sessionStorage.getItem("admin_email");

    if (token && storedEmail) {
      setIsAdmin(true);
      setEmail(storedEmail);
    } else {
      setIsAdmin(false);
      setEmail(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();

    // Listen for a custom login event
    window.addEventListener("admin-login", checkAuth);
    return () => window.removeEventListener("admin-login", checkAuth);
  }, []);

  return { isAdmin, email, loading };
}
