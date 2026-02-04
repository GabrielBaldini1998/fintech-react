import './Footer.css';

const Footer = () => {
    return (
        <footer>
            <div className="container text-center">
                <p className="mb-1 fw-bold">Fintech &copy; 2026</p>
                <p>Desenvolvido por <a href="https://github.com/GabrielBaldini1998" target="_blank" rel="noopener noreferrer">Gabriel Baldini</a></p>
                <p>Simplificando sua vida financeira.</p>
                <div>
                    <a href="#" className="text-white me-3 text-decoration-none">
                        <i className="bi bi-instagram"></i>
                    </a>
                    <a href="#" className="text-white me-3 text-decoration-none">
                        <i className="bi bi-linkedin"></i>
                    </a>
                    <a href="#" className="text-white text-decoration-none">
                        <i className="bi bi-envelope"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;