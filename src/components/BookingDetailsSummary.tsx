import { HotelType } from "../shared/types";
import { motion } from "framer-motion";

type Props = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  numberOfNights: number;
  hotel: HotelType;
};

const BookingDetailsSummary = ({
  checkIn,
  checkOut,
  adultCount,
  childCount,
  numberOfNights,
  hotel,
}: Props) => {
  return (
    <motion.div
      className="grid gap-5 rounded-xl border border-slate-300 p-6 shadow-lg bg-white"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800">Your Booking Details</h2>

      <div className="border-b pb-4">
        <div className="text-gray-600">Location:</div>
        <div className="font-bold text-lg text-blue-700">{`${hotel.name}, ${hotel.city}, ${hotel.country}`}</div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <div className="text-gray-600">Check-in</div>
          <div className="font-bold">{checkIn.toDateString()}</div>
        </div>

        <div>
          <div className="text-gray-600">Check-out</div>
          <div className="font-bold">{checkOut.toDateString()}</div>
        </div>
      </div>

      <div className="border-t border-b py-4">
        <div className="text-gray-600">Total Length of Stay:</div>
        <div className="font-bold">{numberOfNights} nights</div>
      </div>

      <div>
        <div className="text-gray-600">Guests:</div>
        <div className="font-bold">
          {adultCount} adults & {childCount} children
        </div>
      </div>
    </motion.div>
  );
};

export default BookingDetailsSummary;
