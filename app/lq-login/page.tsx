"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError("");
    console.log(email, password)
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    console.log(res)

    if (res.ok) {
      const { token } = await res.json();

      // Store JWT for client-side conditional rendering
      sessionStorage.setItem("admin_token", token);

      // Send them home
      router.push("/");
      router.refresh();
    } else {
      setError("Invalid login credentials.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl bg-white p-8 shadow-md"
      >
        <h1 className="text-center text-2xl font-bold">LQ Login</h1>

        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Admin Email"
          className="rounded border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="rounded border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="rounded bg-slate-800 p-2 font-semibold text-white hover:bg-slate-700"
        >
          Access Dashboard
        </button>
      </form>
    </main>
  );
}
