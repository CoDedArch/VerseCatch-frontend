import { motion, AnimatePresence } from "framer-motion";
import {
  Verse,
} from "@/shared/constants/interfaceConstants";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { VerseSectionProps } from "@/shared/constants/interfaceConstants";


const VerseSection = ({
  parsedData,
  entireBookData,
  handleVerseClick,
  setEntireBookData,
}: VerseSectionProps) => {
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const { 
    selectedVersion,
    highlightedVerse,
  } = useSelector((state: RootState) => state.ui);
  return (
    <AnimatePresence>
      <motion.section
        style={{
          background: theme.styles.verseBackground?.background,
          color: theme.styles.verseBackground?.color,
        }}
        key="verse-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="w-[350px] h-[30em] sm:h-[25em] mt-10 xl:w-1/2 space-y-4 p-10 relative rounded-2xl bg-white/10 backdrop-blur-sm cursor-pointer"
        onClick={!entireBookData ? handleVerseClick : undefined}
      >
        {/* Header with version and back button */}
        <div className="flex justify-between items-center mb-6">
          <div className="font-bold text-lg flex items-center gap-2">
            <img
              src="/assets/version2.png"
              alt="Bible Version"
              className="w-8"
            />
            <span className="bg-slate-400/10 p-2 rounded-lg">
              {selectedVersion || "Bible version"}
            </span>
          </div>

          {entireBookData && (
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setEntireBookData(null);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src="/assets/back.png" alt="Back" className="w-8" />
              <span className="bg-slate-400/10 p-2 rounded-lg">Back</span>
            </motion.div>
          )}
        </div>

        {/* Content area */}
        <div className="min-h-[300px] flex flex-col justify-center">
          {parsedData && !entireBookData ? (
            <>
              <motion.h1
                className="text-center font-bold xl:text-3xl text-xl pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {`${parsedData.book} ${parsedData.chapter}:${parsedData.verse_number}`}
              </motion.h1>
              <motion.p
                className="text-center xl:text-2xl text-xl px-0 xl:px-0 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {parsedData.text}
              </motion.p>
              <motion.div
                className="text-center mt-6 text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Click anywhere to view full chapter
              </motion.div>
            </>
          ) : (
            entireBookData && (
              <div className="overflow-y-auto max-h-[70vh] custom-scrollbar">
                {entireBookData.map((chapter) => (
                  <div key={chapter.chapter} className="mb-8">
                    <h2 className="text-center font-bold xl:text-2xl text-xl mb-4">
                      {`${parsedData?.book} Chapter ${chapter.chapter}`}
                    </h2>
                    <div className="space-y-3">
                      {chapter.verses.map((verse: Verse) => (
                        <motion.p
                          style={highlightedVerse === `${chapter.chapter}:${verse.verse_number}` ? 
                            {color: theme.styles.verseBackground?.verseHighlight} : undefined}
                          key={`${chapter.chapter}:${verse.verse_number}`}
                          id={`${chapter.chapter}:${verse.verse_number}`}
                          className={`text-center xl:text-xl text-lg px-4 py-2 rounded-lg ${
                            highlightedVerse ===
                            `${chapter.chapter}:${verse.verse_number}`
                              ? `bg-green-500/20 text-green-200`
                              : "hover:bg-white/10"
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="font-bold">
                            {verse.verse_number}.
                          </span>{" "}
                          {verse.text}
                        </motion.p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </motion.section>
    </AnimatePresence>
  );
};

export default VerseSection;
