import { useState } from 'react';

const Busca = ({ onSearch }) => {
    const [termoBusca, setTermoBusca] = useState('');

    const handleChange = (e) => {
        const valor = e.target.value;
        setTermoBusca(valor);
        onSearch(valor);
    };

    const handleClear = () => {
        setTermoBusca('');
        onSearch('');
    };

    return (
        <div className="table-filter">
            <div className={`input-group ${termoBusca ? 'has-value' : ''}`}>
                <span className="input-group-text">
                    <i className="bi bi-search"></i>
                </span>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar transações..."
                    value={termoBusca}
                    onChange={handleChange}
                />
                {termoBusca && (
                    <button
                        className="btn"
                        type="button"
                        onClick={handleClear}
                        aria-label="Limpar busca"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Busca;

