// App.js

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Home from './Home';
import BatchDetail from './sidebarSection/BatchDetail';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import StudentLogin from './Student/StudentLogin';
import StudentFee from './feeManagement/StudentFee';
import ScheduleHome from './Scheduler/SchedulerHome';
import { DateProvider } from './SchedulerComponents/DateContext';
import { UserProvider } from './ContextApi/UserContext';
// import { UserProvider } from './ContextApi//UserContext'; // Import UserProvider
import Scheduler from './StudentComponents/Scheduler';
import { BatchProvider } from './ContextApi/BatchContext';

const App = () => {
  return (
    <UserProvider>
    <BatchProvider> {/* Wrap your Routes with UserProvider */}
      <DateProvider> {/* Wrap your Routes with DateProvider */}
        <Routes>
          <Route path="/" element={<StudentLogin />} />
            {/* <Route path="/:username" element={<StudentHome />} /> */}
            <Route path="/fee-management/:enrollmentNo" element={<StudentFee/>} /> 
          <Route path="/:username/:batchId" element={<Scheduler />} />
          <Route path="/admin" element={<Login />} />
          <Route path="/admin/:username" element={<Home />} />
          <Route path="/BatchDetail/:batchId" element={<BatchDetail />} />
          <Route path="/schedule/:batchId" element={<ScheduleHome />} />
        </Routes>
      </DateProvider>
      </BatchProvider>
      </UserProvider>
  );
}

export default App;
