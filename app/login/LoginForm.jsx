"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/user.action";
import Link from "next/link";

const LoginForm = () => {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(formData) {
    setError("");

    const result = await login(formData);

    if (result.success) {
      router.refresh(); // Rafraîchit l'état de l'application

      // Note : Dans notre Server Action, le rôle est inclus dans le JWT
      // donc on n'a pas besoin de le gérer explicitement ici
      if (result.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } else {
      setError(result.error || "Une erreur est survenue");
    }
  }

  return (
    <section className="section-login">
      <h1>Se connecter</h1>
      {error && <p className="error">{error}</p>}
      <form action={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="monmail@email.com"
          required
        />
        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="monMdpIci"
          required
        />
        <button type="submit">Connexion</button>
        <Link href="/register">Pas de compte ? Inscrivez-vous !</Link>
      </form>
    </section>
  );
};

export default LoginForm;
