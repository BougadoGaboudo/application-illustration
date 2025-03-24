import Navbar from "@/components/Navbar/Navbar";
import { checkAuth } from "@/lib/auth";
import { getCart } from "@/lib/cart.action";
import Cart from "./Cart";
import Link from "next/link";

export default async function CartPage() {
  const auth = await checkAuth();
  if (!auth) return <div>Veuillez vous connecter</div>;

  const cart = await getCart(auth.id);

  return (
    <>
      <Navbar />
      <main>
        {cart ? (
          cart.items?.length ? (
            <Cart data={cart} />
          ) : (
            <div className="empty">
              <div>Votre panier est vide :(</div>
              <Link href="/shop">Visiter le shop</Link>
            </div>
          )
        ) : (
          <div>Panier non disponible</div>
        )}
      </main>
    </>
  );
}
