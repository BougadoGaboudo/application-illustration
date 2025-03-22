import Navbar from "@/components/Navbar/Navbar";
import { checkAuth } from "@/lib/auth";
import { getCart } from "@/lib/cart.action";
import Cart from "./Cart";

export default async function CartPage() {
  const auth = await checkAuth();
  if (!auth) return <div>Veuillez vous connecter</div>;

  const cart = await getCart(auth.id);

  return (
    <>
      <Navbar />
      {cart ? (
        cart.items?.length ? (
          <Cart data={cart} />
        ) : (
          <div>Votre panier est vide</div>
        )
      ) : (
        <div>Panier non disponible</div>
      )}
    </>
  );
}
