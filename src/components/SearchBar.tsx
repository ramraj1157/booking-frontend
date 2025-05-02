import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SearchBar = () => {
  const navigate = useNavigate();
  const search = useSearchContext();

  const [destination, setDestination] = useState<string>(search.destination);
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
  const [adultCount, setAdultCount] = useState<number>(search.adultCount);
  const [childCount, setChildCount] = useState<number>(search.childCount);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    search.saveSearchValues(
      destination,
      checkIn,
      checkOut,
      adultCount,
      childCount
    );
    navigate("/search");
  };

  const handleClear = () => {
    setDestination("");
    setCheckIn(new Date());
    setCheckOut(new Date());
    setAdultCount(1);
    setChildCount(0);
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/95 backdrop-blur-sm shadow-md rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
    >
      {/* Destination */}
      <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white focus-within:ring-2 ring-blue-500 transition">
        <MdTravelExplore size={20} className="text-gray-500" />
        <input
          type="text"
          placeholder="Where are you going?"
          className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      {/* Guests */}
      <div className="flex justify-between gap-3 bg-white border rounded-md px-3 py-2 text-sm text-gray-800">
        <label className="flex flex-col w-1/2">
          <span className="text-gray-500 font-medium">Adults</span>
          <input
            type="number"
            min={1}
            max={20}
            value={adultCount}
            onChange={(e) => setAdultCount(parseInt(e.target.value))}
            className="mt-1 border rounded-md px-2 py-1 focus:outline-none focus:ring-2 ring-blue-400"
          />
        </label>
        <label className="flex flex-col w-1/2">
          <span className="text-gray-500 font-medium">Children</span>
          <input
            type="number"
            min={0}
            max={20}
            value={childCount}
            onChange={(e) => setChildCount(parseInt(e.target.value))}
            className="mt-1 border rounded-md px-2 py-1 focus:outline-none focus:ring-2 ring-blue-400"
          />
        </label>
      </div>

      {/* Check-in Date */}
      <div className="bg-white border rounded-md px-3 py-2 text-sm text-gray-800 focus-within:ring-2 ring-blue-500 transition">
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date as Date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="Check-in"
          className="w-full focus:outline-none"
        />
      </div>

      {/* Check-out Date */}
      <div className="bg-white border rounded-md px-3 py-2 text-sm text-gray-800 focus-within:ring-2 ring-blue-500 transition">
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date as Date)}
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={checkIn}
          maxDate={maxDate}
          placeholderText="Check-out"
          className="w-full focus:outline-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-full bg-gray-200 text-gray-800 font-medium py-2 rounded-md hover:bg-gray-300 transition"
        >
          Clear
        </button>
      </div>
    </motion.form>
  );
};

export default SearchBar;
