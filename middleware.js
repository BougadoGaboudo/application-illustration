import { jwtVerify } from "jose"; // Importer jwtVerify de jose
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(req) {
  const token = req.cookies.get("token")?.value; // Récupérer la valeur du cookie
  const url = req.nextUrl.pathname;

  // console.log("Token:", token); // Log token pour vérifier s'il est bien récupéré

  if (!token) {
    if (url === "/login" || url === "/register") {
      console.log("Pas de token trouvé mais déjà sur /login ou /register");
      return NextResponse.next(); // Permettre l'accès à /login et /register sans token
    }

    console.log("Pas de token trouvé, redirection vers /login");
    return NextResponse.redirect(new URL("/login", req.url)); // Rediriger vers /login
  }

  try {
    // Utiliser jwtVerify de jose pour vérifier le token
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    // console.log("Payload:", payload); // Log du payload pour vérifier la décryption

    if (payload.role === "client" && (url.includes("/login") || url.includes("/register"))) {
      console.log("Client connecté, redirection vers /dashboard");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (payload.role === "admin" && (url.includes("/login") || url.includes("/register"))) {
      console.log("Admin connecté, redirection vers /admin");
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (url.includes("/admin") && payload.role !== "admin") {
      console.log("Accès interdit, utilisateur n'est pas admin");
      return NextResponse.redirect(new URL("/unauthorized", req.url)); // Rediriger vers une page d'erreur si non admin
    }

    if (url.includes("/dashboard") && payload.role !== "client") {
      console.log("Accès interdit, utilisateur n'est pas client");
      return NextResponse.redirect(new URL("/unauthorized", req.url)); // Rediriger vers une page d'erreur si non client
    }

    return NextResponse.next(); // Si tout va bien, permettre la requête
  } catch (error) {
    console.log("Erreur dans la vérification du token", error);
    return NextResponse.redirect(new URL("/login", req.url)); // Si token invalide, rediriger vers login
  }
}

// Routes sécurisées
export const config = {
  matcher: ["/dashboard", "/admin/:path*", "/login", "/register"], // Routes protégées
};
