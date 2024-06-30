import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import Login from './components/login';
import Home from './Home';
import BatchDetail from './sidebarSection/BatchDetail';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import StudentLogin from './Student/StudentLogin';
import StudentFee from './feeManagement/StudentFee';
import AllStudentFee from './feeManagement/AllStudentFee';
import ScheduleHome from './Scheduler/SchedulerHome';
import { DateProvider } from './SchedulerComponents/DateContext';
import { StudentProvider } from './ContextApi/StudentContext';
import { UserProvider } from './ContextApi/UserContext';
import Scheduler from './StudentComponents/Scheduler';
import { BatchProvider } from './ContextApi/BatchContext';

const StudentFeeWrapper = () => {
    const { studentId } = useParams();
    return (
        <StudentProvider studentId={studentId}>
            <StudentFee />
        </StudentProvider>
    );
};

const AllStudentFeeWrapper = () => {
    const { batchId } = useParams();
    return <AllStudentFee batchId={batchId} />;
};

const App = () => {
    return (
        <UserProvider>
            <BatchProvider>
                <DateProvider>
                    <Routes>
                        <Route path="/" element={<StudentLogin />} />
                        <Route path="/fee-management/student/:studentId" element={<StudentFeeWrapper />} />
                        <Route path="/fee-management/:batchId" element={<AllStudentFeeWrapper />} />
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
};

export default App;
