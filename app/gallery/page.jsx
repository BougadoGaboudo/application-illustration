import GalleryGrid from "@/components/GalleryGrid/GalleryGrid";
import Navbar from "/components/Navbar/Navbar";
import { getIllustrations } from "/lib/illustration.action";

export default async function GalleryPage() {
  const illustrationsData = await getIllustrations();
  return (
    <>
      <Navbar />
      <main>
        <GalleryGrid data={illustrationsData} />
      </main>
    </>
  );
}
