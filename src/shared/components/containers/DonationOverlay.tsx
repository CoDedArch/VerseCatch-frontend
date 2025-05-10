import { useEffect, useState } from "react";
import { useUserData } from "../Hooks/useUserData";
import { motion, AnimatePresence } from "framer-motion";
import { loadPaystackScript } from "@/app/lib/paystack";
import CreateAccount from "./CreatAccount";

interface PaystackSetupOptions {
  key: string;
  email: string;
  amount: number;
  reference: string;
  currency?: string;
  channels?: string[];
  metadata?: Record<string, string | number | boolean>;
  onClose?: () => void;
  callback?: (response: { reference: string }) => void;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: PaystackSetupOptions) => { openIframe: () => void };
    };
  }
}

const DonationOverlay = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(12); // Default rate (1 USD = 12 GHS)
  const { isLoggedIn, userData, isAnonymous } = useUserData();
  const [lastReference, setLastReference] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPaystackScript();

    // Fetch current exchange rate
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const data = await response.json();
        setExchangeRate(data.rates.GHS);
      } catch (error) {
        console.error("Couldn't fetch exchange rate, using default", error);
      }
    };

    fetchExchangeRate();

    const hasSeenOverlay = localStorage.getItem("hasSeenDonationOverlay");

    if ((!hasSeenOverlay && isLoggedIn) || isAnonymous) {
      const timer = setTimeout(() => {
        setShowOverlay(true);
        localStorage.setItem("hasSeenDonationOverlay", "true");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, isAnonymous]);

  const convertToCedis = (usd: number) => {
    return Math.round(usd * exchangeRate);
  };

  // Initialize Payment
  const initializePayment = async (amountInUsd: number) => {
    setIsProcessing(true);

    try {
      const amountInCedis = convertToCedis(amountInUsd);

      // First create payment record in backend
      const createPaymentResponse = await fetch(
        "http://127.0.0.1:8000/api/create-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            amount: amountInCedis,
            currency: "GHS",
            metadata: {
              originalUsdAmount: amountInUsd,
              donationType: amountInUsd >= 5 ? "supporter" : "standard",
            },
          }),
        }
      );

      if (!createPaymentResponse.ok) {
        setError("Failed to create payment record");
        throw new Error("Failed to create payment record");
      }

      const { reference } = await createPaymentResponse.json();
      setLastReference(reference);
      // Initialize Paystack payment with reference from backend
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: userData?.email || "user@example.com",
        amount: amountInCedis * 100, // Convert to pesewas
        currency: "GHS",
        reference,
        channels: ["card", "mobile_money"],
        metadata: {
          originalUsdAmount: amountInUsd,
          userId: userData?.id ?? "",
        },
        onClose: () => {
          setIsProcessing(false);
          console.log("Payment window closed");
        },
        callback: (response: { reference: string }) => {
          handlePaymentVerification(response.reference, amountInUsd);
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      setIsProcessing(false);
      setError(`Payment initialization failed: ${error}`);
    }
  };

  const handlePaymentVerification = async (
    reference: string,
    amountInUsd: number
  ) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ reference }),
      });

      // First check if the response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
            `Verification failed with status ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Verification response:", data); // Debug log

      if (data.status === "success") {
        // Payment was successful
        localStorage.setItem("hasDonated", "true");
        localStorage.setItem("lastDonationAmount", amountInUsd.toString());
        localStorage.setItem("lastDonationDate", new Date().toISOString());

        if (data.isSupporter) {
          localStorage.setItem("isSupporter", "true");
        }

        setShowOverlay(false);
        setError(null); // Clear any previous errors
      } else {
        throw new Error(data.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Payment verification failed. Please contact support."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = (action: "later" | "dismissed") => {
    setShowOverlay(false);
    localStorage.setItem(
      action === "later" ? "donationRemindLater" : "donationDismissed",
      new Date().toISOString()
    );
  };

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center p-4"
        >
          {/* Blurred background */}
          <motion.div
            className="absolute inset-0 bg-black/50 bg-opacity-70 backdrop-blur-sm"
            onClick={() => handleClose("dismissed")}
          />

          {/* Modal content */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative z-10 w-full max-w-md rounded-xl p-6 shadow-2xl bg-slate-800/50"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 text-red-300 rounded-lg">
                {error.includes("404") ? (
                  <>
                    Payment reference not found. Please contact support with
                    reference: {lastReference}
                  </>
                ) : (
                  error
                )}
              </div>
            )}
            <button
              onClick={() => handleClose("dismissed")}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
              disabled={isProcessing}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-500 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">
                {isProcessing
                  ? "Processing Donation..."
                  : "A Personal Request from the VerseCatch Team"}
              </h3>

              {!isProcessing ? (
                <>
                  <p className="text-gray-300 mb-3">
                    Hello friend! VerseCatch relies on OpenAI's Whisper model
                    for voice interactions, which costs us every time you use
                    it.
                  </p>
                  <p className="text-gray-300 mb-4">
                    Rather than charge subscriptions, we're asking for a
                    one-time donation to keep VerseCatch free and ad-free for
                    everyone.
                  </p>

                  <div className="mb-4 p-3 bg-gray-800/50 rounded-lg text-sm">
                    <div className="flex justify-between text-white">
                      <span>$2</span>
                      <span>500 voice queries</span>
                    </div>
                    <div className="flex justify-between text-white mt-1">
                      <span>$5+</span>
                      <span>Supporter recognition</span>
                    </div>
                    <div className="flex justify-center gap-2 mt-2">
                      <img
                        src="/assets/mtn-momo-logo.png"
                        className="h-10"
                        alt="MTN MoMo"
                      />
                      <img
                        src="/assets/visa-logo.png"
                        className="h-10"
                        alt="Visa"
                      />
                    </div>
                    <p className="text-gray-400 mt-2">
                      Payments processed in Ghana Cedis
                    </p>
                  </div>

                  {
                    isLoggedIn ? (

                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() => initializePayment(2)}
                      disabled={isProcessing}
                      className="w-full rounded-lg bg-[#D97706] px-4 py-3 font-medium text-white hover:bg-[#B45309] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      Donate $2
                    </button>

                    <button
                      onClick={() => initializePayment(5)}
                      disabled={isProcessing}
                      className="w-full rounded-lg bg-[#059669] px-4 py-3 font-medium text-white hover:bg-[#047857] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      Donate $5 - Become a Supporter
                    </button>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleClose("later")}
                        disabled={isProcessing}
                        className="flex-1 rounded-lg px-4 py-3 font-medium text-gray-300 hover:text-white transition-colors text-sm border border-gray-600 disabled:opacity-70"
                      >
                        Remind me later
                      </button>
                      <button
                        onClick={() => handleClose("dismissed")}
                        disabled={isProcessing}
                        className="flex-1 rounded-lg px-4 py-3 font-medium text-gray-300 hover:text-white transition-colors text-sm disabled:opacity-70"
                      >
                        No thanks
                      </button>
                    </div>
                  </div>
                    ) : (
                        <div className="flex justify-center text-lime-300/70">

                          <CreateAccount/>
                        </div>
                    )
                  }
                </>
              ) : (
                <div className="py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-300">Redirecting to PayStack...</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DonationOverlay;
