import { useEffect, useState } from "react";
import getThemeStyles from "../Hooks/GetThemeHook";
import { parseThemeStyles } from "../../Services/ThemeServices";
import {
  SET_THEME_URL,
  THEMES_URL,
  UNLOCK_THEME_URL,
} from "../../constants/urlConstants";
import {
  Theme,
} from "../../constants/interfaceConstants";
import { ModalProps } from "../../constants/interfaceConstants";

const SettingsModal = ({ isOpen, onClose }: ModalProps) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showThemePreview, setShowThemePreview] = useState(false);

  // Modify your fetchThemes function to handle initial theme application
  const fetchThemes = async () => {
    try {
      const response = await fetch(THEMES_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const data: Theme[] = await response.json();

      const parsedThemes = data.map((theme: Theme) => ({
        ...theme,
        styles:
          typeof theme.styles === "string"
            ? JSON.parse(theme.styles)
            : theme.styles,
      }));

      // Ensure default theme is always included and properly marked
      if (!parsedThemes.some((t) => t.is_default)) {
        parsedThemes.push({
          id: "default",
          name: "default",
          display_name: "Default",
          price: 0,
          preview_image_url: "",
          is_default: true,
          is_current: parsedThemes.some((t) => t.is_current) ? false : true,
          unlocked: true,
          styles: getThemeStyles("default"),
        });
      }

      setThemes(parsedThemes);

      // Find and set the current theme
      const currentTheme = parsedThemes.find((t) => t.is_current) ||
        parsedThemes.find((t) => t.is_default) || {
          id: "default",
          name: "default",
          display_name: "Default",
          price: 0,
          preview_image_url: "",
          is_default: true,
          is_current: true,
          unlocked: true,
          styles: getThemeStyles("default"),
        };

      setSelectedTheme(currentTheme);

      // Store theme in localStorage for persistence
      localStorage.setItem("currentTheme", JSON.stringify(currentTheme));
    } catch (error) {
      console.error("Error fetching themes:", error);
      // Fallback to default theme
      const defaultTheme = {
        id: "default",
        name: "default",
        display_name: "Default",
        price: 0,
        preview_image_url: "",
        is_default: true,
        is_current: true,
        unlocked: true,
        styles: getThemeStyles("default"),
      };
      setSelectedTheme(defaultTheme);
    }
  };

  const handleUnlockTheme = async (themeId: string, viaAd: boolean) => {
    setIsProcessing(true);
    try {
      const response = await fetch(UNLOCK_THEME_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          theme_id: themeId,
          via_ad: viaAd,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to unlock theme");
      }

      // Refresh themes list
      await fetchThemes();
      // Refresh user data to update faith coins
      // You'll need to implement this based on your user data hook
    } catch (error) {
      console.error("Error unlocking theme:", error);
      alert((error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem("currentTheme");
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setSelectedTheme(parsedTheme);
      } catch (error) {
        console.error("Error parsing saved theme:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchThemes();
  });

  // Add this useEffect to fetch themes when user logs in
  useEffect(() => {
    fetchThemes();
  });

  const handleSetTheme = async (themeId: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(SET_THEME_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          theme_id: themeId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to set theme");
      }

      // Refresh themes list to get updated current theme status
      await fetchThemes();

      // Handle default theme case
      if (themeId === "default") {
        const defaultTheme = {
          id: "default",
          name: "default",
          display_name: "Default",
          price: 0,
          preview_image_url: "",
          is_default: true,
          is_current: true,
          unlocked: true,
          styles: getThemeStyles("default"),
        };
        setSelectedTheme(defaultTheme);
        localStorage.setItem("currentTheme", JSON.stringify(defaultTheme));
      } else {
        // For non-default themes, use the selected theme's styles
        const themeToApply =
          themes.find((t) => t.id === themeId) || selectedTheme;
        if (themeToApply) {
          //
          localStorage.setItem("currentTheme", JSON.stringify(themeToApply));
        }
      }

      setShowThemePreview(false);
    } catch (error) {
      console.error("Error setting theme:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Unknown Error");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (showAdModal && selectedTheme) {
      // Add null check here
      const timer = setTimeout(() => {
        handleUnlockTheme(selectedTheme.id, true);
        setShowAdModal(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showAdModal, selectedTheme]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100000]">
        <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Theme Settings</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 hover:cursor-pointer">
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {themes.map((theme) => {
              // Handle both string and object styles safely
              const themeStyles = parseThemeStyles(theme.styles);

              console.log("Theme styles:", themeStyles);

              return (
                <div
                  key={theme.id}
                  className={`border rounded-lg p-3 flex flex-col items-center justify-between cursor-pointer transition-all ${
                    theme.is_current ? "ring-2 ring-blue-500" : ""
                  } ${theme.unlocked ? "hover:shadow-md" : "opacity-70"}`}
                  onClick={() => {
                    if (theme.unlocked) {
                      setSelectedTheme({
                        ...theme,
                        styles: themeStyles,
                      });
                      setShowThemePreview(true);
                    }
                  }}
                >
                  {/* Theme thumbnail with actual style preview */}
                  <div
                    className="w-full h-24 mb-2 rounded-md relative overflow-hidden"
                    style={
                      themeStyles.taskBackground || {
                        backgroundColor: "#f3f4f6",
                      }
                    }
                  >
                    <div className="absolute inset-0 flex flex-col p-2">
                      <div
                        className="h-2 w-3/4 rounded-full mb-1"
                        style={{
                          backgroundColor:
                            themeStyles.taskBackground.contentBackground ||
                            "#ffffff",
                        }}
                      ></div>
                      <div
                        className="h-2 w-1/2 rounded-full"
                        style={{
                          backgroundColor:
                            themeStyles.taskBackground.contentBackground ||
                            "#ffffff",
                        }}
                      ></div>
                    </div>
                    {!theme.unlocked && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-white font-bold text-center">
                          <div className="flex items-center justify-center gap-1">
                            <img src="/assets/coin.png" className="w-5 h-5" />
                            {theme.price}
                          </div>
                          <div className="text-xs">or watch ad</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <h3 className="font-medium text-center">
                    {theme.display_name}
                  </h3>

                  {theme.unlocked && theme.is_current && (
                    <div className="text-xs text-green-500">Active</div>
                  )}

                  {!theme.unlocked && (
                    <div className="flex gap-2 mt-2">
                      <button
                        className="text-xs bg-green-400 text-white px-2 py-1 rounded-xl font-extrabold hover:cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnlockTheme(theme.id, false);
                        }}
                      >
                        Unlock
                      </button>
                      <button
                        style={{
                          backgroundImage: "url('/assets/fr.jpg')",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundBlendMode: "overlay",
                          background:
                            "linear-gradient(13deg, rgba(20, 130, 260, 1), rgba(36, 10, 545, 0.2))",
                        }}
                        className="text-xs bg-purple-500 text-white px-2 py-1 rounded-2xl hover:cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTheme({
                            ...theme,
                            styles: themeStyles,
                          });
                          setShowAdModal(true);
                        }}
                      >
                        Watch Ad
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {showThemePreview && selectedTheme && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100000]">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Preview: {selectedTheme.display_name}
              </h2>
              <button
                onClick={() => setShowThemePreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              {/* Mini App Preview */}
              <div
                style={parseThemeStyles(selectedTheme.styles).mainBackground}
                className={`border rounded-lg overflow-hidden pt-4 ${
                  parseThemeStyles(selectedTheme.styles).mainBackground
                    .background
                }`}
              >
                {/* Preview Header */}
                <div
                  className={`p-4 flex justify-between items-center ${
                    selectedTheme.display_name === "Twilight" ||
                    selectedTheme.display_name === "Dark Night"
                      ? "bg-slate-100"
                      : ""
                  }`}
                >
                  <div className="flex items-center">
                    <img
                      src={`/assets/version.png
                      }`}
                      alt="Bible Version"
                      className="w-8 h-8"
                    />
                    <span className="bg-slate-400/10 p-3 text-sm">
                      {"Bible version"} //provide a selected version
                    </span>
                  </div>
                  <div className="flex items-center">
                    <img src="/assets/book.png" alt="Bible" className="w-8" />
                    <span className="ml-2 font-bold">VerseCatch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p
                      style={{
                        backgroundImage: "url('/assets/fr.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundBlendMode: "overlay",
                        background:
                          "linear-gradient(135deg, rgba(20, 30, 48, 1), rgba(36, 59, 85, 0.2))",
                      }}
                      className="self-center p-1 rounded-2xl relative shadow-black shadow-2xl"
                    >
                      <span className="bg-white text-black p-2 rounded-2xl text-sm relative -top-3 shadow-black shadow-2xl">
                        "Newbie"
                      </span>
                    </p>
                    <div className="flex">
                      <img src="/assets/coin.png" alt="Coins" className="w-6" />
                      <span className="bg-white/20 px-2 py-1 rounded text-sm">
                        10
                      </span>
                    </div>
                    <div className="flex">
                      <img src="/assets/fire.png" alt="Coins" className="w-6" />
                      <span className="bg-white/20 px-2 py-1 rounded text-sm">
                        2
                      </span>
                    </div>
                    <button
                      className="profile-button absolute sm:static bg-slate-400/30 rounded-2xl sm:mr-2 right-2 sm:left-10 top-[21em] sm:top-8 font-bold text-lg sm:flex items-center hidden hover:cursor-pointer transition-all"
                      // onClick={() => setShowProfileMenu(!showProfileMenu)}
                    >
                      <img
                        src="/assets/profile.png"
                        alt="Bible Version"
                        className="w-8 sm:w-14 p-1 sm:p-3 bg-white/30 rounded-full ml-1 sm:-ml-2"
                      />
                      <span className="p-3 font-bold">
                        John Doe
                      </span>
                    </button>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="flex gap-5 p-4">
                  {/* Left Panel - Task Div Preview */}
                  <div
                    style={
                      parseThemeStyles(selectedTheme.styles).taskBackground
                    }
                    className={`rounded-lg p-3 h-48 w-48 overflow-y-auto text-sm`}
                  >
                    <h3 className="font-bold mb-2 text-center">Daily Tasks</h3>
                    <ul className="space-y-2">
                      <li className="bg-white/30 p-1 rounded">Login Daily</li>
                      <li className="bg-white/30 p-1 rounded">Catch 1 verse</li>
                    </ul>
                  </div>

                  {/* Middle Panel - Verse Preview */}
                  <div
                    style={
                      parseThemeStyles(selectedTheme.styles).verseBackground ||
                      {}
                    }
                    className={`rounded-lg p-4 h-48 flex flex-col justify-center items-center text-center bg-green-200 w-1/2  ${
                      parseThemeStyles(selectedTheme.styles).verseBackground
                        .color
                    }`}
                  >
                    <h3 className="font-bold mb-1">John 3:16</h3>
                    <p className="text-sm">For God so loved the world...</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  {/* bottom Panel - Interaction Preview */}
                  <div
                    style={
                      parseThemeStyles(selectedTheme.styles)
                        .interactionBackground
                    }
                    className={`rounded-lg p-4 h-48 w-1/2 flex flex-col items-center justify-center`}
                  >
                    <div
                      style={{
                        backgroundColor: parseThemeStyles(selectedTheme.styles)
                          .interactionBackground.buttonColor,
                      }}
                      className="w-10 h-10 rounded-full bg-blue-500 mb-2"
                    ></div>
                    <button
                      style={{
                        backgroundColor: parseThemeStyles(selectedTheme.styles)
                          .interactionBackground.buttonColor,
                      }}
                      className={`text-white px-3 py-1 rounded-xl text-sm`}
                    >
                      Start Listening
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowThemePreview(false)}
                className="px-4 py-2 bg-gray-300 rounded-2xl hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                style={{
                  backgroundImage: "url('/assets/fr.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundBlendMode: "overlay",
                  background:
                    "linear-gradient(13deg, rgba(20, 50, 20, 1), rgba(36, 20, 15, 0.2))",
                }}
                onClick={() => handleSetTheme(selectedTheme?.id || "default")}
                className="px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 hover:cursor-pointer"
                disabled={isProcessing}
              >
                {isProcessing ? "Applying..." : "Apply Theme"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showAdModal && selectedTheme && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000000]">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Unlock with Ad</h2>
              <button
                onClick={() => setShowAdModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <p className="mb-4">
                Watching ad to unlock the{" "}
                <strong>{selectedTheme.display_name}</strong> theme...
              </p>

              {/* Ad player placeholder - in a real app, this would be your ad SDK */}
              <div className="bg-gray-200 h-48 flex items-center justify-center rounded relative">
                {/* Simulated ad player */}
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <p className="text-white">Ad playing (5 seconds)...</p>
                </div>

                {/* Simulated progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
                  <div
                    className="h-full bg-blue-500 ad-progress"
                    style={{ animation: "progress 5s linear forwards" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsModal;
