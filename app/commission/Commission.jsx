"use client";

import { useState, useEffect } from "react";
import {
  createCommission,
  getUserCommissions,
  getCommissionPrices,
  deleteCommission,
} from "@/lib/commission.action";
import Link from "next/link";
import { translateStatus } from "@/lib/utils";

const Commission = ({ data, role }) => {
  const [commissionPrices, setCommissionPrices] = useState([]);
  const [userCommissions, setUserCommissions] = useState([]);
  const [selectedType, setSelectedType] = useState("fullbody");
  const [hasBackground, setHasBackground] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewCommissionForm, setShowNewCommissionForm] = useState(false);

  // Récupérer les prix des commissions et les commissions de l'utilisateur au chargement
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [priceResult, userCommsResult] = await Promise.all([
          getCommissionPrices(),
          !role ? getUserCommissions() : { success: true, commissions: [] },
        ]);

        if (priceResult.success) {
          setCommissionPrices(priceResult.prices);
        } else {
          setError("Impossible de charger les prix des commissions");
        }

        if (!role && userCommsResult.success) {
          setUserCommissions(userCommsResult.commissions);
        }
      } catch (err) {
        setError("Une erreur est survenue lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  // Calculer le prix sélectionné en fonction du type et du background
  const getCurrentPrice = () => {
    const price = commissionPrices.find(
      (p) => p.type === selectedType && p.background === hasBackground
    );
    return price ? price.amount : 0;
  };

  // Gérer la soumission du formulaire de création
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      setLoading(true);
      const result = await createCommission(formData);

      if (result.success) {
        // Ajouter la nouvelle commission à la liste
        setUserCommissions([result.commission, ...userCommissions]);
        setShowNewCommissionForm(false);
        e.target.reset();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la création de la commission");
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une commission (utilisateur ou admin)
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const result = await deleteCommission(id);

      if (result.success) {
        if (role) {
          // Actualiser la page pour admin si succès
          window.location.reload();
        } else {
          // Filtrer pour retirer la commission supprimée
          setUserCommissions(userCommissions.filter((comm) => comm.id !== id));
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  // Affichage pour les administrateurs
  if (role) {
    return (
      <section>
        <h1>Gestion des commissions</h1>

        {error && <p>{error}</p>}

        {loading ? (
          <p>Chargement des commissions...</p>
        ) : (
          <>
            {data.success && data.commissions.length > 0 ? (
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
                    {data.commissions.map((commission) => (
                      <tr key={commission.id}>
                        <td>{commission.id}</td>
                        <td>{commission.title}</td>
                        <td>{commission.type}</td>
                        <td>
                          <span>{translateStatus(commission.status)}</span>
                        </td>
                        <td>{commission.background ? "Oui" : "Non"}</td>
                        <td>{commission.user.email}</td>
                        <td>{commission.commissionPrice.amount}€</td>
                        <td>
                          <Link href={`/commission/${commission.id}`}>
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
              <p>Aucune commission trouvée.</p>
            )}
          </>
        )}
      </section>
    );
  }

  // Affichage pour les utilisateurs
  return (
    <section>
      <h1>Mes Commissions</h1>

      {error && <p>{error}</p>}

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <div>
            <button
              onClick={() => setShowNewCommissionForm(!showNewCommissionForm)}
            >
              {showNewCommissionForm ? "Annuler" : "Nouvelle commission"}
            </button>
          </div>

          {showNewCommissionForm && (
            <div>
              <h2>Créer une nouvelle commission</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="title">Titre</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    placeholder="Titre de votre commission"
                  />
                </div>

                <div>
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
                  <label>Type d'illustration</label>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="type"
                        value="fullbody"
                        defaultChecked
                        onChange={() => setSelectedType("fullbody")}
                      />
                      Full-body
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="type"
                        value="halfbody"
                        onChange={() => setSelectedType("halfbody")}
                      />
                      Half-body
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="type"
                        value="portrait"
                        onChange={() => setSelectedType("portrait")}
                      />
                      Portrait
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
                    />
                    Background
                  </label>
                </div>

                <div>
                  <p>Prix estimé: {getCurrentPrice()}€</p>
                </div>

                <button type="submit" disabled={loading}>
                  {loading ? "Création en cours..." : "Créer ma commission"}
                </button>
              </form>
            </div>
          )}

          <h2>Liste de mes commissions</h2>
          {userCommissions.length > 0 ? (
            <div>
              {userCommissions.map((commission) => (
                <div key={commission.id}>
                  <h3>{commission.title}</h3>
                  <div>
                    <p>
                      <span>Statut:</span>{" "}
                      <span>{translateStatus(commission.status)}</span>
                    </p>
                    {commission.status === "rejected" &&
                      commission.rejectionReason && (
                        <p>
                          <span>Raison du refus:</span>{" "}
                          {commission.rejectionReason}
                        </p>
                      )}
                    <p>
                      <span>Type:</span> {commission.type}
                    </p>
                    <p>
                      <span>Fond inclus:</span>{" "}
                      {commission.background ? "Oui" : "Non"}
                    </p>
                    <p>
                      <span>Prix:</span> {commission.commissionPrice.amount}€
                    </p>
                  </div>
                  <div>
                    <details>
                      <summary>Voir la description</summary>
                      <p>{commission.description}</p>
                    </details>
                  </div>
                  <div>
                    {commission.status === "pending" && (
                      <button onClick={() => handleDelete(commission.id)}>
                        Annuler cette commission
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>
              Vous n'avez pas encore de commissions. Créez-en une nouvelle !
            </p>
          )}
        </>
      )}
    </section>
  );
};

export default Commission;
