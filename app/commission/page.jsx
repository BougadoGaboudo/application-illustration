import { getCommissionPrices } from "@/lib/commission.action";
import Navbar from "@/components/Navbar/Navbar";
import CommissionForm from "./CommissionForm";
import { getRecentCommissions } from "@/lib/commissionFile.action";
import RecentCommissions from "./RecentCommission";

export default async function CommissionPage() {
  const recentCommissions = await getRecentCommissions();
  // Récupérer les prix disponibles pour les commissions
  const pricesData = await getCommissionPrices();

  return (
    <>
      <Navbar />
      <main>
        <section className="section-commission-page">
          <RecentCommissions recentCommissions={recentCommissions} />
          <h1>Commissions</h1>
          <p>
            Thank you for your interest!
            <br />
            To commission me, please fill the form below by :
            <br />- providing a clear and relevant title for your commission
            request
            <br />- selecting options you want (Full-body/Half-body/Portrait,
            with/out BG)
            <br />- describing precisely what kind of illustration you want from
            me
            <br />
            Feel free to ask any questions. <br />
            Generally the commission will take from a few days to a month and a
            half mostly depending on if I have other commissions waiting and how
            complex your commission is.
          </p>
          <CommissionForm prices={pricesData.prices || []} />
        </section>
      </main>
    </>
  );
}
