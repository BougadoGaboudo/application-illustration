import GalleryGrid from "@/components/GalleryGrid/GalleryGrid";
import Navbar from "/components/Navbar/Navbar";
import { getIllustrations } from "/lib/illustration.action";

export default async function GalleryPage() {
  const illustrationsData = await getIllustrations();
  return (
    <>
      <Navbar />
      {/* <div>
        {illustrationsData.map((illustration) => (
          <div key={illustration.id}>
            <h2>{illustration.title}</h2>
            <img
              style={{ width: "400px" }}
              src={illustration.url}
              alt={illustration.title}
            />
          </div>
        ))}
      </div> */}
      <GalleryGrid data={illustrationsData} />
    </>
  );
}
