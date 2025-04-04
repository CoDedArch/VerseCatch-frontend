const getThemeStyles = (themeName: string) => {
  const themes: Record<string, any> = {
    default: {
      mainBackground: "animated-gradient",
      taskBackground: {
        backgroundImage: "url('/assets/fr.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
        background:
          "linear-gradient(135deg, rgba(20, 30, 48, 1), rgba(36, 59, 85, 0.2))",
      },
      verseBackground: {
        backgroundImage: "url('/assets/fr.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
        background:
          "linear-gradient(135deg, rgba(20, 30, 48, 1), rgba(36, 59, 85, 0.2))",
      },
      interactionBackground: "bg-white",
    },
    "dark-night": {
      mainBackground: "bg-gray-900",
      taskBackground: {
        background: "linear-gradient(135deg, #1a1a2e, #16213e)",
      },
      verseBackground: {
        background: "linear-gradient(135deg, #1a1a2e, #16213e)",
      },
      interactionBackground: "bg-gray-800",
    },
    sunrise: {
      mainBackground: "bg-gradient-to-b from-orange-100 to-yellow-50",
      taskBackground: {
        background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
      },
      verseBackground: {
        background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
      },
      interactionBackground: "bg-white",
    },
    // Add more themes as needed
  };

  return themes[themeName] || themes["default"];
};

export default getThemeStyles;
