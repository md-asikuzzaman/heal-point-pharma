import Container from "@/components/shared/Container";
import Heading from "@/components/shared/Heading";
import { ProductCard } from "@/components/shared/ProductCard";
import { Product } from "@prisma/client";

export const revalidate = 60;

type ProductsApiResponse = {
  success: boolean;
  data: Product[];
};

export default async function ProductsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/products`, {
    next: { revalidate: 60 },
  });
  const products: ProductsApiResponse = await res.json();

  return (
    <section className="mt-6 md:mt-8 lg:mt-10">
      <Container className="bg-white py-8 md:py-10 rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 max-sm:px-2">
        <Heading text="All Products" />

        {/* Products list */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mt-8">
          {products.data.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
