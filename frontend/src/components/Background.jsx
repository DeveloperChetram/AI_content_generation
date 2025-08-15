import '../styles/Home.css';

const Background = ({ animationType }) => {
  // Conditionally apply the animation class
  const containerClass = `background-bars ${animationType ? `${animationType}-animation` : ''}`;

  return (
    <div className={containerClass}>
      <div className="bar" style={{ animationDelay: '0s' }}></div>
      <div className="bar" style={{ animationDelay: '0.2s' }}></div>
      <div className="bar" style={{ animationDelay: '0.4s' }}></div>
      <div className="bar" style={{ animationDelay: '0.6s' }}></div>
      <div className="bar" style={{ animationDelay: '0.8s' }}></div>
      <div className="bar" style={{ animationDelay: '1s' }}></div>
      <div className="bar" style={{ animationDelay: '0.1s' }}></div>
      <div className="bar" style={{ animationDelay: '0.3s' }}></div>
      <div className="bar" style={{ animationDelay: '0.5s' }}></div>
      <div className="bar" style={{ animationDelay: '0.7s' }}></div>
      <div className="bar" style={{ animationDelay: '0.9s' }}></div>
      <div className="bar" style={{ animationDelay: '0.1s' }}></div>
      <div className="bar" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
};

export default Background;