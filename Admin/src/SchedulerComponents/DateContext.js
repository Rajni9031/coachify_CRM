import React, { createContext, useState } from 'react';

export const DateContext = createContext();

export const DateProvider = ({ children }) => {
  // Get today's date in UTC and then convert it to IST
  const todayUTC = new Date();
  const istDate = new Date(todayUTC.getTime() + (5.5 * 60 * 60 * 1000)); // IST offset in milliseconds
  
  // Format IST date to YYYY-MM-DD format
  const formattedDate = istDate.toISOString().split('T')[0];

  const [clickedDate, setClickedDate] = useState(formattedDate);

  return (
    <DateContext.Provider value={{ clickedDate, setClickedDate }}>
      {children}
    </DateContext.Provider>
  );
};