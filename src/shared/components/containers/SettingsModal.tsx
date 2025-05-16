import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "@/store/themeSlice";
import { RootState } from "@/store/store";
import getThemeStyles from "../Hooks/GetThemeHook";
import { parseThemeStyles } from "../../Services/ThemeServices";
import { Theme } from "../../constants/interfaceConstants";
import { ModalProps } from "../../constants/interfaceConstants";
import { defaultTheme } from "@/shared/constants/varConstants";
import {
  SET_THEME_URL,
  THEMES_URL,
  UNLOCK_THEME_URL,
} from "../../constants/urlConstants";

const SettingsModal = ({ isOpen, onClose }: ModalProps) => {
  const dispatch = useDispatch();
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );

  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  // const [showAdModal, setShowAdModal] = useState(false);
  const [showThemePreview, setShowThemePreview] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  // const [adLoaded, setAdLoaded] = useState(false);
  // const [progress, setProgress] = useState(0);
  const [isLoadingThemes, setIsLoadingThemes] = useState(false);
  // Modify your fetchThemes function to handle initial theme application
  const fetchThemes = async () => {
    setIsLoadingThemes(true);
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
      setHasFetched(true);
    } catch (error) {
      console.error("Error fetching themes:", error);
      setSelectedTheme(defaultTheme);
      setHasFetched(true);
    } finally {
      setIsLoadingThemes(false);
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
    } catch (error) {
      console.error("Error unlocking theme:", error);
      alert((error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Fetch themes only when modal opens and hasn't been fetched yet
  useEffect(() => {
    if (isOpen && !hasFetched) {
      fetchThemes();
    }
  }, [isOpen, hasFetched]);

  // Reset hasFetched when modal closes
  useEffect(() => {
    if (!isOpen) {
      setHasFetched(false);
    }
  }, [isOpen]);

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

      await fetchThemes();

      // Handle default theme case
      if (themeId === "default") {
        dispatch(setTheme(defaultTheme));
      } else {
        const themeToApply =
          themes.find((t) => t.id === themeId) || selectedTheme;
        if (themeToApply) {
          dispatch(setTheme(themeToApply));
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

  // simulate add
  // useEffect(() => {
  //   if (showAdModal && selectedTheme) {
  //     setAdLoaded(false);
  //     setProgress(0);
  //     setIsProcessing(false); // Reset processing state

  //     // Simulate ad loading
  //     const loadTimer = setTimeout(() => {
  //       setAdLoaded(true);

  //       // Start progress tracking
  //       const duration = 5000;
  //       const startTime = Date.now();
  //       let animationFrameId: number;

  //       const updateProgress = () => {
  //         const elapsed = Date.now() - startTime;
  //         const newProgress = Math.min((elapsed / duration) * 100, 100);
  //         setProgress(newProgress);

  //         if (newProgress < 100) {
  //           animationFrameId = requestAnimationFrame(updateProgress);
  //         } else {
  //           // Enable unlock button when ad completes
  //           setIsProcessing(false);
  //         }
  //       };

  //       animationFrameId = requestAnimationFrame(updateProgress);

  //       return () => {
  //         cancelAnimationFrame(animationFrameId);
  //       };
  //     }, 1000);

  //     return () => {
  //       clearTimeout(loadTimer);
  //     };
  //   }
  // }, [showAdModal, selectedTheme]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100000] no-highlight">
        <div
          style={{
            background:
              currentTheme.display_name === "Dark Night" ||
              currentTheme.display_name === "Twilight"
                ? "white"
                : currentTheme.styles.mainBackground?.background,
          }}
          className={`${currentTheme.styles.mainBackground?.background} p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Theme Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {isLoadingThemes
              ?
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={`loading-${index}`}
                    className="border bg-white rounded-lg p-3 flex flex-col items-center justify-between h-40"
                  >
                    <div className="w-full h-24 mb-2 rounded-md bg-gray-200 animate-pulse"></div>
                    <div className="h-4 w-3/4 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="h-4 w-1/2 rounded-full bg-gray-200 animate-pulse mt-2"></div>
                  </div>
                ))
              : themes.map((theme) => {
                  // Handle both string and object styles safely
                  const themeStyles = parseThemeStyles(theme.styles);

                  console.log("Theme styles:", themeStyles);

                  return (
                    <div
                      key={theme.id}
                      className={`border bg-white rounded-lg p-3 flex flex-col items-center justify-between cursor-pointer transition-all ${
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
                                <img
                                  src="/assets/coin.png"
                                  className="w-5 h-5 pointer-events-none"
                                />
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
                            className="text-xs bg-green-400/40 text-black px-2 py-1 rounded-xl font-extrabold hover:cursor-pointer"
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
                                "linear-gradient(13deg, rgba(40, 130, 70, 30), rgba(36, 40, 545, 0.2))",
                            }}
                            className="text-xs bg-purple-500 text-black px-2 py-1 rounded-2xl hover:cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTheme({
                                ...theme,
                                styles: themeStyles,
                              });
                              // setShowAdModal(true);
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
                      src="/assets/version.png"
                      alt="Bible Version"
                      className="w-8 h-8"
                    />
                    <span className="bg-slate-400/10 p-3 text-sm">
                      KJ_version
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
                        Newbie
                      </span>
                    </p>
                    <div className="flex">
                      <img src="/assets/coin.png" alt="Coins" className="w-6" />
                      <span className="px-2 py-1 rounded text-sm">10</span>
                    </div>
                    <div className="flex">
                      <img src="/assets/fire.png" alt="Coins" className="w-6" />
                      <span className="px-2 py-1 rounded text-sm">2</span>
                    </div>
                    <button className="profile-button absolute sm:static bg-slate-400/30 rounded-2xl sm:mr-2 right-2 sm:left-10 top-[21em] sm:top-8 font-bold text-lg sm:flex items-center hidden hover:cursor-pointer transition-all">
                      <img
                        src="/assets/profile.png"
                        alt="Bible Version"
                        className="w-8 sm:w-14 p-1 sm:p-3 bg-white/30 rounded-full ml-1 sm:-ml-2"
                      />
                      <span className="p-3 font-bold">J D</span>
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
                    className={`rounded-lg p-4 h-48 ml-5 w-[410px] flex flex-col items-center justify-center`}
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
      {/* {showAdModal && selectedTheme && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000000]">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Unlock with Ad</h2>
              <button
                onClick={() => progress >= 100 && setShowAdModal(false)}
                className={`text-gray-500 hover:text-gray-700 ${
                  progress < 100 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={progress < 100}
                aria-label="Close ad modal"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <p className="mb-4 text-center">
                {adLoaded ? (
                  progress < 100 ? (
                    <>
                      Watching ad to unlock{" "}
                      <strong className="text-blue-600">
                        {selectedTheme.display_name}
                      </strong>{" "}
                      theme...
                    </>
                  ) : (
                    <>
                      <span className="text-green-600 font-semibold">
                        Ad complete!
                      </span>{" "}
                      You've unlocked{" "}
                      <strong className="text-blue-600">
                        {selectedTheme.display_name}
                      </strong>
                    </>
                  )
                ) : (
                  <span className="text-gray-600">Loading ad content...</span>
                )}
              </p>

              <div className="bg-gray-200 h-48 flex items-center justify-center rounded-lg relative overflow-hidden border border-gray-300">
                {adLoaded ? (
                  <>
                    <div className="w-full h-full bg-black flex flex-col items-center justify-center p-4">
                      <p className="text-white/80 text-sm mb-2">
                        ADVERTISEMENT
                      </p>
                      <div className="w-full h-4/5 bg-gradient-to-br from-blue-900/80 to-purple-900/80 border-2 border-blue-400/50 rounded-lg flex items-center justify-center">
                        <div className="text-center p-4">
                          <p className="text-white/90 font-medium mb-2">
                            {selectedTheme.display_name} Theme
                          </p>
                          <p className="text-white/70 text-sm">
                            {progress < 100
                              ? "Demo ad playing..."
                              : "Ad completed successfully"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-300">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    {progress < 100 && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {Math.ceil(5 - progress * 0.05)}s remaining
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
                    <p className="text-gray-600 text-sm">Preparing ad...</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                {progress < 100 ? (
                  <span>Please watch the full ad to unlock</span>
                ) : (
                  <span className="text-green-600 font-medium">
                    ✓ Ready to claim your theme
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  if (progress >= 100) {
                    handleUnlockTheme(selectedTheme.id, true);
                    setShowAdModal(false);
                  }
                }}
                disabled={progress < 100 || isProcessing}
                className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                  progress >= 100
                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } ${isProcessing ? "opacity-70" : ""}`}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : progress < 100 ? (
                  `Complete ad to unlock (${(5 - progress * 0.05).toFixed(1)}s)`
                ) : (
                  "Claim Unlocked Theme"
                )}
              </button>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default SettingsModal;
