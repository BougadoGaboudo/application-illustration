import Link from "next/link";
import Image from "next/image";
import { checkAuth, isAdmin } from "@/lib/auth";
import LogoutButton from "../Logout/LogoutButton";

export async function Navbar() {
  const user = await checkAuth();
  const admin = await isAdmin();
  return (
    <>
      <header>
        <nav>
          <Link href="/">
            <Image
              src="/img/logo.png"
              width={100}
              height={80}
              alt="Logo"
              priority
            />
          </Link>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/gallery">Gallery</Link>
            </li>
            <li>
              <Link href="/commission">Commission</Link>
            </li>
            <li>
              <Link href="/shop">Shop</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
          <div className="cart-log">
            {admin ? (
              <Link href="/admin">
                <Image src="/img/cart.png" width={40} height={40} alt="Cart" />
              </Link>
            ) : (
              <Link href="/dashboard">
                <Image src="/img/cart.png" width={40} height={40} alt="Cart" />
              </Link>
            )}
            {user && <LogoutButton />}
          </div>
        </nav>
        <hr />
      </header>
    </>
  );
}

export default Navbar;
