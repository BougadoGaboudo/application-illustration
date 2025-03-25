"use client";

import { useState, useEffect } from "react";

export default function RecentCommissions({ recentCommissions = [] }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="recent-commissions-container">
        <h3>Commissions récentes</h3>
        <div className="loading-state">
          Chargement des illustrations récentes...
        </div>
      </div>
    );
  }

  if (recentCommissions.length === 0) {
    return (
      <div className="recent-commissions-container">
        <h3>Commissions récentes</h3>
        <p className="no-commissions">
          Aucune commission récente à afficher pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="recent-commissions-container">
      <h3>Commissions récentes</h3>
      <div className="commissions-grid">
        {recentCommissions.map((commission) => (
          <div key={commission.id} className="commission-card">
            <div className="commission-image">
              <img
                src={commission.url}
                alt={`Commission ${commission.title || "#" + commission.id}`}
                className="commission-img"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
