import { FC } from "react";
import { motion } from "framer-motion";
import { WaitingVerificationInterface } from "../../constants/interfaceConstants";

const WaitingVerificationCard: FC<WaitingVerificationInterface> = ({
  showCheckmark,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center text-blue-500 font-bold pt-10"
    >
      Waiting for email verification. Please check your inbox.
      {showCheckmark && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center pt-5"
        >
          <img src="/assets/check.png" alt="check mark" className="w-20" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default WaitingVerificationCard;
