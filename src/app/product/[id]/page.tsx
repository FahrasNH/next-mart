import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { ProductDetail } from "@/components/product/ProductDetail";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  return (
    <>
      <Header />
      <ProductDetail productId={id} />
      <Footer />
    </>
  );
}
