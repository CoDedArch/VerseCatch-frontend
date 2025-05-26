import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "@/store/themeSlice";
import { RootState } from "@/store/store";
import { useRef } from "react";
import { parseThemeStyles } from "../../Services/ThemeServices";
import { SettingsModalProps, Theme } from "../../constants/interfaceConstants";
import { defaultTheme } from "@/shared/constants/varConstants";
import { PropellerAd } from "../../constants/interfaceConstants";
import { useCallback } from "react";
import { useMemo } from "react";

import {
  SET_THEME_URL,
  THEMES_URL,
  UNLOCK_THEME_URL,
} from "../../constants/urlConstants";

declare global {
  interface Window {
    propeller?: PropellerAd;
    __ad_zone_9338850_loaded__?: boolean;
  }
}

const SettingsModal = ({ isOpen, onClose, setSettingsKey }: SettingsModalProps) => {
  const refreshSettings = () => setSettingsKey((prev) => prev + 1);
  const dispatch = useDispatch();
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );
  const { token } = useSelector((state: RootState) => state.user);

  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showThemePreview, setShowThemePreview] = useState(false);
  const [isLoadingThemes, setIsLoadingThemes] = useState(false);
  const [isLoadingAd, setIsLoadingAd] = useState(false);

  const hasFetchedRef = useRef(false);
  const parsedThemes = useMemo(() => {
    return themes.map((theme) => ({
      ...theme,
      styles: parseThemeStyles(theme.styles),
    }));
  }, [themes]);

  const fetchThemes = useCallback(async () => {
    if (hasFetchedRef.current) return;

    setIsLoadingThemes(true);
    try {
      const response = await fetch(THEMES_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: Theme[] = await response.json();

      const newThemes = data.map((theme: Theme) => ({
        ...theme,
        styles:
          typeof theme.styles === "string"
            ? JSON.parse(theme.styles)
            : theme.styles,
      }));

      if (!newThemes.some((t) => t.is_default)) {
        newThemes.push(defaultTheme);
      }

      setThemes(newThemes);
      hasFetchedRef.current = true;
    } catch (error) {
      console.error("Error fetching themes:", error);
      setThemes([defaultTheme]);
      hasFetchedRef.current = true;
    } finally {
      setIsLoadingThemes(false);
    }
  }, [token]);

  const handleUnlockTheme = async (themeId: string, viaAd: boolean) => {
    setIsProcessing(true);
    try {
      const response = await fetch(UNLOCK_THEME_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

      await fetchThemes();
    } catch (error) {
      console.error("Error unlocking theme:", error);
      alert((error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (isOpen && !hasFetchedRef.current) {
      fetchThemes();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      hasFetchedRef.current = false;
    };
  }, []);

  const renderThemeItems = useMemo(() => {
    if (isLoadingThemes) {
      return Array.from({ length: 5 }).map((_, index) => (
        <div
          key={`loading-${index}`}
          className="border bg-white rounded-lg p-3 flex flex-col items-center justify-between h-40"
        >
          <div className="w-full h-24 mb-2 rounded-md bg-gray-200 animate-pulse"></div>
          <div className="h-4 w-3/4 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-4 w-1/2 rounded-full bg-gray-200 animate-pulse mt-2"></div>
        </div>
      ));
    }

    return parsedThemes.map((theme) => {
      const themeStyles = theme.styles;

      return (
        <div
          key={theme.id}
          className={`border bg-white rounded-lg p-3 flex flex-col items-center justify-between cursor-pointer transition-all ${
            theme.is_current ? "ring-2 ring-blue-500" : ""
          } ${theme.unlocked ? "hover:shadow-md" : "opacity-70"}`}
          onClick={() => {
            if (theme.unlocked) {
              setSelectedTheme(theme);
              setShowThemePreview(true);
            }
          }}
        >
          <div
            className="w-full h-24 mb-2 rounded-md relative overflow-hidden"
            style={themeStyles.taskBackground || { backgroundColor: "#f3f4f6" }}
          >
            <div className="absolute inset-0 flex flex-col p-2">
              <div
                className="h-2 w-3/4 rounded-full mb-1"
                style={{
                  backgroundColor:
                    themeStyles.taskBackground?.contentBackground || "#ffffff",
                }}
              ></div>
              <div
                className="h-2 w-1/2 rounded-full"
                style={{
                  backgroundColor:
                    themeStyles.taskBackground?.contentBackground || "#ffffff",
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
                      alt="Coins"
                    />
                    {theme.price}
                  </div>
                  <div className="text-xs">or watch ad</div>
                </div>
              </div>
            )}
          </div>

          <h3 className="font-medium text-center">{theme.display_name}</h3>

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
                  setSelectedTheme(theme);
                  setShowAdModal(true);
                }}
              >
                Watch Ad
              </button>
            </div>
          )}
        </div>
      );
    });
  }, [isLoadingThemes, parsedThemes]);

  const handleWatchAd = async () => {
    setIsLoadingAd(true);

    try {
      const adWindow = window.open("https://otieu.com/4/9343761", "_blank");

      if (!adWindow) {
        throw new Error("Popup blocked. Please allow popups for this site.");
      }

      setShowAdModal(false); 
      setIsProcessing(true);

      // Wait a moment before unlocking to ensure ad started
      setTimeout(async () => {
        try {
          if (selectedTheme) {
            await handleUnlockTheme(selectedTheme.id, true);
            refreshSettings();
          }
        } catch (error) {
          console.error("Unlock error:", error);
          alert("Failed to unlock theme. Please try again.");
        } finally {
          setIsProcessing(false);
        }
      }, 3000);
    } catch (err) {
      console.error("Ad error:", err);
      alert(err instanceof Error ? err.message : "Failed to open ad");
      setShowAdModal(false);
    } finally {
      setIsLoadingAd(false);
    }
  };
  
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
            {renderThemeItems}
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
              <div
                style={parseThemeStyles(selectedTheme.styles).mainBackground}
                className={`border rounded-lg overflow-hidden pt-4 ${
                  parseThemeStyles(selectedTheme.styles).mainBackground
                    .background
                }`}
              >
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

                <div className="flex gap-5 p-4">
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
      {showAdModal && selectedTheme && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000000]">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-2xl font-bold">Unlock with Ad</h2>
              <button
                onClick={() => setShowAdModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <p className="mb-4 text-sm  sm:text-md text-center">
                Click the button below to watch an ad and unlock the{" "}
                <strong className="text-blue-600">
                  {selectedTheme.display_name}
                </strong>{" "}
                theme.
              </p>

              <div className="bg-gray-100 h-48 flex items-center justify-center rounded-lg">
                {isLoadingAd ? (
                  <div className="text-center p-4">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                    <p className="mt-2 text-sm text-gray-600">
                      Preparing ad...
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p className="font-medium mb-2">Sponsored Content</p>
                    <p className="text-sm text-gray-600">
                      You'll be redirected to watch a sponsored content
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAdModal(false)}
                className="px-4 py-2 bg-gray-300 text-sm rounded-md hover:bg-gray-400"
                disabled={isLoadingAd}
              >
                Cancel
              </button>
              <button
                onClick={handleWatchAd}
                disabled={isLoadingAd}
                className="px-4 py-2 bg-blue-500 text-sm text-white rounded hover:bg-blue-600"
              >
                {isLoadingAd ? "Redirecting..." : "Watch Ad to Unlock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsModal;
