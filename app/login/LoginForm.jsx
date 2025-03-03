// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// const LoginForm = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   async function handleLogin(e) {
//     e.preventDefault();

//     const res = await fetch("/api/auth/login", {
//       method: "POST",
//       body: JSON.stringify({ email, password }),
//     });

//     if (res.ok) {
//       const data = await res.json();
//       const token = data.token; // Récupérer le token de la réponse
//       const role = data.role; // Récupérer le rôle de l'utilisateur

//       // Rediriger en fonction du rôle
//       if (role === "admin") {
//         router.push("/admin");
//       } else {
//         router.push("/cart");
//       }
//     } else {
//       alert("Connexion échouée");
//     }
//   }

//   return (
//     <section className="section-login">
//       <h1>Se connecter</h1>
//       <form onSubmit={handleLogin}>
//         <label htmlFor="email">Email</label>
//         <input
//           type="email"
//           id="email"
//           name="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="monmail@email.com"
//           required
//         />
//         <label htmlFor="password">Mot de passe</label>
//         <input
//           type="password"
//           id="password"
//           name="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="monMdpIci"
//           required
//         />
//         <button type="submit">Connexion</button>
//       </form>
//     </section>
//   );
// };

// export default LoginForm;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/user.action";

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
        router.push("/cart");
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
      </form>
    </section>
  );
};

export default LoginForm;
