import { useEffect, useRef } from 'react';

const projects = [
  {
    tags: ['Python', 'NLP', 'AI'],
    name: 'AI Chatbot Assistant',
    desc: 'An intelligent conversational AI built with Python and NLP techniques, capable of understanding context and providing relevant responses.',
    link: 'https://github.com/ShandoshAathi',
  },
  {
    tags: ['Python', 'Pandas', 'Visualization'],
    name: 'Sales Data Dashboard',
    desc: 'Interactive data visualization dashboard for analyzing sales trends, built with Python, Pandas, and Matplotlib for actionable business insights.',
    link: 'https://github.com/ShandoshAathi',
  },
  {
    tags: ['Deep Learning', 'TensorFlow', 'CNN'],
    name: 'Image Classification Model',
    desc: 'A convolutional neural network model trained to classify images with high accuracy using TensorFlow and transfer learning techniques.',
    link: 'https://github.com/ShandoshAathi',
  },
  {
    tags: ['Python', 'BeautifulSoup', 'Automation'],
    name: 'Web Scraping Automation',
    desc: 'Automated web scraping pipeline using Python and BeautifulSoup to extract, clean, and store structured data from multiple sources.',
    link: 'https://github.com/ShandoshAathi',
  },
];

const Projects = () => {
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
    <section className="section projects" id="projects" ref={ref}>
      <div className="container">
        <div className="projects-header animate-on-scroll">
          <span className="section-label">My Work</span>
          <h2 className="section-title" style={{ marginTop: '0.5rem' }}>Featured Projects</h2>
        </div>

        <div className="projects-grid">
          {projects.map((proj, i) => (
            <div
              className="project-card animate-on-scroll"
              key={proj.name}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="project-tags">
                {proj.tags.map((t) => (
                  <span className="project-tag" key={t}>{t}</span>
                ))}
              </div>
              <h3 className="project-name">{proj.name}</h3>
              <p className="project-desc">{proj.desc}</p>
              <a href={proj.link} target="_blank" rel="noreferrer" className="project-link">
                View Code
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15,3 21,3 21,9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
