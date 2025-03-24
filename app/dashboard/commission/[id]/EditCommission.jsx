"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateCommission } from "@/lib/commission.action";
import { getCommissionPrices } from "@/lib/commission.action";

export default function EditCommission({ commission }) {
  const router = useRouter();
  const [title, setTitle] = useState(commission.title);
  const [description, setDescription] = useState(commission.description);
  const [type, setType] = useState(commission.type);
  const [background, setBackground] = useState(commission.background);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPrices() {
      const result = await getCommissionPrices();
      if (result.success) {
        setPrices(result.prices);
      }
    }
    loadPrices();
  }, []);

  if (commission.status !== "pending") {
    return (
      <div>
        <p>
          Vous ne pouvez modifier votre commission que lorsqu'elle est en
          attente.
        </p>
        <button onClick={() => router.push("/dashboard")}>
          Retourner au tableau de bord
        </button>
      </div>
    );
  }

  // Calculer le prix estimé avec la nouvelle structure
  const getEstimatedPrice = () => {
    if (prices.length === 0) return "Chargement...";

    const priceInfo = prices.find((p) => p.type === type);
    if (!priceInfo) return "Non disponible";

    return background
      ? priceInfo.baseAmount + priceInfo.bgAddon
      : priceInfo.baseAmount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.target);
      const result = await updateCommission(commission.id, formData);

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(
        "Une erreur est survenue lors de la modification de la commission"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-user-edit-commission">
      <h1>Modifier ma commission</h1>
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Titre:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="fullbody">Corps entier</option>
            <option value="halfbody">Mi-corps</option>
            <option value="portrait">Portrait</option>
          </select>
        </div>

        <div>
          <label>Fond inclus:</label>
          <div>
            <label>
              <input
                type="radio"
                name="background"
                value="true"
                checked={background}
                onChange={() => setBackground(true)}
              />
              Oui (+{prices.find((p) => p.type === type)?.bgAddon || 0}€)
            </label>
            <label>
              <input
                type="radio"
                name="background"
                value="false"
                checked={!background}
                onChange={() => setBackground(false)}
              />
              Non
            </label>
          </div>
        </div>

        {prices.length > 0 && (
          <div>
            <h3>Prix estimé:</h3>
            <p>{getEstimatedPrice()}€</p>
          </div>
        )}

        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Modification en cours..." : "Modifier ma commission"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            disabled={loading}
          >
            Annuler
          </button>
        </div>
      </form>
    </section>
  );
}
