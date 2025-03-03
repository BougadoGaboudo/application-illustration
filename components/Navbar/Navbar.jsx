import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
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
          <Link href="/shop">Shop</Link>
        </li>
        <li>
          <Link href="/event">Event</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
      <Link href="/cart">
        <Image src="/img/cart.png" width={40} height={40} alt="Cart" />
      </Link>
    </nav>
  );
};

export default Navbar;
