import { checkAuth } from "@/lib/auth";
import { getCommissionById, getCommissionFiles } from "@/lib/commission.action";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import { translateStatus } from "@/lib/utils";

export default async function CommissionFilesPage({ params }) {
  const { id } = await params;

  const user = await checkAuth();
  if (!user) {
    redirect("/login");
  }

  // Récupérer les détails de la commission
  const commissionResult = await getCommissionById(id);
  const filesResult = await getCommissionFiles(id);

  // Si la commission n'existe pas, afficher une page 404
  if (!commissionResult.success || !commissionResult.commission) {
    notFound();
  }

  const commission = commissionResult.commission;
  const files = filesResult.success ? filesResult.files : [];

  // Vérifier que l'utilisateur est le propriétaire de la commission
  if (commission.userId !== user.id) {
    redirect("/dashboard");
  }

  // Séparer les fichiers par type
  const sketches = files.filter((file) => file.type === "sketch");
  const finalIllustrations = files.filter(
    (file) => file.type === "finalIllustration"
  );

  return (
    <>
      <Navbar />
      <main>
        <div>
          <h1>Fichiers pour la commission "{commission.title}"</h1>
          <p>Statut: {translateStatus(commission.status)}</p>
          <Link href="/dashboard/commission">
            <button>Retour au tableau de bord</button>
          </Link>
        </div>

        <section>
          <h2>Croquis</h2>
          {sketches.length > 0 ? (
            <div>
              {sketches.map((sketch) => (
                <div key={sketch.id}>
                  <h3>{sketch.fileName}</h3>
                  <p>
                    Ajouté le: {new Date(sketch.createdAt).toLocaleDateString()}
                  </p>
                  <div>
                    <img src={sketch.url} alt={sketch.fileName} />
                    <a
                      href={sketch.url}
                      download={sketch.fileName}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button>Télécharger le croquis</button>{" "}
                      {/* Modifié le texte du bouton */}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Aucun croquis disponible pour le moment.</p>
          )}
        </section>

        <section>
          <h2>Illustrations finales</h2>
          {finalIllustrations.length > 0 ? (
            <div>
              {finalIllustrations.map((illustration) => (
                <div key={illustration.id}>
                  <h3>{illustration.fileName}</h3>
                  <p>
                    Ajouté le:{" "}
                    {new Date(illustration.createdAt).toLocaleDateString()}
                  </p>
                  <div>
                    <img src={illustration.url} alt={illustration.fileName} />
                    <a
                      href={illustration.url}
                      download={illustration.fileName}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button>Télécharger l'illustration finale</button>{" "}
                      {/* Modifié le texte du bouton */}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Aucune illustration finale disponible pour le moment.</p>
          )}
        </section>
      </main>
    </>
  );
}
