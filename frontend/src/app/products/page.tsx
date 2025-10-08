'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { COLORS, COMPONENT_STYLES, GRADIENTS, TEXT_STYLES, ICON_STYLES } from '@/utils/colors';
import { TYPOGRAPHY } from '@/utils/typography';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_path: string | null;
  is_active: boolean;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        // Handle different response formats
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.data && response.data.data) {
          setProducts(response.data.data);
        } else {
          setProducts([]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className={`text-center py-8 ${COLORS.status.error}`}>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className={`${TYPOGRAPHY.fontSize.h1} font-bold mb-8 ${COLORS.text.primary}`}>Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className={`${COMPONENT_STYLES.card.base} overflow-hidden`}>
              {product.image_path ? (
                <img src={product.image_path} alt={product.name} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className={`${COLORS.text.tertiary}`}>No image</span>
                </div>
              )}
              <div className="p-4">
                <h3 className={`${TYPOGRAPHY.fontSize.h4} font-semibold mb-2 ${COLORS.text.primary}`}>{product.name}</h3>
                <p className={`${COLORS.text.secondary} mb-2`}>{product.description}</p>
                <p className={`text-xl font-bold ${COLORS.text.primary}`}>${product.price}</p>
                <button className={`${COMPONENT_STYLES.button.primary} mt-4 w-full`}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
