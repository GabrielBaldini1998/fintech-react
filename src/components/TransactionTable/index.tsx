import { useState, useCallback } from 'react';
import { useTransactions } from '@/services/financeService';
import { useTransactionSearch } from '@/hooks/useTransactionSearch';
import { formatCurrencyAbs } from '@/utils/formatters';
import SearchInput from './SearchInput';
import './TransactionTable.css';

const TransactionTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: transactions = [], isLoading, isError } = useTransactions();
  const filtered = useTransactionSearch(transactions, searchTerm);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  if (isLoading) {
    return <div className="text-center py-4 text-muted">Carregando transações...</div>;
  }

  if (isError) {
    return (
      <div className="alert alert-danger" role="alert">
        Erro ao carregar transações.
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid p-4">
        <h2 className="mb-4 text-dark fs-4">Últimas movimentações</h2>
      </div>
      <SearchInput value={searchTerm} onChange={handleSearch} />
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light text-secondary">
            <tr>
              <th className="ps-4" scope="col">Data</th>
              <th scope="col">Descrição</th>
              <th scope="col">Categoria</th>
              <th scope="col">Valor</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr key={item.id}>
                  <td className="ps-4">{item.data}</td>
                  <td className="fw-bold">{item.descricao}</td>
                  <td>{item.categoria}</td>
                  <td className={item.valor > 0 ? 'text-success' : 'text-danger'}>
                    {item.valor > 0 ? '+ ' : '- '}
                    {formatCurrencyAbs(item.valor)}
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill ${
                        item.valor > 0
                          ? 'bg-success-subtle text-success'
                          : 'bg-primary-subtle text-primary'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center fw-light text-muted no-results-message" colSpan={5}>
                  Nenhuma transação encontrada
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td
                className="text-center fw-light text-muted"
                colSpan={5}
                style={{ fontSize: '0.85rem' }}
              >
                Dados atualizados em tempo real
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};

export default TransactionTable;
