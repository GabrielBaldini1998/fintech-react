import './Footer.css';

const Footer = () => (
  <footer className="footer bg-white border-top py-3">
    <div className="container-fluid px-4">
      <div className="row align-items-center">
        <div className="col-md-6 text-center text-md-start">
          <span className="text-muted small">
            &copy; {new Date().getFullYear()} Fintech. Todos os direitos reservados.
          </span>
        </div>
        <div className="col-md-6 text-center text-md-end">
          <a
            href="https://github.com"
            className="text-muted me-3"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <i className="bi bi-github fs-5"></i>
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
