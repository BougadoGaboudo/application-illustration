import Navbar from "@/components/Navbar/Navbar";
import { checkAuth } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const auth = await checkAuth();
  if (!auth) return <div>Veuillez vous connecter</div>;

  return (
    <>
      <Navbar />
      <main>
        <section className="dashboard-section">
          <div className="dashboard-container">
            <Link href="/dashboard/cart">Mon panier</Link>
            <Link href="/dashboard/commission">Mes commissions</Link>
          </div>
        </section>
      </main>
    </>
  );
}
