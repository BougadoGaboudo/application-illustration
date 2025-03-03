import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const url = request.nextUrl.pathname;

  // Routes publiques
  if (url === "/login" || url === "/register") {
    if (!token) {
      return NextResponse.next();
    }
    
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      
      // Redirection des utilisateurs déjà connectés
      if (payload.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/cart", request.url));
    } catch {
      return NextResponse.next();
    }
  }

  // Vérification du token pour les routes protégées
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    // Protection des routes admin
    if (url.startsWith("/admin")) {
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    // Protection des routes client
    if (url.startsWith("/cart")) {
      if (payload.role !== "client") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    // Protection des routes du panier (clients uniquement)
    if (url.startsWith("/cart")) {
      if (payload.role !== "client") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Erreur de vérification du token:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/admin/:path*",
    "/cart/:path*",
    "/login",
    "/register"
  ]
};