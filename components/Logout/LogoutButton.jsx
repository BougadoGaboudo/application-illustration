"use client";

import { logout } from "@/lib/user.action";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const res = await logout();

    if (res.success) {
      router.push("/login"); // Rediriger après déconnexion
      router.refresh();
    }
  }

  return (
    <button onClick={handleLogout} className="logout">
      <Image src="/img/logout.svg" alt="Logout" width={32} height={32} />
    </button>
  );
}
