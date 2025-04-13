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
    // "dark-night": {
    //   mainBackground: "bg-gray-900",
    //   taskBackground: {
    //     background: "linear-gradient(135deg, #1a1a2e, #16213e)",
    //   },
    //   verseBackground: {
    //     background: "linear-gradient(135deg, #1a1a2e, #16213e)",
    //   },
    //   interactionBackground: "bg-gray-800",
    // },
    // sunrise: {
    //   mainBackground: "bg-gradient-to-b from-orange-100 to-yellow-50",
    //   taskBackground: {
    //     background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
    //   },
    //   verseBackground: {
    //     background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
    //   },
    //   interactionBackground: "bg-white",
    // },
    // Add more themes as needed
  };

  return themes[themeName] || themes["default"];
};

export default getThemeStyles;
