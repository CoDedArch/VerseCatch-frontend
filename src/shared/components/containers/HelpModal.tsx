import { ModalProps } from "@/shared/constants/interfaceConstants";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import BlurImage from "./ImageBlur";

const HelpModal = ({ isOpen, onClose }: ModalProps) => {
  const theme = useSelector((state: RootState) => state.theme.currentTheme);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100000] no-highlight">
      <div
        style={{
          background:
            theme.display_name === "Dark Night" ||
            theme.display_name === "Twilight"
              ? "white"
              : theme.styles.mainBackground?.background,
        }}
        className={`bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Get Help</h2>
          <button
            className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              How to Use VerseCatch
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Speak a Bible Verse</h4>
                  <p
                    className={`text-sm ${
                      theme.display_name === "Royal Purple" ||
                      theme.display_name === "Fiery Red" ||
                      theme.display_name === "Golden Hour"
                        ? "text-white"
                        : "text-gray-600 "
                    }`}
                  >
                    Say something like "John 3:16"
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium">View the Verse</h4>
                  <p
                    className={`text-sm ${
                      theme.display_name === "Royal Purple" ||
                      theme.display_name === "Fiery Red" ||
                      theme.display_name === "Golden Hour"
                        ? "text-white"
                        : "text-gray-600 "
                    }`}
                  >
                    The system will display the verse from your preferred Bible
                    version.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Explore More</h4>
                  <p
                    className={`text-sm ${
                      theme.display_name === "Royal Purple" ||
                      theme.display_name === "Fiery Red" ||
                      theme.display_name === "Golden Hour"
                        ? "text-white"
                        : "text-gray-600 "
                    }`}
                  >
                    Click on the verse to see the full chapter or book context.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              <div className="border-b pb-3">
                <h4 className="font-medium">
                  How do I change my Bible version?
                </h4>
                <p
                  className={`text-sm ${
                    theme.display_name === "Royal Purple" ||
                    theme.display_name === "Fiery Red" ||
                    theme.display_name === "Golden Hour"
                      ? "text-white"
                      : "text-gray-600 "
                  }`}
                >
                  click on the three dots at the bottom of your screen and
                  select your preferred version from the dropdown menu.
                </p>
              </div>
              <div className="border-b pb-3">
                <h4 className="font-medium">
                  Why isn't the voice recognition working?
                </h4>
                <p
                  className={`text-sm ${
                    theme.display_name === "Royal Purple" ||
                    theme.display_name === "Fiery Red" ||
                    theme.display_name === "Golden Hour"
                      ? "text-white"
                      : "text-gray-600 "
                  }`}
                >
                  Make sure you've granted microphone permissions to your
                  browser. Try refreshing the page.
                </p>
              </div>
              <div className="border-b pb-3">
                <h4 className="font-medium">How do I earn faith coins?</h4>
                <p
                  className={`text-sm ${
                    theme.display_name === "Royal Purple" ||
                    theme.display_name === "Fiery Red" ||
                    theme.display_name === "Golden Hour"
                      ? "text-white"
                      : "text-gray-600 "
                  }`}
                >
                  You earn coins by completing daily tasks like logging in and
                  catching verses.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Need More Help?</h3>
            <p className="text-gray-700 mb-3">
              Contact our support team for additional assistance:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BlurImage
                  src="/assets/email.png"
                  alt="Email"
                  className="w-5 h-5 pointer-events-none"
                  isIcon={true}
                />
                <span>support@versecatch.pro</span>
              </div>
              <div className="flex items-center gap-2">
                <BlurImage
                  src="/assets/phone.png"
                  alt="Phone"
                  className="w-5 h-5 pointer-events-none"
                  isIcon={true}
                />
                <span>+233 59 615 7150</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              style={{
                backgroundImage: "url('/assets/fr.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundBlendMode: "overlay",
                background:
                  "linear-gradient(13deg, rgba(20, 50, 20, 1), rgba(36, 20, 15, 0.2))",
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 hover:cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
