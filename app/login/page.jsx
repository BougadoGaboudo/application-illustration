// app/login/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      const token = data.token; // Récupérer le token de la réponse
      const role = data.role; // Récupérer le rôle de l'utilisateur

      // Rediriger en fonction du rôle
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } else {
      alert("Connexion échouée");
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        required
      />
      <button type="submit">Connexion</button>
    </form>
  );
}
