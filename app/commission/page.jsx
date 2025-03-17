import Navbar from "@/components/Navbar/Navbar";
import { isAdmin } from "@/lib/auth";
import {
  getAllCommissions,
  getCommissionPrices,
} from "@/lib/commission.action";
import Commission from "./Commission";

export default async function CommissionPage() {
  // Vérifier si l'utilisateur est admin
  const userRole = await isAdmin();

  // Récupérer les données en fonction du rôle
  let commissionsData = { success: false, commissions: [] };

  if (userRole) {
    // Si admin, récupérer toutes les commissions
    commissionsData = await getAllCommissions();
  }

  return (
    <>
      <Navbar />
      <main>
        <Commission data={commissionsData} role={userRole} />
      </main>
    </>
  );
}
