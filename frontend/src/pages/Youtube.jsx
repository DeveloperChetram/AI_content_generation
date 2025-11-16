import '../styles/Youtube.css';

// A YouTube-like About section style, without like/comment/subscribe UI
const Youtube = () => {
  return (
    <div className="page-container">
      <section className="yt-channel-header">
        <div className="yt-banner" />
        <div className="yt-channel-meta">
          <div className="yt-avatar" />
          <div className="yt-channel-info">
            <h1 className="yt-title">wrAIte Studio</h1>
            <p className="yt-subtitle">AI Content • Writing Tools • Creator Workflows</p>
            <div className="yt-stats-row">
              <span>Videos 120</span>
              <span>Views 1.2M</span>
              <span>Joined 2024</span>
            </div>
          </div>
        </div>
      </section>

      <section className="yt-about-section">
        <h2>About</h2>
        <div className="yt-about-card">
          <p>
            wrAIte Studio shares tips, demos, and deep-dives into AI-first content creation.
            Learn how to ideate, draft, and polish faster—without losing your voice.
          </p>
          <div className="yt-meta-block">
            <div>
              <h4>Details</h4>
              <ul>
                <li>Country: Global</li>
                <li>Business: wrAIte Labs</li>
                <li>Category: Education / Tools</li>
              </ul>
            </div>
            <div>
              <h4>Links</h4>
              <ul className="yt-links">
                <li><a href="/about">About wrAIte</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Youtube;


