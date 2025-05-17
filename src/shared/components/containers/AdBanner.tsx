import { useEffect } from "react";

const AdBanner = () => {
  useEffect(() => {
    const zoneId = "9339190";
    const scriptDomain = "vemtoutcheeg.com";
    const scriptPath = `/400/${zoneId}`;

    const script = document.createElement("script");
    script.async = true;

    // Anti-AdBlock logic mimicking PropellerAds' official format
    try {
      script.src = `https://${scriptDomain}${scriptPath}`;
      script.setAttribute("data-zone", zoneId);
      (document.body || document.documentElement).appendChild(script);
    } catch (e) {
      console.warn("Failed to inject ad script:", e);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default AdBanner;
