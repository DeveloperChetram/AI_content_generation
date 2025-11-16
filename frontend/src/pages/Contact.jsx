import { useState } from 'react';
import '../styles/Contact.css';
import { FiMail, FiMapPin, FiTwitter, FiGithub, FiLinkedin } from 'react-icons/fi';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || '';

const Contact = () => {
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append('access_key', ACCESS_KEY);

    if (!ACCESS_KEY) {
      setStatus({ state: 'error', message: 'Web3Forms key missing. Set VITE_WEB3FORMS_KEY.' });
      return;
    }

    setStatus({ state: 'submitting', message: 'Sending…' });
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ state: 'success', message: 'Thanks! We’ll reply soon.' });
        form.reset();
      } else {
        setStatus({ state: 'error', message: data.message || 'Failed to send. Try again.' });
      }
    } catch (err) {
      setStatus({ state: 'error', message: 'Network error. Please try again.' });
    }
  };

  return (
    <div className="page-container">
      <section className="contact-hero">
        <h1 className="page-title">Contact</h1>
        <p className="page-subtitle">Say hello—collabs, feedback, or support.</p>
      </section>

      <section className="contact-grid">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" placeholder="Your name" required />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="subject">Subject</label>
            <input id="subject" name="subject" type="text" placeholder="How can we help?" required />
          </div>
          <div className="form-field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="6" placeholder="Write your message…" required />
          </div>
          <button disabled={status.state === 'submitting'} className="btn btn-primary" type="submit">
            {status.state === 'submitting' ? 'Sending…' : 'Send message'}
          </button>
          {status.message && (
            <p className={`form-status ${status.state}`}>{status.message}</p>
          )}
        </form>

        <aside className="contact-aside">
          <div className="aside-card">
            <h3>Reach us</h3>
            <p><FiMail /> patelchetram49@gmail.com</p>
            <p><FiMapPin /> Damoh • Madhya Pradesh</p>
          </div>
          <div className="aside-card">
            <h3>Social</h3>
            <div className="social-row">
              <a className="social-pill" href="https://x.com/Chetrampatel7" target="_blank" rel="noreferrer">
                <FiTwitter /> X
              </a>
              <a className="social-pill" href="https://github.com/developerchetram" target="_blank" rel="noreferrer">
                <FiGithub /> GitHub
              </a>
              <a className="social-pill" href="https://linkedin.com/in/developerchetram" target="_blank" rel="noreferrer">
                <FiLinkedin /> LinkedIn
              </a>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default Contact;


