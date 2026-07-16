'use client';

import { useState, useRef } from 'react';
import { updateSetting, uploadBannerImage } from './actions';

export default function BannerSettingsForm({ initialBannersStr }: { initialBannersStr: string }) {
  const [banners, setBanners] = useState<string[]>(() => {
    try {
      return JSON.parse(initialBannersStr);
    } catch {
      return ['/kongo_promo_banner.png']; // Fallback
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleAdd = () => {
    setBanners([...banners, '']);
  };

  const handleRemove = (index: number) => {
    setBanners(banners.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, value: string) => {
    const newBanners = [...banners];
    newBanners[index] = value;
    setBanners(newBanners);
  };

  const handleFileUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const publicUrl = await uploadBannerImage(formData);
      
      const newBanners = [...banners];
      newBanners[index] = publicUrl;
      setBanners(newBanners);
    } catch (error: any) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const validBanners = banners.filter(b => b.trim() !== '');
      await updateSetting('homepage_banners', JSON.stringify(validBanners));
      alert('Banners updated successfully!');
      if (validBanners.length !== banners.length) {
        setBanners(validBanners); // Clean up UI
      }
    } catch (error: any) {
      alert('Failed to save banners: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm">
      <h2 className="font-poppins text-lg font-semibold text-black mb-6">Homepage Slider Banners</h2>
      <div className="space-y-4">
        <p className="text-sm font-inter text-gray-500 mb-4">
          Upload banner images directly from your computer, or paste external URLs. They will automatically switch every 4 seconds on the homepage.
        </p>

        {banners.map((banner, index) => (
          <div key={index} className="flex gap-4 items-start p-4 border border-gray-100 bg-gray-50/50 rounded">
            <div className="flex-1 space-y-3">
              
              <div className="flex gap-3 items-center">
                <label className="bg-white border border-gray-300 text-black px-4 py-2 rounded text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">upload</span>
                  {uploadingIndex === index ? 'Uploading...' : 'Upload Image'}
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingIndex === index}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(index, e.target.files[0]);
                      }
                    }}
                  />
                </label>
                <span className="text-xs text-gray-400 font-inter font-semibold uppercase">OR</span>
                <input 
                  type="text" 
                  value={banner}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="flex-1 bg-white border border-gray-300 py-2 px-3 font-inter text-sm text-black rounded focus:outline-none focus:border-black transition-colors"
                  placeholder="Paste image URL here..."
                />
              </div>

              {banner && (
                <div className="mt-2">
                  <p className="text-[10px] text-gray-400 font-inter uppercase tracking-widest mb-1.5 font-bold">Preview:</p>
                  <img 
                    src={banner} 
                    alt={`Banner ${index + 1}`} 
                    className="w-full max-h-32 object-cover rounded shadow-sm border border-gray-200"
                  />
                </div>
              )}
            </div>

            {banners.length > 1 && (
              <button 
                type="button"
                onClick={() => handleRemove(index)}
                className="mt-1 bg-white border border-red-200 text-red-600 p-2 rounded hover:bg-red-50 transition-colors flex items-center justify-center"
                title="Remove Banner"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            )}
          </div>
        ))}

        <div className="pt-4 flex gap-4">
          <button 
            type="button" 
            onClick={handleAdd}
            className="flex items-center gap-2 border border-black text-black px-4 py-2.5 rounded font-inter text-xs uppercase tracking-wider font-semibold hover:bg-black hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Another Banner
          </button>
        </div>

        <div className="pt-6 border-t border-gray-200 mt-6">
          <button 
            type="button" 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-black text-white px-8 py-3 rounded font-inter text-sm uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
            {isSaving ? 'Saving...' : 'Save All Banners'}
          </button>
        </div>
      </div>
    </div>
  );
}
