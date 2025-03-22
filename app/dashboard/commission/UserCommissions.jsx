"use client";

import { useState } from "react";
import { deleteCommission } from "@/lib/commission.action";
import { translateStatus } from "@/lib/utils";
import Link from "next/link";

export default function UserCommissions({ data }) {
  const [userCommissions, setUserCommissions] = useState(
    data?.success ? data.commissions : []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette commission ?")) {
      return;
    }

    try {
      setLoading(true);
      const result = await deleteCommission(id);

      if (result.success) {
        // Filtrer pour retirer la commission supprimée
        setUserCommissions(userCommissions.filter((comm) => comm.id !== id));
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h2>Mes Commissions</h2>
      {userCommissions.length > 0 ? (
        <div>
          {userCommissions.map((commission) => (
            <div key={commission.id}>
              <h3>{commission.title}</h3>
              <div>
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
                  <span>Type:</span> {commission.type}
                </p>
                <p>
                  <span>Fond inclus:</span>{" "}
                  {commission.background ? "Oui" : "Non"}
                </p>
                <p>
                  <span>Prix:</span> {commission.commissionPrice.amount}€
                </p>
              </div>
              <div>
                <details>
                  <summary>Voir la description</summary>
                  <p>{commission.description}</p>
                </details>
              </div>
              <div>
                {commission.status === "pending" && (
                  <>
                    <button onClick={() => handleDelete(commission.id)}>
                      Annuler cette commission
                    </button>
                    <Link href={`/dashboard/commission/${commission.id}`}>
                      <button>Modifier cette commission</button>
                    </Link>
                  </>
                )}
                <Link href={`/dashboard/commission/${commission.id}/files`}>
                  <button>Voir les fichiers</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Vous n'avez pas encore de commissions. Créez-en une nouvelle !</p>
      )}
    </section>
  );
}
