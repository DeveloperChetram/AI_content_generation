
import '../styles/Home.css';
import Background from '../components/Background';

const Home = () => {
  return (
    <div className="home-container">
      {/* Animated background bars */}

      <Background />

      {/* --- Hero Section --- */}
      <main className="hero-section">
        {/* ... content remains the same ... */}
        <h1 className="hero-headline">
        <span className='hero-headine-first'>Don't write</span> <br /> <span  className='hero-headine-second'>It's AI era</span>
        </h1>
        <p className="hero-subheading">
          Be the first to know when we launch.
          Join the waitlist and get exclusive early access.
        </p>
        <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter Your Email"
            className="cta-input"
            aria-label="Email for waitlist"
          />
          <button type="submit" className="cta-button">
            Join The Waitlist
          </button>
        </form>
        <div className="social-links">
          <a href="#" className="social-link" aria-label="Social Link 1">o</a>
          <a href="#" className="social-link" aria-label="Social Link 2">x</a>
          <a href="#" className="social-link" aria-label="Social Link 3">in</a>
        </div>
      </main>
    </div>
  );
};

export default Home;