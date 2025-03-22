// src/app/admin/commissions/page.jsx
import Navbar from "@/components/Navbar/Navbar";
import { getAllCommissions } from "@/lib/commission.action";
import AdminCommission from "./AdminCommission";

export default async function AdminCommissionsPage() {
  // Récupérer toutes les commissions
  const commissionsData = await getAllCommissions();

  return (
    <>
      <Navbar />
      <main>
        <section className="section-commission-list">
          <h1>Liste des Commissions</h1>
          <AdminCommission data={commissionsData} />
        </section>
      </main>
    </>
  );
}
