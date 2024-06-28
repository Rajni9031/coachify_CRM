import React, { useContext } from "react";
import Nav from "../SchedulerComponents/Nav";
import Scroll from "../SchedulerComponents/Scroll";
import Calendar from "../SchedulerComponents/Calender"; // Make sure to import Calendar correctly
import { DateContext } from '../SchedulerComponents/DateContext';

function SchedulerHome() {
  const { clickedDate } = useContext(DateContext);

  return (
    <div>
      <Nav />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <Scroll style={{ display: "inline" }} showbar={true} showDemoClasses={true} />
        <Calendar style={{ marginTop: "-65vh", position: "absolute" }} isAdmin={true} />
      </div>
    </div>
  );
}

export default SchedulerHome;
