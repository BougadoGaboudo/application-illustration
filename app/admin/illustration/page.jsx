import Navbar from "@/components/Navbar/Navbar";
import { createIllustration } from "@/lib/illustration.action";

export default function IllustrationAdminPage() {
  return (
    <>
      <Navbar />
      <div>
        <h1>Gestion des illustrations</h1>
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
    </>
  );
}
