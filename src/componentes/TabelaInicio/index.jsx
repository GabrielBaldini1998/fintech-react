import { useState, useMemo } from 'react';
import './tabelainicio.css';
import dadosTransacoes from './transacoes.json';
import Busca from './Busca';

const TabelaInicio = () => {
    const [termoBusca, setTermoBusca] = useState('');

    const transacoesFiltradas = useMemo(() => {
        if (!termoBusca.trim()) {
            return dadosTransacoes;
        }

        const termo = termoBusca.toLowerCase().trim();
        return dadosTransacoes.filter((item) => {
            return (
                item.descricao.toLowerCase().includes(termo) ||
                item.categoria.toLowerCase().includes(termo) ||
                item.data.toLowerCase().includes(termo) ||
                item.status.toLowerCase().includes(termo)
            );
        });
    }, [termoBusca]);

    const handleSearch = (termo) => {
        setTermoBusca(termo);
    };

    return (
        <>
        <div className="container-fluid p-4">
            <h2 className="mb-4 text-dark fs-4"> Últimas movimentações </h2>
        </div>
        
            <Busca onSearch={handleSearch} />
            <div className="table-responsive shadow-sm rounded">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light text-secondary">
                        <tr>
                            <th className="ps-4">Data</th>
                            <th>Descrição</th>
                            <th>Categoria</th>
                            <th>Valor</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transacoesFiltradas.length > 0 ? (
                            transacoesFiltradas.map((item) => (
                                <tr key={item.id}>
                                    <td className="ps-4">{item.data}</td>
                                    <td className="fw-bold">{item.descricao}</td>
                                    <td>{item.categoria}</td>
                                    <td className={item.valor > 0 ? "text-success" : "text-danger"}>
                                        {item.valor > 0 ? `+ ` : `- `}
                                        {/* Formata o número para o padrão de moeda brasileiro */}
                                        {Math.abs(item.valor).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        })}
                                    </td>
                                    <td>
                                        <span className={`badge rounded-pill ${item.valor > 0 ? "bg-success-subtle text-success" : "bg-primary-subtle text-primary"
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="text-center fw-light text-muted no-results-message" colSpan="5">
                                    Nenhuma transação encontrada
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="text-center fw-light text-muted" colSpan="5" style={{ fontSize: '0.85rem' }}>
                                Dados atualizados em tempo real
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
};

export default TabelaInicio;