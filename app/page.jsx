import ProductCard from '../components/Product/ProductCard'
import { getCachedHomeProducts } from '@/lib/actions/product/ProductCache';

export default async function Home() {
    const products = await getCachedHomeProducts();

    // STRESS TEST: Handle empty states or service failures
    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <h2 className="text-xl font-semibold text-gray-600">No products available right now.</h2>
                <p className="text-gray-400">Check back later for our latest arrivals.</p>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section / Headers */}
            <header className="mb-10 space-y-2">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                    Welcome Home
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl">
                    Discover our curated collection of favorites, handpicked just for you.
                </p>
            </header>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
                {products.map((p) => (
                    <div key={p._id.toString()} className="group transition-transform duration-300 hover:-translate-y-1">
                        <ProductCard product={p} />
                    </div>
                ))}
            </div>
        </main>
    )
}