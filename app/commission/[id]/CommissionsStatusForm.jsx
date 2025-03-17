"use client";

import { useState } from "react";
import { updateCommissionStatus } from "@/lib/commission.action";
import { useRouter } from "next/navigation";

export default function CommissionStatusForm({ id, currentStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("status", status);

    // Ajouter la raison du refus uniquement si le statut est rejected
    if (status === "rejected") {
      formData.append("rejectionReason", rejectionReason);
    }

    try {
      const result = await updateCommissionStatus(id, formData);

      if (result.success) {
        // Rafraîchir la page pour voir les changements
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la mise à jour du statut");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}

      <div>
        <label>Statut:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="pending">En attente</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Terminée</option>
          <option value="rejected">Refusée</option>
        </select>
      </div>

      {status === "rejected" && (
        <div>
          <label>Raison du refus:</label>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows="3"
            required
            placeholder="Veuillez indiquer la raison du refus"
          ></textarea>
        </div>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Mise à jour..." : "Mettre à jour le statut"}
      </button>
    </form>
  );
}
