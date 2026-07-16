import { getSetting } from './actions';
import BannerSettingsForm from './BannerSettingsForm';

export default async function AdminSettings() {
  const currentBannersStr = await getSetting('homepage_banners', JSON.stringify(['/kongo_promo_banner.png']));

  return (
    <div className="animate-fade-in-up max-w-3xl">
      <div className="mb-8">
        <h1 className="font-poppins text-2xl font-semibold text-black">Settings</h1>
        <p className="font-inter text-sm text-gray-500 mt-1">Manage store preferences and configurations.</p>
      </div>

      <div className="space-y-6">
        {/* Appearance Settings - Multi-Banner Slider */}
        <BannerSettingsForm initialBannersStr={currentBannersStr} />

        {/* General Settings (Static Mock for now) */}
        <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm opacity-60 pointer-events-none">
          <h2 className="font-poppins text-lg font-semibold text-black mb-6">General Details (Coming Soon)</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="storeName" className="block font-inter text-sm font-medium text-black mb-2">Store Name</label>
              <input 
                id="storeName" 
                type="text" 
                defaultValue="KONGO"
                className="w-full bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black transition-colors"
                disabled
              />
            </div>
            <div>
              <label htmlFor="contactEmail" className="block font-inter text-sm font-medium text-black mb-2">Contact Email</label>
              <input 
                id="contactEmail" 
                type="email" 
                defaultValue="support@kongo.com"
                className="w-full bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black transition-colors"
                disabled
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
