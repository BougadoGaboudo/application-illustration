import { isAdmin } from "@/lib/auth";
import { getCommissionById, getCommissionFiles } from "@/lib/commission.action";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import CommissionStatusForm from "./CommissionStatusForm";
import SketchUploadForm from "./SketchUploadForm";
import FinalIllustrationUploadForm from "./FinalIllustrationUploadForm";
import { translateStatus } from "@/lib/utils";

export default async function CommissionDetailPage({ params }) {
  const { id } = await params;

  const adminCheck = await isAdmin();
  if (!adminCheck) {
    redirect("/dashboard");
  }

  const result = await getCommissionById(id);
  const filesResult = await getCommissionFiles(id);

  // Si la commission n'existe pas, afficher une page 404
  if (!result.success || !result.commission) {
    notFound();
  }

  const commission = result.commission;
  const files = filesResult.success ? filesResult.files : [];

  // Séparer les fichiers par type
  const sketches = files.filter((file) => file.type === "sketch");
  const finalIllustrations = files.filter(
    (file) => file.type === "finalIllustration"
  );

  return (
    <>
      <Navbar />
      <main>
        <section className="commission-admin-id">
          <div className="container-header">
            <h1>Détails de la commission #{id}</h1>
            <Link href="/admin/commission" className="retour">
              Retour
            </Link>
          </div>

          <div className="container-content">
            <div>
              <div className="info">
                <h2>Informations générales</h2>
                <p>
                  <span>ID:</span> {commission.id}
                </p>
                <p>
                  <span>Titre:</span> {commission.title}
                </p>
                <p>
                  <span>Type:</span> {commission.type}
                </p>
                <p>
                  <span>Fond inclus:</span>{" "}
                  {commission.background ? "Oui" : "Non"}
                </p>
                <p>
                  <span>Statut:</span>{" "}
                  <span>{translateStatus(commission.status)}</span>
                </p>
                {commission.status === "rejected" &&
                  commission.rejectionReason && (
                    <p>
                      <span>Raison du refus:</span> {commission.rejectionReason}
                    </p>
                  )}
                <p>
                  <span>Prix:</span>{" "}
                  {commission.background
                    ? commission.commissionPrice.baseAmount +
                      commission.commissionPrice.bgAddon
                    : commission.commissionPrice.baseAmount}
                  €
                </p>
              </div>

              <div className="info">
                <h2>Informations client</h2>
                <p>
                  <span>ID Client:</span> {commission.userId}
                </p>
                <p>
                  <span>Email:</span> {commission.user?.email}
                </p>
              </div>
            </div>

            <div className="info">
              <h2>Description</h2>
              <div>
                <p>{commission.description}</p>
              </div>
            </div>

            <div className="info">
              <h2>Gérer le statut</h2>
              <CommissionStatusForm
                id={commission.id}
                currentStatus={commission.status}
              />
            </div>

            <div className="info">
              <h2>Croquis</h2>
              {sketches.length > 0 && (
                <div>
                  <h3>Croquis déjà envoyés :</h3>
                  <ul>
                    {sketches.map((sketch) => (
                      <li key={sketch.id}>
                        <a
                          href={sketch.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {sketch.fileName || `Croquis #${sketch.id}`}
                        </a>
                        <span>
                          {" "}
                          - Ajouté le{" "}
                          {new Date(sketch.createdAt).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <SketchUploadForm id={commission.id} status={commission.status} />
            </div>

            <div className="info">
              <h2>Illustrations finales</h2>
              {finalIllustrations.length > 0 && (
                <div>
                  <h3>Illustrations finales déjà envoyées :</h3>
                  <ul>
                    {finalIllustrations.map((illustration) => (
                      <li key={illustration.id}>
                        <a
                          href={illustration.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {illustration.fileName ||
                            `Illustration #${illustration.id}`}
                        </a>
                        <span>
                          {" "}
                          - Ajouté le{" "}
                          {new Date(
                            illustration.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <FinalIllustrationUploadForm
                id={commission.id}
                status={commission.status}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
