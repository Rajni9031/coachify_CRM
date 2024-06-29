// DateContext.js
import React, { createContext, useState, useEffect } from 'react';

export const DateContext = createContext();

export const DateProvider = ({ children }) => {
  // Function to get today's date in YYYY-MM-DD format
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to check if a date string is valid (not null or empty)
  const isValidDate = (dateString) => {
    return dateString && dateString.trim() !== '';
  };

  // Initialize clickedDate from local storage or default to today's date
  const initialDate = localStorage.getItem('clickedDate') || getTodayDateString();
  const [clickedDate, setClickedDate] = useState(initialDate);

  // Store clickedDate in local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('clickedDate', clickedDate);
  }, [clickedDate]);

  // Ensure clickedDate is valid on mount, default to today's date if not
  useEffect(() => {
    if (!isValidDate(clickedDate)) {
      setClickedDate(getTodayDateString());
    }
  }, []);

  return (
    <DateContext.Provider value={{ clickedDate, setClickedDate }}>
      {children}
    </DateContext.Provider>
  );
};