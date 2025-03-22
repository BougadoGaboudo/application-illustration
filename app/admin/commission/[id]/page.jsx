// src/app/admin/commissions/[id]/page.jsx
import { isAdmin } from "@/lib/auth";
import { getCommissionById } from "@/lib/commission.action";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import CommissionStatusForm from "./CommissionStatusForm";
import { translateStatus } from "@/lib/utils";

export default async function CommissionDetailPage({ params }) {
  const { id } = await params;

  // Vérifier si l'utilisateur est admin
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    redirect("/dashboard");
  }

  // Récupérer les détails de la commission
  const result = await getCommissionById(id);

  // Si la commission n'existe pas, afficher une page 404
  if (!result.success || !result.commission) {
    notFound();
  }

  const commission = result.commission;

  return (
    <>
      <Navbar />
      <main>
        <section className="commission-admin-id">
          <div className="container-header">
            <h1>Détails de la commission #{id}</h1>
            <Link href="/admin/commission" className="retour">
              Retour
            </Link>
          </div>

          <div className="container-content">
            <div>
              <div className="info">
                <h2>Informations générales</h2>
                <p>
                  <span>ID:</span> {commission.id}
                </p>
                <p>
                  <span>Titre:</span> {commission.title}
                </p>
                <p>
                  <span>Type:</span> {commission.type}
                </p>
                <p>
                  <span>Fond inclus:</span>{" "}
                  {commission.background ? "Oui" : "Non"}
                </p>
                <p>
                  <span>Statut:</span>{" "}
                  <span>{translateStatus(commission.status)}</span>
                </p>
                {commission.status === "rejected" &&
                  commission.rejectionReason && (
                    <p>
                      <span>Raison du refus:</span> {commission.rejectionReason}
                    </p>
                  )}
                <p>
                  <span>Prix:</span> {commission.commissionPrice.amount}€
                </p>
                {commission.commissionPrice.bonus && (
                  <p>
                    <span>Bonus:</span> {commission.commissionPrice.bonus}€
                  </p>
                )}
                <p>
                  <span>Prix total:</span>{" "}
                  {commission.commissionPrice.amount +
                    (commission.commissionPrice.bonus || 0)}
                  €
                </p>
              </div>

              <div className="info">
                <h2>Informations client</h2>
                <p>
                  <span>ID Client:</span> {commission.userId}
                </p>
                <p>
                  <span>Email:</span> {commission.user?.email}
                </p>
              </div>
            </div>

            <div className="info">
              <h2>Description</h2>
              <div>
                <p>{commission.description}</p>
              </div>
            </div>

            <div className="info">
              <h2>Gérer le statut</h2>
              <CommissionStatusForm
                id={commission.id}
                currentStatus={commission.status}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
