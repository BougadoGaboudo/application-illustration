import LogoutButton from "@/components/Logout/LogoutButton";
import { createIllustration } from "@/lib/illustration.action";

export default function AdminPage() {
  return (
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
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}
