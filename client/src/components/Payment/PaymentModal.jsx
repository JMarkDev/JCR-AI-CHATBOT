import propTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import { toast, ToastContainer } from "react-toastify";

export default function PaymentModal({
  isOpen,
  onClose,
  userId,
  setSuccessPayment,
}) {
  const paypalRef = useRef();
  const [selectedPlan, setSelectedPlan] = useState("weekly");
  const [paypalInitialized, setPaypalInitialized] = useState(false);
  // const [successPayment, setSuccessPayment] = useState(false);

  const handlePaid = async () => {
    try {
      const response = await api.put(
        `/users/paid-subscription?userId=${userId}&subscription=${selectedPlan}`
      );
      console.log(response.data);
      setSuccessPayment(true);
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  // Get amount based on selected plan
  const getAmount = () => {
    return selectedPlan === "weekly"
      ? "100.00"
      : selectedPlan === "monthly"
      ? "500.00"
      : "1000.00";
  };

  const handleTopUp = (amount) => {
    console.log(`Processing payment of ${amount}`);
    onClose();
  };

  // Reset PayPal when the selected plan changes
  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);

    // Reset PayPal to reinitialize with new amount
    if (paypalInitialized) {
      if (paypalRef.current) {
        paypalRef.current.innerHTML = "";
      }
      setPaypalInitialized(false);
    }
  };

  // Clean up PayPal when component unmounts or modal closes
  useEffect(() => {
    return () => {
      // if (paypalRef.current) {
      //   paypalRef.current.innerHTML = "";
      // }
      setPaypalInitialized(false);
    };
  }, [isOpen]);

  // Initialize PayPal only when modal is open
  useEffect(() => {
    let isMounted = true;

    const initializePayPal = async () => {
      if (isOpen && paypalRef.current && !paypalInitialized && window.paypal) {
        // Clear previous content
        paypalRef.current.innerHTML = "";

        try {
          const buttons = window.paypal.Buttons({
            createOrder: (data, actions) => {
              const amount = getAmount();

              return actions.order.create({
                purchase_units: [
                  { amount: { value: amount, currency_code: "PHP" } },
                ],
              });
            },
            onApprove: async (data, actions) => {
              const order = await actions.order.capture();
              console.log("Order successful:", order);
              setSuccessPayment(true);
              await handlePaid();
              onClose();
              if (isMounted) {
                const amount =
                  selectedPlan === "weekly"
                    ? 100
                    : selectedPlan === "monthly"
                    ? 500
                    : 1000;

                handleTopUp(amount);
              }
            },
            onError: (err) => {
              console.error("PayPal error:", err);
            },
          });

          if (isMounted && paypalRef.current) {
            await buttons.render(paypalRef.current);
            setPaypalInitialized(true);
          }
        } catch (error) {
          console.error("Failed to render PayPal buttons:", error);
        }
      }
    };

    initializePayPal();

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedPlan, paypalInitialized]);

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <ToastContainer />

      <div className="bg-white overflow-y-auto relative p-6 rounded-2xl shadow-lg max-w-xl h-fit w-full flex gap-6">
        {/* Left Side - Plans */}
        <div className="flex-1 text-center">
          <h2 className="text-2xl font-bold mb-4">Choose a Plan 📅</h2>

          <div className="flex flex-col gap-4">
            {/* Weekly Plan */}
            <label
              htmlFor="weekly-plan"
              className={`border rounded-md p-4 flex justify-between items-center cursor-pointer w-full ${
                selectedPlan === "weekly"
                  ? "border-blue-500 border-2"
                  : "border-gray-300 hover:border-blue-500"
              }`}
            >
              <input
                type="radio"
                id="weekly-plan"
                name="payment-plan"
                value="weekly"
                checked={selectedPlan === "weekly"}
                onChange={() => handlePlanChange("weekly")}
                className="hidden"
              />
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-gray-400 mr-2 relative">
                  {selectedPlan === "weekly" && (
                    <span className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                  )}
                </span>
                Weekly
              </div>
              <div className="text-right font-bold">
                <span>₱100/wk</span>
                <div className="text-xs text-gray-500 font-normal">
                  ₱100 billed every week
                </div>
              </div>
            </label>

            {/* Monthly Plan */}
            <label
              htmlFor="monthly-plan"
              className={`border rounded-md p-4 flex justify-between items-center cursor-pointer w-full ${
                selectedPlan === "monthly"
                  ? "border-blue-500 border-2"
                  : "border-gray-300 hover:border-blue-500"
              }`}
            >
              <input
                type="radio"
                id="monthly-plan"
                name="payment-plan"
                value="monthly"
                checked={selectedPlan === "monthly"}
                onChange={() => handlePlanChange("monthly")}
                className="hidden"
              />
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-gray-400 mr-2 relative">
                  {selectedPlan === "monthly" && (
                    <span className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                  )}
                </span>
                Monthly
              </div>
              <div className="text-right font-bold">
                <span>₱500/mo</span>
                <div className="text-xs text-gray-500 font-normal">
                  ₱500 billed every month
                </div>
              </div>
            </label>

            {/* Annual Plan */}
            <label
              htmlFor="yearly-plan"
              className={`border rounded-md p-4 flex justify-between items-center cursor-pointer w-full ${
                selectedPlan === "yearly"
                  ? "border-blue-500 border-2"
                  : "border-gray-300 hover:border-blue-500"
              }`}
            >
              <input
                type="radio"
                id="yearly-plan"
                name="payment-plan"
                value="yearly"
                checked={selectedPlan === "yearly"}
                onChange={() => handlePlanChange("yearly")}
                className="hidden"
              />
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-gray-400 mr-2 relative">
                  {selectedPlan === "yearly" && (
                    <span className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                  )}
                </span>
                Annually
              </div>
              <div className="text-right font-bold">
                <span>₱1000/yr</span>
                <div className="text-xs text-gray-500 font-normal">
                  ₱1000 billed once a year
                </div>
              </div>
            </label>
          </div>
          <div className="flex-1 flex flex-col items-center mt-6">
            <h2 className="text-2xl font-bold mb-4">Pay with PayPal 💳</h2>
            <div ref={paypalRef} className="w-full"></div>
          </div>
        </div>

        <button
          onClick={() => onClose(false)}
          className="absolute top-4 right-4 text-red-500 hover:text-red-600 font-bold"
        >
          ✖
        </button>
      </div>
    </div>
  );
}

PaymentModal.propTypes = {
  isOpen: propTypes.bool,
  onClose: propTypes.func,
  userId: propTypes.number,
  setSuccessPayment: propTypes.func,
};
