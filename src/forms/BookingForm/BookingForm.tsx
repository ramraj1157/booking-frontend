import { useForm } from "react-hook-form";
import {
  PaymentIntentResponse,
  UserType,
} from "../../../../backend/src/shared/types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useSearchContext } from "../../contexts/SearchContext";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { motion } from "framer-motion";
import { useState } from "react";

type Props = {
  currentUser: UserType;
  paymentIntent: PaymentIntentResponse;
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  paymentIntentId: string;
  totalCost: number;
};

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const search = useSearchContext();
  const { hotelId } = useParams();
  const { showToast } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: bookRoom } = useMutation(apiClient.createRoomBooking, {
    onSuccess: () => {
      navigate("/my-bookings");
      showToast({ message: "Booking Saved!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error saving booking", type: "ERROR" });
      setIsSubmitting(false);
    },
  });

  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      adultCount: search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      hotelId: hotelId,
      totalCost: paymentIntent.totalCost,
      paymentIntentId: paymentIntent.paymentIntentId,
    },
  });

  const onSubmit = async (formData: BookingFormData) => {
    if (!stripe || !elements) return;

    setIsSubmitting(true);

    const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement) as StripeCardElement,
      },
    });

    if (result.paymentIntent?.status === "succeeded") {
      bookRoom({ ...formData, paymentIntentId: result.paymentIntent.id });
    } else {
      showToast({ message: "Payment Failed", type: "ERROR" });
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 rounded-xl border border-slate-300 p-6 shadow-lg bg-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <span className="text-2xl md:text-3xl font-extrabold text-gray-800">
        Confirm Your Details
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <label className="flex flex-col text-gray-700 text-sm font-semibold">
          First Name
          <input
            className="mt-1 border rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-100 font-normal focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>

        {/* Last Name */}
        <label className="flex flex-col text-gray-700 text-sm font-semibold">
          Last Name
          <input
            className="mt-1 border rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-100 font-normal focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>

        {/* Email */}
        <label className="flex flex-col text-gray-700 text-sm font-semibold md:col-span-2">
          Email
          <input
            className="mt-1 border rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-100 font-normal focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>

      {/* Price Summary */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold">Your Price Summary</h2>

        <div className="bg-blue-100 p-5 rounded-xl flex flex-col gap-1">
          <div className="font-bold text-lg text-blue-700">
            Total Cost: £{paymentIntent.totalCost.toFixed(2)}
          </div>
          <div className="text-xs text-blue-500">
            Includes taxes and charges
          </div>
        </div>
      </motion.div>

      {/* Payment */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Payment Details</h3>
        <div className="border rounded-lg p-3">
          <CardElement id="payment-element" className="text-sm" />
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-end">
        <motion.button
          disabled={isSubmitting}
          type="submit"
          className="w-full md:w-auto bg-blue-600 text-white py-3 px-6 font-bold rounded-lg hover:bg-blue-500 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          whileTap={{ scale: 0.95 }}
        >
          {isSubmitting ? "Processing Payment..." : "Confirm Booking"}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default BookingForm;
