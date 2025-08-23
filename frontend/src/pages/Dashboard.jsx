import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import '../styles/dashboard.css';

// Icons
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;


const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    //
    // NOTE: You'll need to connect this to your actual user data from your Redux store
    const { user } = useSelector((state) => state.user);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const displayUser = user || {
        name: 'Chetram',
        posts: Array(5).fill(null),
        aiCredits: 12,
        aiImageCredits: 8,
    };


    return (
        <div className="dashboard-layout">
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">wrAIte</div>
                    <button className="sidebar-close-btn" onClick={toggleSidebar}>
                        <CloseIcon />
                    </button>
                </div>
                <nav className="sidebar-nav">
                    {/* Add sidebar icons here */}
                </nav>
                <div className="sidebar-footer">
                    {/* Add footer icons here */}
                </div>
            </aside>
            <div className="main-content">
                <header className="dashboard-header">
                    <div className="header-title">
                        <h1>Dashboard</h1>
                        <p>Welcome back, {displayUser.name}!</p>
                    </div>
                    <div className="header-actions">
                        <button className="icon-button"><SearchIcon /></button>
                        <button className="icon-button"><BellIcon /></button>
                        <img src="https://i.pravatar.cc/40" alt="User Avatar" className="user-avatar" />
                        <button className="mobile-menu-btn" onClick={toggleSidebar}>
                            <MenuIcon />
                        </button>
                    </div>
                </header>
                <main className="dashboard-grid">
                    <div className="card card-tall">
                        <div className="card-content">
                            <span className="card-value">{displayUser.posts.length}</span>
                            <span className="card-label">Total Posts</span>
                            <span className="card-sublabel">Manage and review your content</span>
                        </div>
                        <div className="card-content dark">
                            <span className="card-value">{displayUser.aiCredits}</span>
                            <span className="card-label">AI Credits</span>
                            <span className="card-sublabel">Text generation credits remaining</span>
                        </div>
                    </div>
                    <div className="card">
                        <h3 className="card-title">AI Image Credits</h3>
                        <div className="card-main-stat">
                            <span className="card-value">{displayUser.aiImageCredits}</span>
                            <div className="card-trend">
                                <span>-10%</span>
                                <span>since last day</span>
                            </div>
                        </div>
                        <div className="progress-bar">
                            <div className="progress" style={{ width: `${displayUser.aiImageCredits / 10 * 100}%` }}></div>
                        </div>
                    </div>
                    <div className="card">
                        <h3 className="card-title">Dummy Content</h3>
                        <div className="card-main-stat">
                            <span className="card-value">38</span>
                            <div className="card-trend">
                                <span>+10%</span>
                                <span>since last day</span>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="dot-grid">
                            {Array.from({ length: 24 }).map((_, i) => (
                                <span key={i} className={`dot ${i > 15 ? 'dot-accent' : ''}`}></span>
                            ))}
                        </div>
                    </div>
                    <div className="card">
                        <h3 className="card-title">Dummy Content</h3>
                        <div className="card-main-stat">
                            <span className="card-value">65</span>
                            <div className="card-trend">
                                <span>-12%</span>
                                <span>since last day</span>
                            </div>
                        </div>
                        <div className="bar-chart">
                            <div className="bar" style={{ height: '60%' }}></div>
                            <div className="bar" style={{ height: '80%' }}></div>
                            <div className="bar accent-bar" style={{ height: '40%' }}><span>20</span></div>
                            <div className="bar" style={{ height: '70%' }}></div>
                            <div className="bar" style={{ height: '55%' }}></div>
                        </div>
                    </div>
                    <div className="card accent-card">
                        <h2>Ready to create something new?</h2>
                        <p>Use your AI credits to generate a new post.</p>
                        <button className="create-post-btn">Create New Post</button>
                    </div>
                    <div className="card circle-card">
                        <div className="progress-circle">
                             <span className="circle-value">20</span>
                        </div>
                        <p>The largest part of all cases in Prodsup class</p>
                    </div>
                     <div className="card">
                        <h3 className="card-title">Dummy Content</h3>
                        <div className="card-main-stat">
                            <span className="card-value">16</span>
                            <div className="card-trend">
                                <span>-10%</span>
                                <span>since last day</span>
                            </div>
                        </div>
                         <div className="bar-chart short-chart">
                            <div className="bar" style={{ height: '50%' }}></div>
                            <div className="bar accent-bar" style={{ height: '30%' }}></div>
                            <div className="bar" style={{ height: '20%' }}></div>
                        </div>
                    </div>
                    <div className="card dark-card">
                        <h3>Create your custom dashboard</h3>
                        <button className="add-button">+</button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;