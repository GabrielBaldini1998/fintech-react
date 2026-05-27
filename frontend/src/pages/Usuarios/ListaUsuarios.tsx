import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Pencil, RefreshCw, Users } from 'lucide-react';
import PageHeader from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import type { Usuario } from '@/types/finance';
import { getUsuarios, deleteUsuario } from '@/services/usuarioService';
import { formatDate } from '@/utils/formatters';
import SectionCard from '@/components/ui/SectionCard';
import StatCard from '@/components/ui/StatCard';

const ListaUsuarios = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getUsuarios()
      .then(setUsuarios)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: number, nome: string) => {
    if (id === session?.usuario.idUsuario) {
      alert('Você não pode excluir o próprio usuário logado.');
      return;
    }
    if (!window.confirm(`Excluir o usuário "${nome}"?`)) return;
    try {
      await deleteUsuario(id);
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir.');
    }
  };

  const cpfCount  = usuarios.filter(u => u.tpTipo === 'CPF').length;
  const cnpjCount = usuarios.filter(u => u.tpTipo === 'CNPJ').length;

  return (
    <>
      <PageHeader title="Usuários" subtitle="Gerenciamento de contas" />

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <StatCard label="Total de Usuários" value={String(usuarios.length)} icon={<Users size={18} />} color="blue" />
          <StatCard label="Pessoas Físicas (CPF)"    value={String(cpfCount)}     icon={<Users size={18} />} color="green" />
          <StatCard label="Pessoas Jurídicas (CNPJ)" value={String(cnpjCount)}    icon={<Users size={18} />} color="yellow" />
        </div>

        <SectionCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--ft-text)' }}>
                Usuários cadastrados
              </h3>
              {!loading && (
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px',
                  borderRadius: 'var(--ft-radius-full)', background: 'var(--ft-blue-dim)', color: 'var(--ft-blue)',
                }}>
                  {usuarios.length}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={load} disabled={loading} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.375rem 0.75rem', borderRadius: 'var(--ft-radius-md)',
                border: '1px solid var(--ft-border)', background: 'transparent',
                color: 'var(--ft-text-muted)', cursor: 'pointer', fontSize: '0.78rem',
              }}>
                <RefreshCw size={13} />
              </button>
              <button onClick={() => navigate('/usuarios/novo')} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.5rem 0.875rem', borderRadius: 'var(--ft-radius-md)',
                border: 'none', background: 'var(--ft-gradient-primary)',
                color: '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
              }}>
                <Plus size={14} /> Novo
              </button>
            </div>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ft-text-muted)' }}>
              Carregando...
            </div>
          )}
          {error && (
            <div style={{
              padding: '0.75rem 1rem', borderRadius: 'var(--ft-radius-md)',
              background: 'var(--ft-red-dim)', color: 'var(--ft-red)',
              border: '1px solid rgba(239,68,68,0.3)', marginBottom: '1rem',
            }}>
              {error}
            </div>
          )}
          {!loading && !error && usuarios.length === 0 && (
            <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--ft-text-muted)', fontSize: '0.875rem' }}>
              Nenhum usuário cadastrado.
            </p>
          )}

          {!loading && !error && usuarios.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--ft-border)' }}>
                    {['#', 'Nome', 'E-mail', 'Tipo', 'Documento', 'Nascimento', 'Ações'].map(h => (
                      <th key={h} style={{
                        padding: '0.625rem 0.75rem', textAlign: 'left',
                        fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em',
                        textTransform: 'uppercase', color: 'var(--ft-text-muted)',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.idUsuario} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.75rem', color: 'var(--ft-text-muted)', fontSize: '0.78rem' }}>
                        {u.idUsuario}
                        {u.idUsuario === session?.usuario.idUsuario && (
                          <span style={{
                            marginLeft: '0.375rem', fontSize: '0.65rem', fontWeight: 700,
                            padding: '1px 6px', borderRadius: 'var(--ft-radius-full)',
                            background: 'var(--ft-amber-dim)', color: 'var(--ft-amber)',
                          }}>você</span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--ft-text)', fontWeight: 500 }}>
                        {u.nmCompleto}
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--ft-text-muted)', fontSize: '0.82rem' }}>
                        {u.dsEmail}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px',
                          borderRadius: 'var(--ft-radius-full)',
                          background: u.tpTipo === 'CPF' ? 'var(--ft-blue-dim)' : 'var(--ft-amber-dim)',
                          color: u.tpTipo === 'CPF' ? 'var(--ft-blue)' : 'var(--ft-amber)',
                        }}>
                          {u.tpTipo}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--ft-text-muted)', fontSize: '0.82rem' }}>
                        {u.nmDocumento}
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--ft-text-muted)', fontSize: '0.82rem' }}>
                        {u.dtNascimento ? formatDate(u.dtNascimento) : '—'}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => navigate(`/usuarios/${u.idUsuario}`)} style={{
                            padding: '0.375rem 0.625rem', borderRadius: 'var(--ft-radius-sm)',
                            border: '1px solid var(--ft-border)', background: 'transparent',
                            color: 'var(--ft-text-muted)', cursor: 'pointer',
                          }} title="Editar">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(u.idUsuario, u.nmCompleto)} style={{
                            padding: '0.375rem 0.625rem', borderRadius: 'var(--ft-radius-sm)',
                            border: '1px solid rgba(239,68,68,0.3)', background: 'var(--ft-red-dim)',
                            color: 'var(--ft-red)', cursor: 'pointer',
                          }} title="Excluir">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>
    </>
  );
};

export default ListaUsuarios;
