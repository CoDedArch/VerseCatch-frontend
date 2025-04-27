// import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { logout } from "@/store/userSlice";
import { useDispatch } from "react-redux";
import { setIntroComplete } from "@/store/uiSlice";

const CreateAccount = () => {
  const dispatch = useDispatch();
  

  const handleCreateAccount = () => {
    dispatch(setIntroComplete(false));
    dispatch(logout());
  };
  return (
    <motion.div
      whileHover={{ scale: 1 }}
      whileTap={{ scale: 0.98 }}
      className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all cursor-pointer no-highlight p-2 mr-10"
      onClick={handleCreateAccount}
    >
      <img src="/assets/user.png" alt="Upgrade" className="w-5 sm:w-5" />
      <span className="bg-slate-400/10 p-1 rounded">Create Account</span>
    </motion.div>
  );
};

export default CreateAccount;
