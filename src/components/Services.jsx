import { useEffect, useRef } from 'react';

const services = [
  {
    icon: '🧠',
    name: 'AI & Machine Learning',
    desc: 'Building intelligent models and systems that learn, adapt, and deliver real-world impact through advanced algorithms and deep learning.',
  },
  {
    icon: '📊',
    name: 'Data Analysis',
    desc: 'Python-based data visualization and insights extraction, turning raw datasets into compelling stories and actionable business intelligence.',
  },
  {
    icon: '</>',
    name: 'Python Programming',
    desc: 'Crafting clean, efficient code and automation scripts. From web scraping to API development — scalable solutions for complex problems.',
  },
];

const Services = () => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    const els = ref.current?.querySelectorAll('.animate-on-scroll') || [];
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section services" id="services" ref={ref}>
      <div className="container">
        <div className="services-header animate-on-scroll">
          <span className="section-label">What I Do</span>
          <h2 className="section-title" style={{ marginTop: '0.5rem' }}>My Services</h2>
        </div>

        <div className="services-grid">
          {services.map((svc, i) => (
            <div
              className="service-card animate-on-scroll"
              key={svc.name}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="service-icon">
                {svc.icon === '</>' ? (
                  <span style={{ fontFamily: 'monospace', color: '#a78bfa', fontWeight: 700, fontSize: '1rem' }}>&lt;/&gt;</span>
                ) : (
                  svc.icon
                )}
              </div>
              <h3 className="service-name">{svc.name}</h3>
              <p className="service-desc">{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
