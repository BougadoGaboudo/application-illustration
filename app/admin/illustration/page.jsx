import Navbar from "@/components/Navbar/Navbar";
import { createIllustration } from "@/lib/illustration.action";

export default function IllustrationAdminPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="section-admin-illus">
          <h1>Gestion des illustrations</h1>
          <br />
          <form action={createIllustration}>
            <label htmlFor="title">Titre</label>
            <input type="text" name="title" id="title" />
            <label htmlFor="file">Fichier</label>
            <input type="file" name="file" id="file" accept="image/*" />
            <label htmlFor="type">Type</label>
            <select name="type" id="type">
              <option value="original">Original</option>
              <option value="fanart">Fanart</option>
              <option value="study">Study</option>
            </select>
            <button type="submit">Ajouter</button>
          </form>
        </section>
      </main>
    </>
  );
}
