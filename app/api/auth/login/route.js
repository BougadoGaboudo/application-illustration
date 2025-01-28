// api/login/route.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return new Response(JSON.stringify({ error: "Utilisateur introuvable." }), {
      status: 404,
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return new Response(JSON.stringify({ error: "Mot de passe incorrect." }), {
      status: 401,
    });
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "1d",
  });

  return new Response(
    JSON.stringify({
      token,
      role: user.role, // Ajouter le rôle dans la réponse
    }),
    {
      status: 200,
      headers: { "Set-Cookie": `token=${token}; HttpOnly; Path=/` },
    }
  );
}
