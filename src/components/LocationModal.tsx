import React, { useState } from 'react';
import { X, MapPin, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const LocationModal: React.FC = () => {
  const { locationModalOpen, setLocationModalOpen, deliveryLocation, setDeliveryLocation, showToast } = useShop();

  const [zipInput, setZipInput] = useState(deliveryLocation.zip);
  const [selectedCity, setSelectedCity] = useState(deliveryLocation.city);

  if (!locationModalOpen) return null;

  const popularLocations = [
    { city: 'Seattle', zip: '98101' },
    { city: 'New York', zip: '10001' },
    { city: 'San Francisco', zip: '94105' },
    { city: 'Austin', zip: '78701' },
    { city: 'Chicago', zip: '60601' },
    { city: 'Miami', zip: '33101' },
  ];

  const handleApplyCustomZip = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipInput.trim()) {
      setDeliveryLocation({
        city: selectedCity || 'Custom Location',
        zip: zipInput.trim(),
        country: 'US',
      });
      setLocationModalOpen(false);
      showToast(`Delivery location updated to ${zipInput}`);
    }
  };

  const handleSelectPreset = (loc: { city: string; zip: string }) => {
    setDeliveryLocation({
      city: loc.city,
      zip: loc.zip,
      country: 'US',
    });
    setLocationModalOpen(false);
    showToast(`Delivery location updated to ${loc.city} (${loc.zip})`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 text-xs">
      <div
        className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#f0f2f2] px-4 py-3 border-b border-gray-300 flex items-center justify-between">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-amber-600" />
            Choose your location
          </h3>
          <button
            onClick={() => setLocationModalOpen(false)}
            className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Delivery options and delivery speeds may vary for different locations.
          </p>

          {/* Quick Select Presets */}
          <div className="space-y-2">
            <span className="font-bold text-gray-800">Popular Delivery Hubs:</span>
            <div className="grid grid-cols-2 gap-2">
              {popularLocations.map((loc) => (
                <button
                  key={loc.zip}
                  onClick={() => handleSelectPreset(loc)}
                  className={`p-2 rounded border text-left flex items-center justify-between transition-all ${
                    deliveryLocation.zip === loc.zip
                      ? 'border-[#e77600] bg-amber-50 font-bold text-gray-900'
                      : 'border-gray-300 hover:border-gray-500 bg-white text-gray-700'
                  }`}
                >
                  <div>
                    <p className="font-semibold">{loc.city}</p>
                    <p className="text-[11px] text-gray-500">{loc.zip}</p>
                  </div>
                  {deliveryLocation.zip === loc.zip && (
                    <Check className="w-4 h-4 text-amber-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center my-3">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-3 text-gray-400 font-medium text-[11px]">or enter a US zip code</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {/* Custom Zip Form */}
          <form onSubmit={handleApplyCustomZip} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 90210"
              value={zipInput}
              onChange={(e) => setZipInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              maxLength={5}
            />
            <button
              type="submit"
              className="px-5 py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold rounded shadow-sm"
            >
              Apply
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-right">
          <button
            onClick={() => setLocationModalOpen(false)}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
