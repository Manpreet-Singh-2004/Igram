import { unstable_cache } from 'next/cache';
import { getLatestProducts } from '@/lib/actions/product/ProductGet';
import { get } from 'http';

export const getCachedHomeProducts = unstable_cache(
    async () => getLatestProducts(25),get["home-products"],{
        revalidate: 300,
    }
)