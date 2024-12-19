


import React, { useState, useContext } from "react";
import { GenerateTimeContext } from "../../context/generateTimeContext";
const ReportFilter = ({ onFilterChange }) => {
  const [filterType, setFilterType] = useState("month");
  const { year, month } = useContext(GenerateTimeContext)
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    onFilterChange({ type: e.target.value, value: "" }); // Reset filter value on type change
  };

  const handleMonthChange = (e) => {
    const value = e.target.value;
    setSelectedMonth(value);
    onFilterChange({ type: "month", value });
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    setSelectedYear(value);
    onFilterChange({ type: "year", value });
    console.log("YEar; ", value);
  };

  return (
    <div className="wrap-dropdown-selector">
      <label>
        <select value={filterType} onChange={handleFilterTypeChange}>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </label>

      {filterType === "month" && (
        <label>
          <select value={selectedMonth} onChange={handleMonthChange}>
            <option value="">--Select Month--</option>
            {months.map((month, index) => (
              <option key={index} value={month}>{month}</option>
            ))}
          </select>
        </label>
      )}

      {filterType === "year" && (
        <label>
          <select value={selectedYear} onChange={handleYearChange}>
            <option value="">--Select Year--</option>
            {years.map((year, index) => (
              <option key={index} value={year}>{year}</option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
};

export default ReportFilter;
