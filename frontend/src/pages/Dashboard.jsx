import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/dashboard.css'; // Import the CSS file directly
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;


const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;

const Dashboard = () => {
    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">ERP</div>
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
                        <p>Support Manaher</p>
                    </div>
                    <div className="header-actions">
                        <button className="icon-button"><SearchIcon /></button>
                        <button className="icon-button"><BellIcon /></button>
                        <img src="https://i.pravatar.cc/40" alt="User Avatar" className="user-avatar" />
                    </div>
                </header>
                <main className="dashboard-grid">
                    <div className="card card-tall">
                        <div className="card-content">
                            <span className="card-value">82</span>
                            <span className="card-label">all open cases</span>
                            <span className="card-sublabel">23 overdue</span>
                        </div>
                        <div className="card-content dark">
                            <span className="card-value">10</span>
                            <span className="card-label">unassigned cases</span>
                            <span className="card-sublabel">12% of open</span>
                        </div>
                    </div>
                    <div className="card">
                        <h3 className="card-title">Incoming case load</h3>
                        <div className="card-main-stat">
                            <span className="card-value">27</span>
                            <div className="card-trend">
                                <span>-90%</span>
                                <span>since last day</span>
                            </div>
                        </div>
                        <div className="progress-bar">
                            <div className="progress" style={{ width: '70%' }}></div>
                        </div>
                    </div>
                    <div className="card">
                        <h3 className="card-title">Resolved cases by owner</h3>
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
                        <h3 className="card-title">Open cases by customer</h3>
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
                        <h2>It will change the way you manage your business</h2>
                        <p>Just start using ERP</p>
                    </div>
                    <div className="card circle-card">
                        <div className="progress-circle">
                             <span className="circle-value">20</span>
                        </div>
                        <p>The largest part of all cases in Prodsup class</p>
                    </div>
                     <div className="card">
                        <h3 className="card-title">High priority cases</h3>
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
