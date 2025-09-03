import React from 'react';
import '../styles/theme.css'; // Import theme variables
import '../styles/Dashboard.css'; // Import component-specific styles

// --- Icon Components ---
// Using inline SVGs is a common and efficient practice in React
const SearchIcon = () => (
    <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const BellIcon = () => (
    <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);


// --- Main Dashboard Component ---
const Dashboard = () => {
    // Dummy data - in a real app, this would come from props, state, or a Redux store
    const userData = {
        name: 'Chetram',
        avatarUrl: 'https://i.pravatar.cc/40', // Placeholder image
        stats: {
            textCredits: 150,
            imageCredits: 75,
            totalPosts: 28,
        },
        recentPosts: [
            { id: 1, title: 'The Future of AI in Content Creation', time: '2 hours ago' },
            { id: 2, title: 'How to Optimize Your Website for Voice Search', time: '1 day ago' },
            { id: 3, title: '10 Tips for Writing Engaging Blog Posts', time: '3 days ago' },
        ],
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <header className="dashboard-header">
                    <div className="header-greeting">
                        <h1 className="header-title">Dashboard</h1>
                        <p className="header-subtitle">Welcome back, {userData.name}!</p>
                    </div>
                    <div className="header-actions">
                        <button className="icon-button"><SearchIcon /></button>
                        <button className="icon-button"><BellIcon /></button>
                        <img src={userData.avatarUrl} alt="User profile" className="user-avatar" />
                    </div>
                </header>

                <main className="dashboard-grid">
                    {/* --- Stat Cards --- */}
                    <div className="card">
                        <span className="card-label">AI Text Generation Credits</span>
                        <p className="card-value">{userData.stats.textCredits}</p>
                        <span className="card-sublabel">credits remaining</span>
                    </div>

                    <div className="card">
                        <span className="card-label">AI Photo Generation Credits</span>
                        <p className="card-value">{userData.stats.imageCredits}</p>
                        <span className="card-sublabel">credits remaining</span>
                    </div>

                    <div className="card">
                        <span className="card-label">Total Posts</span>
                        <p className="card-value">{userData.stats.totalPosts}</p>
                    </div>

                    {/* --- CTA Card --- */}
                    <div className="card cta-card">
                        <h2 className="cta-title">Ready to create something new?</h2>
                        <p className="cta-subtitle">Use your AI credits to generate a new post.</p>
                        <button className="cta-button">Generate New Post</button>
                    </div>

                    {/* --- Recent Posts Card --- */}
                    <div className="card recent-posts-card">
                        <div className="card-header">
                            <h3 className="card-title">Recent Posts</h3>
                            <a href="#" className="card-link">View all posts</a>
                        </div>
                        <div className="recent-posts-list">
                            {userData.recentPosts.map((post) => (
                                <div key={post.id} className="post-item">
                                    <p className="post-title">{post.title}</p>
                                    <span className="post-time">{post.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;