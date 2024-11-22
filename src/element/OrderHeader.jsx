import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const OrderHeader = ({ onSearch, onDateFilter }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    onSearch(event.target.value);
  };

  const handleDateRangeChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    // Call onDateFilter only if both dates are selected
    if (start && end) {
      onDateFilter(moment(start).toDate(), moment(end).toDate());
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 shadow rounded">
      <h1 className="text-xl font-bold mb-2 md:mb-0">Manage Orders</h1>
      <div className="flex flex-col md:flex-row items-center gap-2">
        <input
          type="text"
          placeholder="Search by Order ID, Customer Name, or Phone"
          className="border p-2 rounded w-full md:w-64"
          onChange={handleSearchChange}
        />
        <DatePicker
          selected={startDate}
          onChange={handleDateRangeChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          placeholderText="Select Date Range"
          className="border p-2 rounded w-full md:w-auto"
          dateFormat="yyyy/MM/dd"
        />
      </div>
    </div>
  );
};

export default OrderHeader;
