"use client";

import { register } from "@/lib/user.action";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RegisterForm = () => {
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleSubmit(formData) {
    try {
      const result = await register(formData);
      router.push("/login");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="section-login">
      <h1>Inscription</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form action={handleSubmit}>
        <label htmlFor="email">Email :</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          required
        />
        <label htmlFor="password">Mot de passe :</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Mot de passe"
          required
        />
        <button type="submit">S'inscrire</button>
      </form>
    </section>
  );
};

export default RegisterForm;
