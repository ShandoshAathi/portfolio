import { useState } from 'react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <a href="#hero" className="navbar-logo" onClick={() => scrollTo('hero')}>
          <span className="logo-white">ATHIKE</span>
          <span className="logo-purple">SAVAN</span>
        </a>

        <ul className="navbar-links">
          {['about', 'services', 'projects', 'contact'].map((item) => (
            <li key={item}>
              <a href={`#${item}`} onClick={(e) => { e.preventDefault(); scrollTo(item); }}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="mailto:shandosh6381aathi@gmail.com"
          className="btn-hire"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          Hire Me
        </a>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none', transition: 'all 0.3s' }} />
          <span style={{ opacity: menuOpen ? 0 : 1, transition: 'all 0.3s' }} />
          <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none', transition: 'all 0.3s' }} />
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {['about', 'services', 'projects', 'contact'].map((item) => (
          <a key={item} href={`#${item}`} onClick={(e) => { e.preventDefault(); scrollTo(item); }}>
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </a>
        ))}
        <a href="mailto:shandosh6381aathi@gmail.com" className="btn-hire" style={{ textAlign: 'center' }}>
          Hire Me
        </a>
      </div>
    </>
  );
};

export default Navbar;
