import { unstable_cache } from 'next/cache';
import { getLatestProducts } from '@/lib/actions/product/ProductGet';

export const getCachedHomeProducts = unstable_cache(
  async () => getLatestProducts(25),
  ["home-products"],
  {
    revalidate: 300,
  }
);
