import Navbar from "@/components/Navbar/Navbar";
import Shop from "./Shop";
import { getShopIllustrations } from "@/lib/illustration.action";

export default async function ShopPage() {
  const illustrationsData = await getShopIllustrations();

  return (
    <>
      <Navbar />
      <Shop data={illustrationsData} />
    </>
  );
}
