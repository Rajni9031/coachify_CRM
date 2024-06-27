import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

const Home = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header title="Admin Panel" showNotifications={false} />
            <div style={{ display: 'flex', flex: '1' }}>
                <Sidebar style={{ flexShrink: 0 }} />
                <div style={{ marginTop: '10vh', marginLeft: '20vw' }}>
                    <Dashboard />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Home;
