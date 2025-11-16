import '../styles/About.css';

const About = () => {
  return (
    <div className="page-container">
      <section className="about-hero">
        <h1 className="page-title">About wrAIte</h1>
        <p className="page-subtitle">
          Craft smarter, faster content with AI-assisted tools designed for creators and teams.
        </p>
      </section>

      <section className="about-grid">
        <div className="about-card">
          <h2>Our Mission</h2>
          <p>
            We help you move from blank page to publish-ready. wrAIte blends thoughtful UI with powerful
            AI so you can focus on ideas, not boilerplate.
          </p>
        </div>
        <div className="about-card">
          <h2>What We Built</h2>
          <p>
            Drafts, outlines, formatting, and visual polish—integrated into your workflow. Share, iterate,
            and publish without context switching.
          </p>
        </div>
        <div className="about-card">
          <h2>Why Now</h2>
          <p>
            The AI era rewards speed and clarity. We make high-quality content production accessible to everyone.
          </p>
        </div>
      </section>

      <section className="about-footer-cta">
        <a className="btn btn-primary" href="/contact">Get in touch</a>
      </section>
    </div>
  );
};

export default About;


