import { checkAuth } from "@/lib/auth";
import { getCommissionById } from "@/lib/commission.action";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import EditCommission from "./EditCommission";

export default async function EditCommissionPage({ params }) {
  const { id } = await params;

  const user = await checkAuth();
  if (!user) {
    redirect("/login");
  }

  const result = await getCommissionById(id);

  // Si la commission n'existe pas, afficher une page 404
  if (!result.success || !result.commission) {
    notFound();
  }

  const commission = result.commission;

  // Vérifier que l'utilisateur est le propriétaire de la commission
  if (commission.userId !== user.id) {
    redirect("/dashboard");
  }

  return (
    <>
      <Navbar />
      <main>
        <EditCommission commission={commission} />
      </main>
    </>
  );
}
