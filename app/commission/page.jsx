// import Navbar from "@/components/Navbar/Navbar";
// import { isAdmin } from "@/lib/auth";
// import {
//   getAllCommissions,
//   getCommissionPrices,
// } from "@/lib/commission.action";
// import Commission from "./Commission";

// export default async function CommissionPage() {
//   // Vérifier si l'utilisateur est admin
//   const userRole = await isAdmin();

//   // Récupérer les données en fonction du rôle
//   let commissionsData = { success: false, commissions: [] };

//   if (userRole) {
//     // Si admin, récupérer toutes les commissions
//     commissionsData = await getAllCommissions();
//   }

//   return (
//     <>
//       <Navbar />
//       <main>
//         <Commission data={commissionsData} role={userRole} />
//       </main>
//     </>
//   );
// }

// src/app/commission/page.jsx
import { getCommissionPrices } from "@/lib/commission.action";
import Navbar from "@/components/Navbar/Navbar";
import CommissionForm from "./CommissionForm";

export default async function CommissionPage() {
  // Récupérer les prix disponibles pour les commissions
  const pricesData = await getCommissionPrices();

  return (
    <>
      <Navbar />
      <main>
        <section className="section-commission-page">
          <h1>Commissions : OPEN</h1>
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
