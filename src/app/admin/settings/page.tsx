export default function AdminSettings() {
  return (
    <div className="animate-fade-in-up max-w-3xl">
      <div className="mb-8">
        <h1 className="font-poppins text-2xl font-semibold text-black">Settings</h1>
        <p className="font-inter text-sm text-gray-500 mt-1">Manage store preferences and configurations.</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm">
          <h2 className="font-poppins text-lg font-semibold text-black mb-6">General Details</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="storeName" className="block font-inter text-sm font-medium text-black mb-2">Store Name</label>
              <input 
                id="storeName" 
                type="text" 
                defaultValue="KONGO"
                className="w-full bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label htmlFor="contactEmail" className="block font-inter text-sm font-medium text-black mb-2">Contact Email</label>
              <input 
                id="contactEmail" 
                type="email" 
                defaultValue="support@kongo.com"
                className="w-full bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label htmlFor="currency" className="block font-inter text-sm font-medium text-black mb-2">Store Currency</label>
              <select 
                id="currency"
                className="w-full bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black transition-colors"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <button type="button" className="bg-black text-white px-6 py-2.5 rounded font-inter text-sm uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity">
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Notifications Settings */}
        <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm">
          <h2 className="font-poppins text-lg font-semibold text-black mb-6">Notifications</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-black focus:ring-black rounded border-gray-300" />
              <span className="font-inter text-sm text-black">Email me when a new order is placed</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-black focus:ring-black rounded border-gray-300" />
              <span className="font-inter text-sm text-black">Email me when a product is low in stock</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-black focus:ring-black rounded border-gray-300" />
              <span className="font-inter text-sm text-black">Receive weekly summary reports</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
