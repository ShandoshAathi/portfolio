const Hero = () => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero">
      <p className="hero-label">Hello, I'm</p>
      <h1 className="hero-title">ATHIKESAVAN S</h1>
      <p className="hero-subtitle">
        Artificial Intelligence &amp; Data Science Engineer&nbsp;|&nbsp;Python Programmer
      </p>
      <div className="hero-buttons">
        <a href="mailto:shandosh6381aathi@gmail.com" className="btn-primary">
          Hire Me
        </a>
        <button className="btn-outline" onClick={() => scrollTo('projects')}>
          View Projects
        </button>
      </div>

      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
};

export default Hero;
