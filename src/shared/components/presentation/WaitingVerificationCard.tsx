import { motion } from "framer-motion";

const WaitingVerificationCard = () => {
  return (
    <div className="text-center">
      <motion.h2
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-white text-2xl sm:text-4xl font-extrabold mb-6 px-2"
      >
        🎉 One last step! Verify your email to unlock the full VerseCatch experience. 🎉
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-blue-100 font-bold text-lg mb-8"
      >
        We've sent a verification link to your email address.
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-white text-md mb-10"
      >
        Please check your inbox and click the verification link.
        <br />
        If you don't see the email, please check your spam folder.
      </motion.div>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img 
          src="/assets/email-sent.png" 
          alt="Email sent" 
          className="w-32 h-32 mx-auto mb-6"
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="text-blue-200 text-sm"
      >
        <div className="flex items-center text-2xl
         justify-center">
          <div className="animate-pulse mr-2">🔄</div>
          Waiting for verification...
        </div>
      </motion.div>
    </div>
  );
};

export default WaitingVerificationCard;