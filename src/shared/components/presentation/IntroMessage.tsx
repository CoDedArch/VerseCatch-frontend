import { motion } from "framer-motion";

const IntroMessage = () => {
  return (
    <motion.section
      key="greeting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: "linear-gradient(135deg, #1CB5E0, #000046)",
      }}
      className="absolute w-full text-center h-full inset-0 z-[100000] flex items-center justify-center text-white text-3xl font-bold"
    >
      Hello and welcome to VerseCatch!
    </motion.section>
  );
};

export default IntroMessage;
