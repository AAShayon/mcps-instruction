import { getProductById } from '@/lib/api';
import { COLORS, COMPONENT_STYLES, GRADIENTS, TEXT_STYLES, ICON_STYLES } from '@/utils/colors';
import { TYPOGRAPHY } from '@/utils/typography';

async function getProductData(id: string) {
  try {
    const response = await getProductById(id);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductData(params.id);

  if (!product) {
    return <div className={`${COLORS.text.primary}`}>Product not found</div>;
  }

  return (
    <div>
      <header className={`${COMPONENT_STYLES.card.base} shadow`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className={`${TYPOGRAPHY.fontSize.h1} font-bold ${COLORS.text.primary}`}>E-commerce</h1>
        </div>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <h1 className={`${TYPOGRAPHY.fontSize.display} font-bold text-center ${COLORS.text.primary}`}>{product.name}</h1>
        </div>
        <div className="mt-12">
          <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden lg:h-80 lg:aspect-none">
            <img
              src={product.image_path}
              alt={product.name}
              className="w-full h-full object-center object-cover lg:w-full lg:h-full"
            />
          </div>
          <div className="mt-4">
            <p className={`text-lg font-medium ${COLORS.text.primary}`}>${product.price}</p>
            <p className={`mt-4 ${COLORS.text.secondary}`}>{product.description}</p>
          </div>
        </div>
      </main>
      <footer className={`${COMPONENT_STYLES.card.base}`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className={`text-center ${COLORS.text.tertiary}`}>© 2025 E-commerce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
