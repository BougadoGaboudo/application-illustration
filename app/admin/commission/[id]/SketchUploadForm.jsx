"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadSketch } from "@/lib/commission.action";

export default function SketchUploadForm({ id, status }) {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Vérifier que la commission est en cours
  if (status !== "in_progress") {
    return (
      <div>
        <p>
          Vous ne pouvez envoyer un croquis que lorsque la commission est en
          cours.
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
    formData.append("sketch", file);

    try {
      const result = await uploadSketch(id, formData);

      if (result.success) {
        router.refresh();
        // Réinitialiser le formulaire
        setFile(null);
        e.target.reset();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi du croquis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}

      <div>
        <label htmlFor="sketch">Fichier du croquis:</label>
        <input
          type="file"
          id="sketch"
          name="sketch"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Envoi en cours..." : "Envoyer le croquis"}
      </button>
    </form>
  );
}
