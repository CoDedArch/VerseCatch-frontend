import { useEffect } from "react";
import { AdBannerProps } from "@/shared/constants/interfaceConstants";
import { PropellerAd } from "@/shared/constants/interfaceConstants";

declare global {
  interface Window {
    propeller?: PropellerAd;
  }
}

const AdBanner = ({ onClose }: Omit<AdBannerProps, "progress">) => {
  useEffect(() => {
    // Initialize PropellerAds In-Page Push
    if (window.propeller) {
      window.propeller.showInPagePush({
        zone: 9339190, 
        container: "propeller-ad-container",
        onClose: () => {
          onClose();
        }
      });
    }

    return () => {
      if (window.propeller) {
        window.propeller.destroyInPagePush();
      }
    };
  }, [onClose]);

  return (
    <div className="fixed right-4 bottom-1/2 sm:bottom-4 w-72 bg-white rounded-lg shadow-xl z-[900] border border-gray-200">
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">Advertisement</span>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {/* Real PropellerAds Container */}
        <div 
          id="propeller-ad-container" 
          className="bg-gray-100 h-40 flex items-center justify-center rounded relative"
        >
          {/* Loading state */}
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading ad...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;