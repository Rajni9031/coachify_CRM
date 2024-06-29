import React, { useState, useEffect } from 'react';
import Nav from '../SchedulerComponents/Nav';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Calendar from '../SchedulerComponents/Calender';
// import { BatchContext } from '../ContextApi/BatchContext'
import Scroll from '../SchedulerComponents/Scroll'; // Adjust the path as necessary

const APP = process.env.REACT_APP_API_URL;

const Scheduler = () => {
  const { username } = useParams();
  // const [selectedDate, setSelectedDate] = useState(null);
  // const { batchData } = useContext(BatchContext);
  const [joinDate, setJoinDate] = useState(null); // Initialize joinDate state
  const [studentName, setStudentName] = useState({
    firstName: '',
    lastName: '',
    startDate: '',
    batchstartDate: '',
    endDate: '',
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`${APP}/api/student/username/${username}`);
        console.log(response.data.startDate)
        setStudentName(response.data);
        const joining = new Date(response.data.startDate);
         joining.setDate(joining.getDate() - 1);
        setJoinDate(joining.toISOString()); // Set joinDate from fetched data
      } catch (error) {
        console.error('Failed to fetch student details:', error);
      }
    };

    if (username) {
      fetchStudentData();
    }
  }, [username]);


  const fullName = `${studentName.firstName} ${studentName.lastName}`;
  const date = `${studentName.batchstartDate}`
  const joiningdate = `${studentName.startDate}`
  
   const clickableRange = joinDate
    ? {
        start: new Date(new Date(studentName.batchstartDate).setDate(new Date(studentName.batchstartDate).getDate() - 1)),
       end: new Date(studentName.endDate),
      }
    : null;


  return (
    <div>
      <Nav studentName={fullName} panelType="student" />
      <div style={{display:"flex", flexWrap:"wrap"}}>
      <Calendar isAdmin={false} batchStartDate={date} joiningDate={joiningdate} showDemoClasses={false} clickableRange={clickableRange}/>
        <Scroll showbar={false} />
        </div>
    </div>
  );
};

export default Scheduler;
