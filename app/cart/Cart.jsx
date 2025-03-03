// import Image from "next/image";

// export default function Cart({ data }) {
//   return (
//     <>
//       <section className="section-cart">
//         <h1>Votre panier</h1>

//         <table>
//           <thead>
//             <tr>
//               <th>Illustration</th>
//               <th>Titre</th>
//               <th>Prix Unitaire</th>
//               <th>Quantité</th>
//               <th>Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.items?.map((item) => (
//               <tr key={item.id} className="cart-item">
//                 <td>
//                   <Image
//                     src={item.illustration.url}
//                     alt={item.illustration.title}
//                     height={80}
//                     width={64}
//                     style={{ height: "100%", width: "100%" }}
//                   />
//                 </td>
//                 <td>{item.illustration.title}</td>
//                 <td className="price">{item.illustration.price}€</td>
//                 <td className="quantity">{item.quantity}</td>
//                 <td className="total">
//                   {item.illustration.price * item.quantity}€
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="cart-total">
//           Total:{" "}
//           {data.items?.reduce(
//             (sum, item) => sum + item.illustration.price * item.quantity,
//             0
//           )}
//           €
//         </div>
//       </section>
//     </>
//   );
// }

import Image from "next/image";
import { updateCartItem, removeFromCart } from "@/lib/cart.action";

export default function Cart({ data }) {
  if (!data || data.error) {
    return (
      <section className="section-cart">
        <h1>Votre panier</h1>
        <p>Votre panier est vide ou une erreur s'est produite.</p>
      </section>
    );
  }

  return (
    <>
      <section className="section-cart">
        <h1>Votre panier</h1>

        <table>
          <thead>
            <tr>
              <th>Illustration</th>
              <th>Titre</th>
              <th>Format</th>
              <th>Taille</th>
              <th>Prix Unitaire</th>
              <th>Quantité</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.items?.map((item) => (
              <tr key={item.id} className="cart-item">
                <td>
                  <Image
                    src={item.illustration.url}
                    alt={item.illustration.title}
                    height={80}
                    width={64}
                    style={{ height: "100%", width: "100%" }}
                  />
                </td>
                <td>{item.illustration.title}</td>
                <td>{item.format.name}</td>
                <td>{item.size.name}</td>
                <td className="price">{item.price}€</td>
                <td className="quantity">
                  <form action={updateCartItem}>
                    <input type="hidden" name="cartItemId" value={item.id} />
                    <input
                      type="number"
                      name="quantity"
                      min="1"
                      defaultValue={item.quantity}
                      className="quantity-input"
                    />
                    <button type="submit" className="update-btn">
                      Mettre à jour
                    </button>
                  </form>
                </td>
                <td className="total">{item.price * item.quantity}€</td>
                <td>
                  <form action={removeFromCart}>
                    <input type="hidden" name="cartItemId" value={item.id} />
                    <button type="submit" className="remove-btn">
                      Supprimer
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cart-total">
          Total:{" "}
          {data.items?.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          )}
          €
        </div>
      </section>
    </>
  );
}
