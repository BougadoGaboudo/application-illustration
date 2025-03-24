// src/app/dashboard/page.jsx
import Navbar from "@/components/Navbar/Navbar";
import { getUserCommissions } from "@/lib/commission.action";
import { checkAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserCommissions from "./UserCommissions";

export default async function DashboardPage() {
  // Vérifier si l'utilisateur est connecté
  const user = await checkAuth();
  if (!user) {
    redirect("/login");
  }

  // Récupérer les commissions de l'utilisateur
  const commissionsData = await getUserCommissions();

  return (
    <>
      <Navbar />
      <main>
        <UserCommissions data={commissionsData} />
      </main>
    </>
  );
}
