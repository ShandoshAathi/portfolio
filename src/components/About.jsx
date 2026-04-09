import { useEffect, useRef } from 'react';

const About = () => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.15 }
    );
    const els = ref.current?.querySelectorAll('.animate-on-scroll') || [];
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const skills = ['Python', 'Machine Learning', 'Data Analysis', 'Data Visualization', 'Problem Solving', 'Adaptability'];

  const info = [
    { label: 'Education', value: 'B.Tech in AI & Data Science • Suguna College of Engineering • 2023–2027' },
    { label: 'Location', value: 'Coimbatore, India' },
    { label: 'Languages', value: 'English & Tamil (Fluent)' },
    { label: 'Focus Areas', value: 'Machine Learning, Data Visualization, Automation' },
  ];

  return (
    <section className="section about" id="about" ref={ref}>
      <div className="container">
        <div className="about-grid">
          {/* Left */}
          <div className="animate-on-scroll">
            <span className="section-label">About Me</span>
            <h2 className="section-title">
              Passionate about <span>AI</span>
              <br />&amp; <span>Data</span>
            </h2>
            <div className="about-bio">
              <p>
                Motivated AI &amp; Data Science professional with a strong foundation in Python programming,
                data analysis, and problem-solving. Passionate about leveraging AI technologies to build
                intelligent systems and extract meaningful insights from data.
              </p>
              <p>
                Currently pursuing a Bachelor's degree in Artificial Intelligence &amp; Data Science at
                Suguna College of Engineering, Coimbatore. Adaptable, analytical thinker with strong
                communication and teamwork skills.
              </p>
            </div>
            <div className="skills-badges">
              {skills.map((s) => (
                <span key={s} className="badge">{s}</span>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="animate-on-scroll" style={{ transitionDelay: '0.15s' }}>
            <div className="about-card">
              {info.map(({ label, value }) => (
                <div className="about-info-item" key={label}>
                  <div className="about-info-label">{label}</div>
                  <div className="about-info-value">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
