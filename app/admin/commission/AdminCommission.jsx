"use client";

import { useState } from "react";
import { deleteCommission } from "@/lib/commission.action";
import Link from "next/link";
import { translateStatus } from "@/lib/utils";
import CommissionPrice from "@/components/CommissionPrice/CommissionPrice";

export default function AdminCommission({ data }) {
  const [commissions, setCommissions] = useState(
    data?.success ? data.commissions : []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Supprimer une commission
  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette commission ?")) {
      return;
    }

    try {
      setLoading(true);
      const result = await deleteCommission(id);

      if (result.success) {
        // Filtrer pour retirer la commission supprimée
        setCommissions(commissions.filter((comm) => comm.id !== id));
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
    return <p>Chargement des commissions...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="section-admin-commission">
      {commissions.length > 0 ? (
        <div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Fond</th>
                <th>Email client</th>
                <th>Prix</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((commission) => (
                <tr key={commission.id}>
                  <td>{commission.id}</td>
                  <td>{commission.title}</td>
                  <td>{commission.type}</td>
                  <td>
                    <span>{translateStatus(commission.status)}</span>
                  </td>
                  <td>{commission.background ? "Oui" : "Non"}</td>
                  <td>{commission.user.email}</td>
                  <td>
                    <CommissionPrice
                      type={commission.type}
                      background={commission.background}
                    />
                  </td>
                  <td>
                    <Link href={`/admin/commission/${commission.id}`}>
                      Détails
                    </Link>
                    <button onClick={() => handleDelete(commission.id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Il n'y a pas encore de commissions :(</p>
      )}
    </section>
  );
}
