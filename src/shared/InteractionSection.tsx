import { useState} from "react";
import useSpeeachRecognitionHook from "./UseSpeechRecognitionHook";

const InteractionSection = () => {
  const [listening, setListening] = useState(false);
  const [icon, setIcon] = useState("/assets/play.png");
  const [buttonText, setButtonText] = useState("Start Listening");
  const [buttonColor, setButtonColor] = useState("btn-black");
  const [buttonIcon, setButtonIcon] = useState("/assets/mic.png");

  // use speech recognition
  const {
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  } = useSpeeachRecognitionHook();

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

  return (
    <>
      {hasRecognitionSupport ? (
        <section className="bg-white px-20 py-6 xl:w-1/2 w-full rounded-xl">
          <ul className="flex flex-col items-center space-y-5">
            <li
              className={`span-color p-3 w-fit min-h-[50px] ${
                listening ? "pt-4" : ""
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