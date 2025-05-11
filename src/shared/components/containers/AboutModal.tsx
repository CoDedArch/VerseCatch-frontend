import { ModalProps } from "@/shared/constants/interfaceConstants";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import BlurImage from "./ImageBlur";

const AboutModal = ({ isOpen, onClose }: ModalProps) => {
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
        className={`${theme.styles.mainBackground?.background} bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
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
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="text-lg font-semibold mb-3 text-purple-800">
              ✨ Premium Inspiration System
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Dynamic Quote Refresh</h4>
                  <p className="text-sm text-gray-700">
                    Every user receives fresh inspirational quotes:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="font-medium">Regular Users:</span>
                      <span>New quote every 30 minutes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-medium">
                        Daily Devotees (7+ day streak):
                      </span>
                      <span className="text-blue-600 font-medium">
                        Every 15 minutes
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-medium">Supporters:</span>
                      <span className="text-purple-600 font-medium">
                        Every 5 minutes
                      </span>
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                        EXCLUSIVE
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold mb-3 text-blue-800">
              🎁 Supporter Perks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="ml-1">✨</span>

                  <h4 className="font-medium">Exclusive tag Badge</h4>
                </div>
                <p className="text-sm text-gray-700">
                  Display your tags with a special animated badge that appears
                  everywhere in the app.
                </p>
                <div
                  className={`self-center p-1 w-fit mt-5 rounded-2xl relative transition-all duration-300 border border-purple-300`}
                >
                  <span
                    className={`p-2 rounded-2xl text-sm relative -top-3 shadow-lg transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold`}
                  >
                    Newbie
                    <span className="ml-1">✨</span>
                  </span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <BlurImage
                    src="/assets/thunder.png"
                    alt="thunder"
                    className="w-10"
                  />
                  <h4 className="font-medium">Priority Inspiration</h4>
                </div>
                <p className="text-sm text-gray-700">
                  Get fresh scripture insights 6x faster than regular users with
                  our 5-minute refresh rate.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h3 className="text-lg font-semibold mb-3 text-yellow-800">
              🔥 Streak Rewards
            </h3>
            <div className="flex items-start gap-3">
              <div className="bg-white p-2 rounded-full">
                <BlurImage
                    src="/assets/fire.png"
                    alt="fire"
                    className="w-10"
                  />
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  Maintain your daily login streak to unlock special benefits:
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="font-bold text-blue-800">7</span>
                    </div>
                    <p className="text-xs mt-1">Days for Devotee Status</p>
                  </div>
                  <BlurImage
                    src="/assets/slide.png"
                    alt="arrow right"
                    className="w-10"
                  />
                  <div className="text-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-xs mt-1">15-min Quotes</p>
                  </div>
                </div>
              </div>
            </div>
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
