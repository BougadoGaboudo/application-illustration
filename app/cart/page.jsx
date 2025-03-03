import LogoutButton from "@/components/Logout/LogoutButton";
import Navbar from "@/components/Navbar/Navbar";
import { checkAuth } from "@/lib/auth";
import { getCart } from "@/lib/cart.action";
import Cart from "./Cart";

export default async function CartPage() {
  const auth = await checkAuth();
  if (!auth) return <div>Veuillez vous connecter</div>;

  const cart = await getCart(auth.id);
  // if (!cart || !cart.items?.length) return <div>Votre panier est vide</div>;

  return (
    <>
      <Navbar />
      <LogoutButton />
      {cart.items?.length ? (
        <Cart data={cart} />
      ) : (
        <div>Votre panier est vide</div>
      )}
    </>
  );
}
