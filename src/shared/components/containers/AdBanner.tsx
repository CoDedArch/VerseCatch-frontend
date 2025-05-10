import { AdBannerProps } from "@/shared/constants/interfaceConstants";


const AdBanner = ({ onClose, progress }: AdBannerProps) => {
  return (
    <div className="fixed right-4 bottom-1/2 sm:bottom-4 w-72 bg-white rounded-lg shadow-xl z-[900] border border-gray-200">
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">Advertisement</span>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={progress < 100}
          >
            ✕
          </button>
        </div>
        
        <div className="bg-gray-100 h-40 flex items-center justify-center rounded relative">
          {/* Mock Ad Content */}
          <div className="text-center p-4">
            <p className="font-medium mb-1">Sponsored Content</p>
            <p className="text-sm text-gray-600">Your ad would appear here</p>
          </div>
          
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div 
              className="h-full bg-blue-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;