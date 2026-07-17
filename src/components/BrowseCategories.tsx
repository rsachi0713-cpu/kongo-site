import Link from 'next/link';

const CATEGORIES_DATA = [
  {
    name: 'Electronics',
    slug: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&auto=format&fit=crop&q=80',
    icon: 'devices'
  },
  {
    name: 'Fashion',
    slug: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=80',
    icon: 'checkroom'
  },
  {
    name: 'Beauty',
    slug: 'Beauty',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&auto=format&fit=crop&q=80',
    icon: 'spa'
  },
  {
    name: 'Home & Living',
    slug: 'Home%20%26%20Living',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&auto=format&fit=crop&q=80',
    icon: 'home'
  },
  {
    name: 'Accessories',
    slug: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&auto=format&fit=crop&q=80',
    icon: 'shopping_bag'
  },
  {
    name: 'Watches',
    slug: 'Watches',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80',
    icon: 'watch'
  },
  {
    name: 'Furniture',
    slug: 'Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&auto=format&fit=crop&q=80',
    icon: 'chair'
  }
];

export default function BrowseCategories() {
  return (
    <section className="py-10 md:py-20 px-4 md:px-16 max-w-[1440px] mx-auto animate-fade-in-up border-t border-gray-100">
      {/* Categories Header */}
      <div className="text-center mb-8 md:mb-16">
        <span className="text-purple-700 font-inter text-xs uppercase tracking-widest font-black block mb-2">Shop By department</span>
        <h2 className="font-poppins text-2xl md:text-4xl font-bold text-black tracking-tight">Explore Categories</h2>
        <p className="font-inter text-sm text-gray-500 mt-2 max-w-md mx-auto">Browse through our wide collection of premium items curated just for you.</p>
      </div>

      {/* Grid container with 7 columns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
        {CATEGORIES_DATA.map((cat) => (
          <Link 
            key={cat.name} 
            href={`/shop?category=${cat.slug}`}
            className="group flex flex-col items-center text-center bg-white border border-gray-200 hover:border-purple-800 rounded-lg p-4 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Image Wrapper */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-purple-700 transition-colors relative mb-4 shadow-inner">
              <img 
                src={cat.imageUrl} 
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-purple-900/10 group-hover:bg-transparent transition-colors duration-300" />
            </div>

            {/* Icon & Name */}
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-gray-400 group-hover:text-purple-700 transition-colors text-[20px]">
                {cat.icon}
              </span>
              <span className="font-inter text-xs font-bold text-black group-hover:text-purple-700 transition-colors uppercase tracking-wider">
                {cat.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
