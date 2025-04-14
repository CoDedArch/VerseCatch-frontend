import { ThemeStyles } from "@/shared/constants/interfaceConstants";


const getThemeStyles = (themeName: string): ThemeStyles => {
  const themes: Record<string, ThemeStyles> = {
    default: {
      mainBackground: {
        background: "animated-gradient",
    },
    taskBackground: {
        background: "linear-gradient(135deg, rgba(20, 30, 48, 1), rgba(36, 59, 85, 0.2))",
        color: "#ffffff",
        contentBackground: "rgba(255, 255, 255, 0.1)"
    },
    verseBackground: {
        background: "linear-gradient(135deg, rgba(20, 30, 48, 1), rgba(36, 59, 85, 0.2))",
        color: "#ffffff",
        verseHighlight: "#fef08a"
    },
    interactionBackground: {
        background: "#ffffff", 
        color: "#1f2937",  
        buttonColor: "#000000"
    }
    },
  };

  return themes[themeName] || themes["default"];
};

export default getThemeStyles;
