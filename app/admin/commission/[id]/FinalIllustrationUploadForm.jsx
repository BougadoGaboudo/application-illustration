"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadFinalIllustration } from "@/lib/commission.action";

export default function FinalIllustrationUploadForm({ id, status }) {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Vérifier que la commission est terminée
  if (status !== "completed") {
    return (
      <div>
        <p>
          Vous ne pouvez envoyer une illustration finale que lorsque la
          commission est terminée.
        </p>
      </div>
    );
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Veuillez sélectionner un fichier");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("illustration", file);

    try {
      const result = await uploadFinalIllustration(id, formData);

      if (result.success) {
        router.refresh();
        // Réinitialiser le formulaire
        setFile(null);
        e.target.reset();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(
        "Une erreur est survenue lors de l'envoi de l'illustration finale"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}

      <div>
        <label htmlFor="illustration">Fichier de l'illustration finale:</label>
        <input
          type="file"
          id="illustration"
          name="illustration"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Envoi en cours..." : "Envoyer l'illustration finale"}
      </button>
    </form>
  );
}
