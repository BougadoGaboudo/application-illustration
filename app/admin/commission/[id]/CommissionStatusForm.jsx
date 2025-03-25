"use client";

import { useState, useEffect } from "react";
import { updateCommissionStatus } from "@/lib/commission.action";
import { useRouter } from "next/navigation";
import CreatableSelect from "react-select/creatable";

export default function CommissionStatusForm({
  id,
  currentStatus,
  currentTags = [],
  allTags = [],
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Formater tous les tags disponibles pour react-select
  const tagOptions = allTags.map((tag) => ({
    value: tag.name,
    label: tag.name,
  }));

  // Initialiser les tags sélectionnés au chargement
  useEffect(() => {
    if (currentTags && currentTags.length > 0) {
      const initialTags = currentTags.map((t) => ({
        value: t.tag.name,
        label: t.tag.name,
      }));
      setSelectedTags(initialTags);
    }
  }, [currentTags]);

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

    // Ajouter les tags sélectionnés
    const tagNames = selectedTags.map((tag) => tag.value);
    formData.append("tags", tagNames.join(","));

    try {
      const result = await updateCommissionStatus(id, formData);

      if (result.success) {
        // Rafraîchir la page pour voir les changements
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  // Style personnalisé pour react-select
  const customStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "4px",
      borderColor: "#ddd",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#aaa",
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#4a9eff",
      color: "white",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "white",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "white",
      "&:hover": {
        backgroundColor: "#3a8eff",
        color: "white",
      },
    }),
  };

  return (
    <form onSubmit={handleSubmit} className="form-status">
      {error && <p className="error-message">{error}</p>}

      <div className="container-status">
        <label>Statut:</label>
        <select
          className="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">En attente</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Terminée</option>
          <option value="rejected">Refusée</option>
        </select>
      </div>

      {status === "rejected" && (
        <div className="container-status">
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

      <div className="container-status">
        <label>Tags:</label>
        <CreatableSelect
          isMulti
          name="tags"
          options={tagOptions}
          className="tag-multi-select"
          classNamePrefix="select"
          placeholder="Sélectionnez ou créez des tags..."
          noOptionsMessage={() =>
            "Aucun tag disponible, commencez à écrire pour en créer un"
          }
          onChange={setSelectedTags}
          value={selectedTags}
          styles={customStyles}
          formatCreateLabel={(inputValue) => `Créer le tag "${inputValue}"`}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Mise à jour..." : "Mettre à jour la commission"}
      </button>
    </form>
  );
}
