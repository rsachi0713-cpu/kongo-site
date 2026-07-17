import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

const ALL_CATEGORIES = [
  {
    id: 'electronics',
    name: 'Electronics',
    dbNames: ['Electronics'],
    description: 'Latest gadgets and premium audio devices',
    icon: 'devices',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPsFe5g4wOw3XUATqlobCUeZ1xr3NZCPrcZDPDO_yce7Il7NRbDd2GuPnt5IprGP6PlUQ5xveDqJv2ziBEhmg2b9kGKx_M-Ekx1iTrSID_QtwI0bEvx8-sHTZITPTG0gMsSAQVIa4n9ANGgAlaMIuukicSE59GhrQAoBs2FALPnjGmcFlF5cooJ_i1_G9SLF25Aj8GKoH_Ftg9qIh3sNQx6Y-nB-So9SSDIIbo3UtvxGxxOLlSDROL'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    dbNames: ['Fashion'],
    description: 'Designer clothing and premium apparel',
    icon: 'checkroom',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkXt2jn41rgZrPTzG7LMpvq1nV5BPUCXTnrgDZniotIfGQ6XETmgL5Nq47nTklsvm3lfFT3Y8jGvHAZKhYXaKnKwSSI9Gncp9JONKjjTTdDHJj4xGWXfvv-8NtbjcR3QafrnOtywzqZR9HeO34Zn1zC6L7W6ahfOh9-YJTI5yNO9QlzgNccogfSYAwgjzzhazMpDS_eLwK-jBqUifxNA2IYOn6YDxtjGD6aWx0aOWvkziM0q6e1pOY'
  },
  {
    id: 'beauty',
    name: 'Beauty',
    dbNames: ['Beauty'],
    description: 'Luxury skincare and cosmetics',
    icon: 'face_retouching_natural',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDjA3w8UL4NeV-keCc75wSTry3wJxlIhliXXyFDAuLPas6uXBY3ewXVlFa2j-MVqZIWbvbBTKDra9h7LwhUaQzX2XP7mB1WR10uJtqtEf9_bwad8NG6-Marvn79nAwb27B7JUXkXeHuTf6gKjZUMlTL2Eu0K0-Oaf6VSoJTczxdNdOsEvs1MU_FdAaWwfXRfDELWnNd1UBG5Wp-TZBNXHFAs1phXF8_9pvDtyfj4-sVSa8q0WM419n'
  },
  {
    id: 'home-living',
    name: 'Home & Living',
    dbNames: ['Home & Living', 'Furniture'],
    description: 'Curated interior decor and furniture',
    icon: 'chair',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsllxvpntZ3J13n2AUw8vKynix0Z7ac_mxfEixl5OYNilQY-keZG6e7wgdfCag0LZxikPrqaTJea5W2m9fiUFAFhs2aSBkI58ojOa3AiPdXUYXBHLDJQngDnSMdhbZX8qrnSVhXqjYuAGkO8a_pSdLjW5qCW7pESahWXeFHlfLo5p6tZqHv3S6bBzYNz39PcJAaGSOxL5TwUkoCOc_i1JIS2y9_qHQO_3DpLer4weC89fFiOysDK7n'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    dbNames: ['Accessories', 'Watches'],
    description: 'Watches, jewelry, and leather goods',
    icon: 'watch',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_1pF6PgtG8fH-S5BYXuHKmVDjHIKgm0N9xM3pji3-vQIvEgnvvfcgQTxzceKCf35TOPAogmzBZDYy3t1Px6zlq5Yenu1C692mcUFq2V_shWEVl74LA0goNC0edrlrvsLxIQOU_9mqw_II5Khu11D80NU0OX4_6xeL-OHIl1bQm9c6jwfpWYdf7HkM-Ypzhw6FiQH2JNm4Zz8myOM5vox7yHFWn5n9gJMy5SYInqc2JNsbeX6WBQ9i'
  },
  {
    id: 'sports',
    name: 'Sports',
    dbNames: ['Sports'],
    description: 'High-end athletic wear and equipment',
    icon: 'sports_basketball',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPsFe5g4wOw3XUATqlobCUeZ1xr3NZCPrcZDPDO_yce7Il7NRbDd2GuPnt5IprGP6PlUQ5xveDqJv2ziBEhmg2b9kGKx_M-Ekx1iTrSID_QtwI0bEvx8-sHTZITPTG0gMsSAQVIa4n9ANGgAlaMIuukicSE59GhrQAoBs2FALPnjGmcFlF5cooJ_i1_G9SLF25Aj8GKoH_Ftg9qIh3sNQx6Y-nB-So9SSDIIbo3UtvxGxxOLlSDROL'
  }
];

export default async function CategoryList() {
  const supabase = await createClient();
  const { data: dbProducts } = await supabase.from('products').select('category');
  
  const products = dbProducts || [];

  const getProductCount = (dbNames: string[]) => {
    return products.filter(p => dbNames.includes(p.category)).length;
  };

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-12 animate-fade-in-up">
      {/* Header & Breadcrumbs */}
      <div className="mb-12">
        <nav aria-label="Breadcrumb" className="flex text-gray-500 font-inter text-xs uppercase tracking-widest mb-4 font-semibold">
          <ol className="inline-flex items-center space-x-2">
            <li className="inline-flex items-center">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                <span className="text-black border-b border-black pb-0.5">Categories</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="font-poppins text-3xl md:text-4xl font-semibold text-black tracking-tight">All Categories</h1>
        <p className="font-inter text-base text-gray-500 mt-2 max-w-2xl">Browse our complete collection of curated departments.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_CATEGORIES.map(category => {
          const count = getProductCount(category.dbNames);
          return (
            <Link key={category.id} href={`/shop?category=${encodeURIComponent(category.name)}`} className="group relative overflow-hidden bg-[#f9f9f9] border border-gray-200 hover:border-black transition-colors rounded-sm flex flex-col h-80">
              <div className="flex-1 relative overflow-hidden bg-gray-100 flex items-center justify-center p-6">
                <div 
                  className="absolute inset-0 bg-cover bg-center z-0 opacity-20 mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                  style={{ backgroundImage: `url('${category.image}')` }}
                ></div>
                <span className="material-symbols-outlined text-6xl text-gray-400 group-hover:text-black transition-colors relative z-10">
                  {category.icon}
                </span>
              </div>
              <div className="p-6 bg-white border-t border-gray-100 flex justify-between items-end">
                <div>
                  <h3 className="font-poppins text-xl font-bold text-black mb-1">{category.name}</h3>
                  <p className="font-inter text-sm text-gray-500">{category.description}</p>
                </div>
                <span className="font-inter text-xs bg-gray-100 text-black px-2.5 py-1 rounded font-semibold whitespace-nowrap">
                  {count} {count === 1 ? 'Product' : 'Products'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}



