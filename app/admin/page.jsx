import LogoutButton from "@/components/Logout/LogoutButton";
import Navbar from "@/components/Navbar/Navbar";
import { createIllustration } from "@/lib/illustration.action";

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <div>
        <h1>Bienvenue l'admin</h1>
        <LogoutButton />
        <br />
        <form action={createIllustration}>
          <label htmlFor="title">Titre</label>
          <input type="text" name="title" id="title" />
          <br />
          <label htmlFor="file">Fichier</label>
          <input type="file" name="file" id="file" accept="image/*" />
          <br />
          <label htmlFor="type">Type</label>
          <select name="type" id="type">
            <option value="original">Original</option>
            <option value="fanart">Fanart</option>
            <option value="study">Study</option>
          </select>
          <br />
          <label htmlFor="price">Prix</label>
          <input type="number" name="price" id="price" />
          <br />
          <button type="submit">Ajouter</button>
        </form>
      </div>
    </>
  );
}
