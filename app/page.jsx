import HeroContent from "@/components/HeroContent/HeroContent";
import Navbar from "@/components/Navbar/Navbar";
import { getIllustrations } from "@/lib/illustration.action";

export default async function Home() {
  const illustrationsData = await getIllustrations();
  // console.log(illustrationsData);
  return (
    <div>
      <Navbar />
      <HeroContent title="Bougado Gaboudo" />
      <h1>Hello</h1>
      <div>
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
      </div>
    </div>
  );
}
