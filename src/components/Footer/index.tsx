import './Footer.css';

const Footer = () => (
  <footer>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
      <span>© {new Date().getFullYear()} FINTECH. Todos os direitos reservados.</span>
      <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <i className="bi bi-github fs-6" />
      </a>
    </div>
  </footer>
);

export default Footer;
