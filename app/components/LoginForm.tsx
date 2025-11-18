"use client";

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
