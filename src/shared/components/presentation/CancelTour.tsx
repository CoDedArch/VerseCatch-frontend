import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { CancelTourProps } from "@/shared/constants/interfaceConstants";

const CancelTour = ({ setTourState, updateHasTakenTour }: CancelTourProps) => {
  const { user } = useSelector((state: RootState) => state.user);

  const cancelTour = async () => {
    // Combine both state updates into one to avoid multiple renders
    setTourState((prev) => ({
      ...prev,
      isTourActive: false,
      isCancelled: false,
    }));

    if (user?.email) {
      await updateHasTakenTour(user.email, true);
    }
  };

  return (
    <section className="bg-black/80 fixed inset-0 h-screen w-full z-50 flex justify-center items-center">
      <button
        className="text-white font-bold text-2xl ml-10 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-700/50"
        onClick={cancelTour}
      >
        Cancel Tour
      </button>
    </section>
  );
};

export default CancelTour;
