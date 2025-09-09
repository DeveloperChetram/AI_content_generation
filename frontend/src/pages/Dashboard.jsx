import React from 'react';
import '../styles/theme.css'; // Import theme variables
import '../styles/Dashboard.css'; // Import component-specific styles
import { FiSearch, FiBell } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { addAlert } from '../redux/slices/alertSlice';
import { useNavigate } from 'react-router-dom';

// --- Main Dashboard Component ---
const Dashboard = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    console.log("user in dashboard", user)
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

    const createNewPostHandler = () => {
        dispatch(addAlert(
            {
                type:"info",
                content:"Redirecting to playground...",
                duration:5000
            }
        ))
        navigate('/playground');
        dispatch(addAlert(
            {
                type:"success",
                content:"Redirected to playground...",
                duration:5000
            }
        ))
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <header className="dashboard-header">
                    <div className="header-greeting">
                        <h1 className="header-title">Dashboard</h1>
                        <p className="header-subtitle">Welcome back, {user.user.name}!</p>
                    </div>
                    <div className="header-actions">
                        <button className="icon-button">
                            <FiSearch className="icon" />
                        </button>
                        <button className="icon-button">
                            <FiBell className="icon" />
                        </button>
                        <img src={userData.avatarUrl} alt="User profile" className="user-avatar" />
                    </div>
                </header>

                <main className="dashboard-grid">
                    {/* --- Stat Cards --- */}
                    <div className="card">
                        <span className="card-label">AI Text Generation Credits</span>
                        <p className="card-value">{user?.user?.aiCredits}</p>
                        <span className="card-sublabel">credits remaining</span>
                    </div>

                    <div className="card">
                        <span className="card-label">AI Photo Generation Credits</span>
                        <p className="card-value">{user?.user?.aiImageCredits}</p>
                        <span className="card-sublabel">credits remaining</span>
                    </div>

                    <div className="card">
                        <span className="card-label">Total Posts</span>
                        <p className="card-value">{user?.user?.posts?.length}</p>
                    </div>

                    {/* --- CTA Card --- */}
                    <div className="card cta-card">
                        <h2 className="cta-title">Ready to create something new?</h2>
                        <p className="cta-subtitle">Use your AI credits to generate a new post.</p>
                        <button className="cta-button" onClick={()=>{createNewPostHandler()}}>Generate New Post</button>
                    </div>

                    {/* --- Recent Posts Card --- */}
                    <div className="card recent-posts-card">
                        <div className="card-header">
                            <h3 className="card-title">Recent Posts</h3>
                            <a href="#" className="card-link">View all posts</a>
                        </div>
                        <div className="recent-posts-list">
                            {user?.user?.posts?.length > 0 ? (
                                user.user.posts.slice(0, 5).map((post, index) => (
                                    <div key={post._id || index} className="post-item">
                                        <p className="post-title">{post.title}</p>
                                        <span className="post-time">Recently created</span>
                                    </div>
                                ))
                            ) : (
                                <div className="post-item">
                                    <p className="post-title">No posts yet</p>
                                    <span className="post-time">Create your first post!</span>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;