// "use client";

import Navbar from "@/components/Navbar/Navbar";
import RegisterForm from "./RegisterForm";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function RegisterPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   async function handleSubmit(e) {
//     e.preventDefault();

//     const res = await fetch("/api/auth/register", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }), // Ne pas inclure le rôle ici
//     });

//     if (res.ok) {
//       // Rediriger l'utilisateur vers la page de connexion
//       router.push("/login");
//     } else {
//       const data = await res.json();
//       setError(data.error || "Erreur inconnue");
//     }
//   }

//   return (
//     <div>
//       <h1>Inscription</h1>
//       <form onSubmit={handleSubmit}>
//         {error && <p style={{ color: "red" }}>{error}</p>}
//         <div>
//           <label htmlFor="email">Email :</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="password">Mot de passe :</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Mot de passe"
//             required
//           />
//         </div>
//         <button type="submit">S'inscrire</button>
//       </form>
//     </div>
//   );
// }

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <RegisterForm />
    </>
  );
}
