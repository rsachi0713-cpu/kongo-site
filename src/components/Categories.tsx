import Link from 'next/link';

export default function Categories() {
  return (
    <section className="py-[120px] px-5 md:px-16 max-w-[1440px] mx-auto bg-white animate-fade-in-up">
      <div className="text-center mb-16">
        <h2 className="font-poppins text-3xl md:text-4xl font-semibold text-black mb-2 tracking-tight">Curated Categories</h2>
        <div className="h-[1px] w-12 bg-black mx-auto mt-6"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px]">
        {/* Electronics (Large) */}
        <Link href="/shop?category=Electronics" className="col-span-2 row-span-2 group relative overflow-hidden bg-gray-100 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 transition-opacity group-hover:opacity-60"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center z-0 group-hover:scale-105 transition-transform duration-1000 ease-in-out opacity-80" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPsFe5g4wOw3XUATqlobCUeZ1xr3NZCPrcZDPDO_yce7Il7NRbDd2GuPnt5IprGP6PlUQ5xveDqJv2ziBEhmg2b9kGKx_M-Ekx1iTrSID_QtwI0bEvx8-sHTZITPTG0gMsSAQVIa4n9ANGgAlaMIuukicSE59GhrQAoBs2FALPnjGmcFlF5cooJ_i1_G9SLF25Aj8GKoH_Ftg9qIh3sNQx6Y-nB-So9SSDIIbo3UtvxGxxOLlSDROL')" }}
          ></div>
          <div className="relative z-20 flex flex-col items-center justify-end h-full w-full p-8 pb-10 text-white text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">devices</span>
            <h3 className="font-poppins text-2xl font-bold uppercase tracking-widest">Electronics</h3>
          </div>
        </Link>
        
        {/* Fashion */}
        <Link href="/shop?category=Fashion" className="group relative overflow-hidden bg-[#f3f3f3] flex flex-col items-center justify-center p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300">
          <span className="material-symbols-outlined text-3xl mb-4 text-gray-500 group-hover:text-black transition-colors">checkroom</span>
          <h3 className="font-inter text-sm uppercase tracking-wider text-black font-medium">Fashion</h3>
        </Link>
        
        {/* Beauty */}
        <Link href="/shop?category=Beauty" className="group relative overflow-hidden bg-[#f3f3f3] flex flex-col items-center justify-center p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300">
          <span className="material-symbols-outlined text-3xl mb-4 text-gray-500 group-hover:text-black transition-colors">face_retouching_natural</span>
          <h3 className="font-inter text-sm uppercase tracking-wider text-black font-medium">Beauty</h3>
        </Link>
        
        {/* Home & Living */}
        <Link href="/shop?category=Home%20%26%20Living" className="col-span-2 group relative overflow-hidden bg-gray-100 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center z-0 group-hover:scale-105 transition-transform duration-1000 ease-in-out opacity-40 mix-blend-multiply" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBsllxvpntZ3J13n2AUw8vKynix0Z7ac_mxfEixl5OYNilQY-keZG6e7wgdfCag0LZxikPrqaTJea5W2m9fiUFAFhs2aSBkI58ojOa3AiPdXUYXBHLDJQngDnSMdhbZX8qrnSVhXqjYuAGkO8a_pSdLjW5qCW7pESahWXeFHlfLo5p6tZqHv3S6bBzYNz39PcJAaGSOxL5TwUkoCOc_i1JIS2y9_qHQO_3DpLer4weC89fFiOysDK7n')" }}
          ></div>
          <div className="relative z-20 flex flex-col items-center justify-center h-full w-full p-6 text-black">
            <span className="material-symbols-outlined text-3xl mb-2">chair</span>
            <h3 className="font-poppins text-2xl font-bold uppercase tracking-widest text-center">Home &amp; Living</h3>
          </div>
        </Link>
      </div>
    </section>
  );
}
