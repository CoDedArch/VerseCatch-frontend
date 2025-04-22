import { ModalProps } from "@/shared/constants/interfaceConstants";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const AboutModal = ({ isOpen, onClose }: ModalProps) => {
  const theme = useSelector((state: RootState) => state.theme.currentTheme);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100000] no-highlight">
      <div
        style={{ background: theme.display_name === "Dark Night" || theme.display_name === "Twilight" ? "white" : theme.styles.mainBackground?.background }}
        className={`${theme.styles.mainBackground?.background } bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">About VerseCatch</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <img
              src="/assets/book.png"
              alt="VerseCatch Logo"
              className="w-16 h-16 pointer-events-none"
            />
            <div>
              <h3 className="text-xl font-semibold">Bible Verse Catcher</h3>
              <p className="text-gray-600">
                Making scripture engagement accessible and intuitive
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">What is VerseCatch?</h3>
            <p className="text-gray-700">
              VerseCatch is an innovative platform that listens to you,
              transcribes any Bible quotation you speak, and instantly retrieves
              the exact passage from your preferred Bible version. Whether
              you're studying, preaching, or simply want to recall a verse,
              VerseCatch makes engaging with scripture effortless.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Key Features</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Real-time Bible verse transcription and retrieval</li>
              <li>Support for over 27 Bible versions (KJV, NIV, ESV, etc.)</li>
              <li>Voice recognition for hands-free operation</li>
              <li>Daily scripture engagement tracking</li>
              <li>Reward system for consistent Bible reading</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">About the Developer</h3>
            <div className="flex items-center gap-4">
              <img
                src="/assets/developer.jpg"
                alt="Developer"
                className="w-40 h-40 rounded-full pointer-events-none"
              />
              <div>
                <p className="font-medium">[CoDed]</p>
                <p className="text-sm text-gray-600">
                  Passionate about creating technology that enhances spiritual
                  growth and makes the Bible more accessible. With a background
                  in software development and a love for scripture, I built
                  VerseCatch to help people engage with God's Word in a more
                  natural, intuitive way.
                </p>
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

export default AboutModal;
