import { getSetting } from '@/app/admin/settings/actions';
import HeroSlider from './HeroSlider';

export default async function Hero() {
  const bannersStr = await getSetting('homepage_banners', JSON.stringify(['/kongo_promo_banner.png']));
  
  let banners: string[] = [];
  try {
    banners = JSON.parse(bannersStr);
  } catch (e) {
    banners = ['/kongo_promo_banner.png'];
  }

  // Fallback if empty array
  if (!banners || banners.length === 0) {
    banners = ['/kongo_promo_banner.png'];
  }

  return <HeroSlider banners={banners} />;
}
