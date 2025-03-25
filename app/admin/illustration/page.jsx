import Navbar from "@/components/Navbar/Navbar";
import { createIllustration } from "@/lib/illustration.action";
import AdminIllustration from "./AdminIllustration";
import { getAllTags } from "@/lib/tag.action";

export default async function IllustrationAdminPage() {
  const allTags = await getAllTags();
  return (
    <>
      <Navbar />
      <main>
        <AdminIllustration
          createIllustration={createIllustration}
          existingTags={allTags}
        />
      </main>
    </>
  );
}
