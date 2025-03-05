import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InteractionSection from "@/shared/InteractionSection";
import Introduction from "@/shared/Introduction";

const HomePage = () => {
  const [receivedData, setReceivedData] = useState<string | null>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string>("KJV_bible"); // Default version

  const parsedData = receivedData ? JSON.parse(receivedData)[0] : null;

  return (
    <main className="animated-gradient relative h-[100vh] xl:gap-0 gap-20 flex flex-col items-center justify-between xl:py-10 pt-5">
      {/* Show the first version div only if there's no receivedData */}
      {!receivedData && (
        <div className="absolute left-2 sm:left-10 top-[21em] sm:top-8 font-bold text-lg flex items-center gap-2">
          <img
            src="/assets/version.png"
            alt="Bible Version"
            className="w-8 sm:w-14"
          />
          <span className="bg-slate-400/10 p-3">
            {selectedVersion || "Bible version"}
          </span>
        </div>
      )}

      {!introComplete && (
        <Introduction
          onComplete={(version) => {
            setSelectedVersion(version); // Update the selected version
            setIntroComplete(true); // Mark introduction as complete
          }}
        />
      )}

      <section className="font-bold text-2xl flex items-center">
        <img src="/assets/book.png" alt="Bible" className="w-14" /> VerseCatch
      </section>

      {/* Show the section with version2 div only if there's receivedData */}
      {receivedData && (
        <AnimatePresence>
          <motion.section
            key="verse-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundImage: "url('/assets/fr.jpg')", // Add your image path here
              backgroundSize: "cover", // Ensure the image covers the section
              backgroundPosition: "center", // Center the image
              backgroundBlendMode: "overlay", // Blend the gradient with the image
              background:
                "linear-gradient(135deg, rgba(20, 30, 48, 1), rgba(36, 59, 85, 0.2))", // Gradient with transparency
            }}
            className="xl:w-1/2 space-y-4 p-10 relative text-white rounded-2xl"
          >
            <div className="absolute left-10 sm:left-10 top-1 sm:top-8 font-bold text-lg flex items-center gap-1">
              <img
                src="/assets/version2.png"
                alt="Bible Version"
                className="w-8 sm:w-8"
              />
              <span className="bg-slate-400/10 p-3">
                {selectedVersion || "Bible version"}
              </span>
            </div>

            {parsedData ? (
              <>
                <h1 className="text-center font-bold xl:text-3xl text-xl pt-10">{`${parsedData.book} ${parsedData.chapter}:${parsedData.verse_number}`}</h1>
                <p className="text-center xl:text-2xl text-xl px-0 xl:px-0">
                  {parsedData.text}
                </p>
              </>
            ) : (
              ""
            )}
          </motion.section>
        </AnimatePresence>
      )}
      <InteractionSection
        setReceivedData={setReceivedData}
        selectedVersion={selectedVersion} // Pass the selected version
        setSelectedVersion={setSelectedVersion} // Pass the function to update the selected version
      />
    </main>
  );
};

export default HomePage;
