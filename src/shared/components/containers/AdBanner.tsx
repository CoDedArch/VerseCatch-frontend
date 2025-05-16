import { useEffect } from "react";

const AdBanner = () => {
  useEffect(() => {
    // Just load the script without initializing ads
    const script = document.createElement("script");
    script.src = "https://vemtoutcheeg.com/400/9339190";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default AdBanner;