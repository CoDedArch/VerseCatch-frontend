import React, { useState, useEffect, useRef } from "react";
import useSpeechRecognitionHook from "./UseSpeechRecognitionHook";

interface InteractionSectionProps {
  setReceivedData: (data: string) => void;
}

const book_versions = [
  "AKJV_bible",
  "ASV_bible",
  "BRG_bible",
  "EHV_bible",
  "ESV_bible",
  "ESVUK_bible",
  "GNV_bible",
  "GW_bible",
  "ISV_bible",
  "JUB_bible",
  "KJ21_bible",
  "KJV_bible",
  "LEB_bible",
  "MEV_bible",
  "NASB_bible",
  "NASB1995_bible",
  "NET_bible",
  "NIV_bible",
  "NIVUK_bible",
  "NKJV_bible",
  "NLT_bible",
  "NLV_bible",
  "NOG_bible",
  "NRSV_bible",
  "NRSVUE_bible",
  "WEB_bible",
  "YLT_bible",
];

const InteractionSection: React.FC<InteractionSectionProps> = ({ setReceivedData }) => {
  const [listening, setListening] = useState(false);
  const [icon, setIcon] = useState("/assets/play.png");
  const [buttonText, setButtonText] = useState("Start Listening");
  const [buttonColor, setButtonColor] = useState("btn-black");
  const [buttonIcon, setButtonIcon] = useState("/assets/mic.png");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(book_versions[0]);
  const dropdownRef = useRef<HTMLUListElement | null>(null);

  // use speech recognition
  const {
    isListening,
    receivedData,
    startListening,
    stopListening,
    hasRecognitionSupport,
  } = useSpeechRecognitionHook();

  const handleButtonClick = () => {
    if (!listening) {
      setListening(true);
      setIcon("/assets/vector.png");
      setButtonText("Stop Listening");
      setButtonColor("btn-red");
      setButtonIcon("/assets/mic-off.png");
      startListening();
    } else {
      setListening(false);
      setIcon("/assets/pause.png");
      setButtonText("Continue Listening");
      setButtonColor("btn-black");
      setButtonIcon("/assets/mic.png");
      stopListening();
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleVersionChange = (version: string) => {
    setSelectedVersion(version);
    setDropdownVisible(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    if (receivedData) {
      setReceivedData(receivedData);
    }
  }, [receivedData, setReceivedData]);

  useEffect(() => {
    if (dropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownVisible]);

  return (
    <>
      {hasRecognitionSupport ? (
        <section className="bg-white px-20 py-6 xl:w-1/2 relative w-full rounded-xl">
          <img
            title="Bible Versions"
            src="/assets/dots.png"
            alt="three dots"
            className="absolute right-0 w-9 cursor-pointer"
            onClick={toggleDropdown}
          />
          {dropdownVisible && (
            <ul ref={dropdownRef} className="absolute right-3 xl:right-0 -top-45 xl:top-15 mt-2 w-48 h-[10em] overflow-y-scroll bg-white border border-gray-300 rounded shadow-lg">
              <p className="text-center p-2 font-bold underline">Bible Versions</p>
              {book_versions.map((version) => (
                <li
                  key={version}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleVersionChange(version)}
                >
                  {version}
                </li>
              ))}
            </ul>
          )}
          <ul className="flex flex-col items-center space-y-5">
            <li
              className={`span-color p-3 w-fit min-h-[50px] ${
                listening ? "pt-4 shadow-gradient" : ""
              } rounded-full`}
            >
              <span className="">
                <img src={icon} alt="" />
              </span>
            </li>
            <li className="w-[214px] text-center font-semibold">
              Transcribing and detecting Bible quotations in real time
            </li>
            <li className="">
              <button
                className={`w-[197px] h-[48px] ${buttonColor} text-white flex justify-center hover:scale-105 transition-all hover:cursor-pointer rounded-3xl p-3 space-x-2 font-semibold`}
                onClick={handleButtonClick}
              >
                <img src={buttonIcon} alt="mic" /> <span>{buttonText}</span>
              </button>
            </li>
          </ul>
        </section>
      ) : (
        <div>Your Browser doesn't have recognition support</div>
      )}
    </>
  );
};

export default InteractionSection;
