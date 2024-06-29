import React, { useState, useEffect, useContext } from "react";
import { DateContext } from './DateContext';

const Calendar = ({ onDateClick, joiningDate, batchStartDate, clickableRange }) => {
  const [date, setDate] = useState(new Date());
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const { setClickedDate } = useContext(DateContext);

  const { clickedDate } = useContext(DateContext);

  // Function to format the clickedDate
  const formatClickedDate = (dateString) => {
    const selectedDate = new Date(dateString);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${selectedDate.getDate()} ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const isDateInRange = (date, start, end) => {
    const d = new Date(date);
    const s = new Date(start);
    const e = new Date(end);
    return d >= s && d <= e;
  };

  const renderCalendar = () => {
    const start = new Date(year, month, 1).getDay();
    const endDateOfMonth = new Date(year, month + 1, 0).getDate();
    const end = new Date(year, month, endDateOfMonth).getDay();
    const today = new Date();

    const batchStartDateObj = new Date(batchStartDate);
    const joiningDateObj = new Date(joiningDate);
    const oneDayBeforeJoining = new Date(joiningDateObj);
    oneDayBeforeJoining.setDate(joiningDateObj.getDate() - 1);

    let datesHtml = [];

    for (let i = start; i > 0; i--) {
      const prevMonthDay = new Date(year, month, -i + 1);
      datesHtml.push(
        <li
          key={`prev-${i}`}
          style={{
            color: "#ccc",
            width: "calc(100% / 7)",
            marginTop: "25px",
            position: "relative",
            zIndex: 2,
            opacity: 0.4,
          }}
        >
          <button
            disabled
            style={{
              width: "2rem",
              height: "2rem",
              backgroundColor: "transparent",
              border: "none",
              cursor: "default",
            }}
          >
            {prevMonthDay.getDate()}
          </button>
        </li>
      );
    }

    for (let i = 1; i <= endDateOfMonth; i++) {
      const currentDate = new Date(year, month, i);
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === i &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year;

      const isInRange = clickableRange
        ? isDateInRange(currentDate, clickableRange.start, clickableRange.end)
        : true;

      const isToday =
        i === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      const isBetweenBatchStartAndJoining =
        currentDate >= batchStartDateObj && currentDate <= oneDayBeforeJoining;

      datesHtml.push(
        <li
          key={`current-${i}`}
          style={{
            width: "calc(100% / 7)",
            marginTop: "25px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <button
            onClick={() => handleDateClick(i)}
            disabled={!isInRange}
            style={{
              width: "2rem",
              height: "2rem",
              backgroundColor: isSelected ? "#fff" : isBetweenBatchStartAndJoining ? "#ffcccc" : "transparent",
              borderRadius: isSelected ? "50%" : "none",
              color: isSelected ? "#000" : isToday ? "#fff" : isBetweenBatchStartAndJoining ? "#ff0000" : "inherit",
              fontWeight: isBetweenBatchStartAndJoining ? "bold" : "normal",
              cursor: isInRange ? "pointer" : "not-allowed",
              border: "none",
              outline: "none",
              position: "relative",
            }}
          >
            {isToday && (
              <span
                style={{
                  content: '""',
                  width: "2rem",
                  height: "2rem",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "#000",
                  borderRadius: "50%",
                  zIndex: -1,
                }}
              ></span>
            )}
            {i}
          </button>
        </li>
      );
    }

    for (let i = 1; i < 7 - end; i++) {
      const nextMonthDay = new Date(year, month + 1, i);
      datesHtml.push(
        <li
          key={`next-${i}`}
          style={{
            color: "#ccc",
            width: "calc(100% / 7)",
            marginTop: "25px",
            position: "relative",
            zIndex: 2,
            opacity: 0.4,
          }}
        >
          <button
            disabled
            style={{
              width: "2rem",
              height: "2rem",
              backgroundColor: "transparent",
              border: "none",
              cursor: "default",
            }}
          >
            {nextMonthDay.getDate()}
          </button>
        </li>
      );
    }

    return datesHtml;
  };

  const handleNavClick = (direction) => {
    if (direction === "prev") {
      if (month === 0) {
        setYear(year - 1);
        setMonth(11);
      } else {
        setMonth(month - 1);
      }
    } else if (direction === "next") {
      if (month === 11) {
        setYear(year + 1);
        setMonth(0);
      } else {
        setMonth(month + 1);
      }
    }
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(year, month, day);
    setSelectedDate(clickedDate);
    setClickedDate(clickedDate);
  };

  useEffect(() => {
    setDate(new Date(year, month, new Date().getDate()));
  }, [month, year]);

  return (
    <div
      style={{
        marginLeft: "60vw",
        position: "absolute",
        width: "98%",
        maxWidth: "380px",
        padding: "1rem",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {clickedDate && (
        <div style={{ marginBottom: "1rem", textAlign: "center", fontWeight: "800" }}>
          Selected Date: {formatClickedDate(clickedDate)}
        </div>
      )}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3 style={{ fontWeight: "600" }}>{`${months[month]} ${year}`}</h3>
        <nav style={{ display: "flex", alignItems: "center" }}>
          <button
            id="prev"
            onClick={() => handleNavClick("prev")}
            style={{
              width: "20px",
              height: "20px",
              position: "relative",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                content: '""',
                width: "50%",
                height: "50%",
                position: "absolute",
                top: "50%",
                left: "50%",
                borderStyle: "solid",
                borderWidth: "0.25em 0.25em 0 0",
                borderColor: "#ccc",
                transform: "translate(-50%, -50%) rotate(-135deg)",
              }}
            />
          </button>
          <button
            id="next"
            onClick={() => handleNavClick("next")}
            style={{
              width: "20px",
              height: "20px",
              position: "relative",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                content: '""',
                width: "50%",
                height: "50%",
                position: "absolute",
                top: "50%",
                left: "50%",
                borderStyle: "solid",
                borderWidth: "0.25em 0.25em 0 0",
                borderColor: "#ccc",
                transform: "translate(-50%, -50%) rotate(45deg)",
              }}
            />
          </button>
        </nav>
      </header>
      <section>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexWrap: "wrap",
            textAlign: "center",
            padding: "0",
            margin: "0",
          }}
        >
          <li style={{ width: "calc(100% / 7)", fontWeight: "600" }}>Sun</li>
          <li style={{ width: "calc(100% / 7)", fontWeight: "600" }}>Mon</li>
          <li style={{ width: "calc(100% / 7)", fontWeight: "600" }}>Tue</li>
          <li style={{ width: "calc(100% / 7)", fontWeight: "600" }}>Wed</li>
          <li style={{ width: "calc(100% / 7)", fontWeight: "600" }}>Thu</li>
          <li style={{ width: "calc(100% / 7)", fontWeight: "600" }}>Fri</li>
          <li style={{ width: "calc(100% / 7)", fontWeight: "600" }}>Sat</li>
        </ul>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexWrap: "wrap",
            textAlign: "center",
            padding: "0",
            margin: "0",
          }}
        >
          {renderCalendar()}
        </ul>
      </section>
    </div>
  );
};

export default Calendar;
