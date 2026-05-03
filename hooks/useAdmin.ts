"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname(); // Tracks navigation

  const checkAuth = () => {
    const token = sessionStorage.getItem("admin_token");
    const storedEmail = sessionStorage.getItem("admin_email");

    if (token && storedEmail) {
      try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Logic Check: Is the expiration time in the past?
        if (decoded.exp < currentTime) {
          alert("Session expired. Logging out.");
          handleLogout();
          return;
        }

        setIsAdmin(true);
        setEmail(storedEmail);
      } catch (error) {
        handleLogout();
      }
    } else {
      setIsAdmin(false);
      setEmail(null);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_email");
    setIsAdmin(false);
    setEmail(null);
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();

    window.addEventListener("admin-login", checkAuth);
    return () => window.removeEventListener("admin-login", checkAuth);
  }, [pathname]);

  return { isAdmin, email, loading, logout: handleLogout };
}
