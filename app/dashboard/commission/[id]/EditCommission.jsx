"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateCommission, getCommissionPrices } from "@/lib/commission.action";
import CommissionPrice from "@/components/CommissionPrice/CommissionPrice";

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
        <div className="label-input">
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

        <div className="label-input">
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

        <div className="type">
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

        <div className="label-input">
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

        <div>
          <h3>Prix :</h3>
          <p>
            <CommissionPrice type={type} background={background} />
          </p>
        </div>

        <div className="button-container">
          <button type="submit" disabled={loading}>
            {loading ? "Modification en cours..." : "Modifier ma commission"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="secondary-button"
            disabled={loading}
          >
            Annuler
          </button>
        </div>
      </form>
    </section>
  );
}
