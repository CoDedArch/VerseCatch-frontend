import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { cancelTour } from "@/store/tourSlice";
import { useDispatch } from "react-redux";
import { updateHasTakenTour } from "@/store/tourSlice";
import { AppDispatch } from "@/store/store";

const CancelTour = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { status } = useSelector((state: RootState) => state.tour);

  const handleCancelTour = async () => {
    try {
      // Dispatch cancelTour first to immediately update UI
      dispatch(cancelTour());
      
      if (user?.email) {
        await dispatch(updateHasTakenTour({ 
          email: user.email, 
          hasTakenTour: true 
        })).unwrap()
          .then((result) => {
            console.log("Update successful:", result);
          })
          .catch((error: { message: string }) => {
            console.error("Update failed:", error.message);
          });
      }
    } catch (error) {
      const err = error as Error;
      console.error("Tour cancellation failed:", err.message);
    }
  };

  return (
    <section className="bg-black/80 fixed inset-0 h-screen w-full z-[10000] flex justify-center items-center">
      <button
        className={`text-white font-bold text-2xl ml-10 px-6 py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg ${
          status === 'loading' 
            ? 'bg-gray-600 cursor-not-allowed' 
            : 'bg-red-600 hover:bg-red-700 hover:shadow-red-700/50'
        }`}
        onClick={handleCancelTour}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Processing...' : 'Cancel Tour'}
      </button>
    </section>
  );
};

export default CancelTour;