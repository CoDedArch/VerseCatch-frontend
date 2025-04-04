import getThemeStyles from "../components/GetThemeHook";
import { ThemeStyles, Theme } from "../constants/interfaceConstants";

export const parseThemeStyles = (styles: string | ThemeStyles): ThemeStyles => {
  if (typeof styles === "string") {
    try {
      return JSON.parse(styles) as ThemeStyles;
    } catch {
      return getThemeStyles("default");
    }
  }
  return styles;
};

export const getDefaultTheme = (): Theme => ({
  id: "default",
  name: "default",
  display_name: "Default",
  price: 0,
  preview_image_url: "",
  is_default: true,
  is_current: true,
  unlocked: true,
  styles: getThemeStyles("default"),
});

export const getCurrentTheme = async (
  accessToken: string | null
): Promise<Theme> => {
  try {
    // First try to get from localStorage
    const savedTheme = localStorage.getItem("currentTheme");
    if (savedTheme) {
      const parsed = JSON.parse(savedTheme);
      return {
        ...parsed,
        styles: parseThemeStyles(parsed.styles),
      };
    }

    // If logged in, fetch from server
    if (accessToken) {
      const response = await fetch("http://127.0.0.1:8000/api/themes/current", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const theme = await response.json();
        const parsedTheme = {
          ...theme,
          styles: parseThemeStyles(theme.styles),
        };
        localStorage.setItem("currentTheme", JSON.stringify(parsedTheme));
        return parsedTheme;
      }
    }

    // Fallback to default
    return getDefaultTheme();
  } catch (error) {
    console.error("Error getting current theme:", error);
    return getDefaultTheme();
  }
};

export const applyTheme = (
  theme: Theme | null,
  onThemeChange: (styles: ThemeStyles, theme: Theme | null) => void
) => {
  const themeToApply = theme || getDefaultTheme();
  const styles = parseThemeStyles(themeToApply.styles);
  onThemeChange(styles, themeToApply);
  localStorage.setItem("currentTheme", JSON.stringify(themeToApply));
};
