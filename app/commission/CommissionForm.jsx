"use client";

import { useState } from "react";
import { createCommission } from "@/lib/commission.action";
import { useRouter } from "next/navigation";

export default function CommissionForm({ prices }) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("fullbody");
  const [hasBackground, setHasBackground] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculer le prix en fonction du type et du background
  const getCurrentPrice = () => {
    const price = prices.find((p) => p.type === selectedType);
    if (!price) return 0;

    // Calul prix total avec ou sans background
    return hasBackground ? price.baseAmount + price.bgAddon : price.baseAmount;
  };

  // Gérer la soumission du formulaire de création
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      setLoading(true);
      const result = await createCommission(formData);

      if (result.success) {
        // Rediriger vers le tableau de bord
        router.push("/dashboard");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la création de la commission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-commission-form">
      <h2>Formulaire de commission</h2>
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="label-input">
          <label htmlFor="title">Titre</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            placeholder="Titre de votre commission"
          />
        </div>

        <div className="type">
          <label>Type d'illustration</label>
          <div className="options">
            <label>
              <input
                type="radio"
                name="type"
                value="fullbody"
                defaultChecked
                onChange={() => setSelectedType("fullbody")}
              />{" "}
              Full-body ({prices.find((p) => p.type === "fullbody")?.baseAmount}
              €)
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="halfbody"
                onChange={() => setSelectedType("halfbody")}
              />{" "}
              Half-body ({prices.find((p) => p.type === "halfbody")?.baseAmount}
              €)
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="portrait"
                onChange={() => setSelectedType("portrait")}
              />{" "}
              Portrait ({prices.find((p) => p.type === "portrait")?.baseAmount}
              €)
            </label>
          </div>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="background"
              value="true"
              onChange={() => setHasBackground(!hasBackground)}
            />{" "}
            Background (+
            {prices.find((p) => p.type === selectedType)?.bgAddon || 0}€)
          </label>
        </div>
        <div className="label-input">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            required
            rows="4"
            placeholder="Décrivez votre commission en détail"
          ></textarea>
        </div>

        <div>
          <p>Prix estimé: {getCurrentPrice()}€</p>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Création en cours..." : "Créer ma commission"}
        </button>
      </form>
    </div>
  );
}
