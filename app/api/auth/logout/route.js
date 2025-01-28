export async function POST(req) {
  const res = new Response(JSON.stringify({ message: "Déconnexion réussie" }));

  // Supprimer le cookie 'token'
  res.headers.set(
    "Set-Cookie",
    "token=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict"
  );

  return res;
}
