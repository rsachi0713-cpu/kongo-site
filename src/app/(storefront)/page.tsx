import Hero from '@/components/Hero';
import HotDeals from '@/components/HotDeals';
import Trending from '@/components/Trending';
import BrowseCategories from '@/components/BrowseCategories';
import Newsletter from '@/components/Newsletter';

export default function Home() {
  return (
    <>
      <Hero />
      <HotDeals />
      <Trending />
      <BrowseCategories />
      <Newsletter />
    </>
  );
}
