import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="admin-section">
          <div className="admin-container">
            <Link href="/admin/illustration">Gestion des illustrations</Link>
            <Link href="/admin/commission">Gestion des commissions</Link>
          </div>
        </section>
      </main>
    </>
  );
}
