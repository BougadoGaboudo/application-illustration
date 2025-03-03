"use client";

import { logout } from "@/lib/user.action";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  // async function handleLogout() {
  //   const res = await fetch("/api/auth/logout", {
  //     method: "POST",
  //   });

  //   if (res.ok) {
  //     router.push("/login"); // Rediriger après déconnexion
  //   }
  // }
  async function handleLogout() {
    const res = await logout();

    if (res.success) {
      router.push("/login"); // Rediriger après déconnexion
      router.refresh();
    }
  }

  return <button onClick={handleLogout}>Déconnexion</button>;
}
