"use client";

import { useState, useEffect } from "react";
import { calculateCommissionPrice } from "@/lib/commission.action";

export default function CommissionPrice({ type, background }) {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPrice() {
      if (!type) return;

      setLoading(true);
      try {
        const result = await calculateCommissionPrice(type, background);
        if (result.success) {
          setPrice(result.price);
        } else {
          setError(result.error);
          setPrice(null);
        }
      } catch (err) {
        setError("Erreur de calcul du prix");
        setPrice(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPrice();
  }, [type, background]);

  if (loading) return <span>Calcul en cours...</span>;
  if (error) return <span>Prix indisponible</span>;
  if (price === null) return <span>-</span>;

  return <span>{price}€</span>;
}
