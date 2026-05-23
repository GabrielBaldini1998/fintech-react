import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import type { Transacao } from '@/types/finance';
import { getTransacaoById, createTransacao, updateTransacao } from '@/services/transacaoService';
import SectionCard from '@/components/ui/SectionCard';

const CATEGORIAS = ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Salário', 'Freelance', 'Investimento', 'Outros'];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.625rem 0.875rem',
  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--ft-border)',
  borderRadius: 'var(--ft-radius-md)', color: 'var(--ft-text)', fontSize: '0.875rem',
  outline: 'none', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.8rem', fontWeight: 600,
  color: 'var(--ft-text-muted)', marginBottom: '0.375rem',
};

const FormTransacao = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { session } = useAuth();
  const idUsuario = session!.usuario.idUsuario;

  const [form, setForm] = useState<Omit<Transacao, 'idTransacao'>>({
    tpTransacao: 'DESPESA',
    dsTransacao: '',
    vlTransacao: 0,
    dtTransacao: new Date().toISOString().slice(0, 10),
    categoria: 'Outros',
    idUsuario,
    idCofrinho: null,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    getTransacaoById(Number(id))
      .then(t => setForm({
        tpTransacao: t.tpTransacao,
        dsTransacao: t.dsTransacao,
        vlTransacao: t.vlTransacao,
        dtTransacao: t.dtTransacao,
        categoria: t.categoria,
        idUsuario: t.idUsuario,
        idCofrinho: t.idCofrinho ?? null,
      }))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.dsTransacao.trim()) { setError('Descrição é obrigatória.'); return; }
    if (!form.vlTransacao || form.vlTransacao <= 0) { setError('Valor deve ser maior que zero.'); return; }

    setSaving(true);
    try {
      if (isEdit) {
        await updateTransacao(Number(id), form);
      } else {
        await createTransacao(form);
      }
      navigate('/transacoes');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <>
      <PageHeader title={isEdit ? 'Editar Transação' : 'Nova Transação'} />
      <div style={{ padding: '2rem', color: 'var(--ft-text-muted)', textAlign: 'center' }}>Carregando...</div>
    </>
  );

  return (
    <>
      <PageHeader title={isEdit ? 'Editar Transação' : 'Nova Transação'} subtitle="Preencha os dados abaixo" />

      <div style={{ padding: '1.5rem', maxWidth: 600 }}>
        <SectionCard>
          {error && (
            <div style={{
              padding: '0.75rem 1rem', borderRadius: 'var(--ft-radius-md)', marginBottom: '1.25rem',
              background: 'var(--ft-red-dim)', color: 'var(--ft-red)', border: '1px solid rgba(239,68,68,0.3)',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Tipo *</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {(['RECEITA', 'DESPESA'] as const).map(tp => (
                  <button key={tp} type="button" onClick={() => setForm(f => ({ ...f, tpTransacao: tp }))} style={{
                    flex: 1, padding: '0.625rem', borderRadius: 'var(--ft-radius-md)',
                    border: form.tpTransacao === tp ? 'none' : '1px solid var(--ft-border)',
                    background: form.tpTransacao === tp
                      ? (tp === 'RECEITA' ? 'var(--ft-green)' : 'var(--ft-red)')
                      : 'transparent',
                    color: form.tpTransacao === tp ? '#fff' : 'var(--ft-text-muted)',
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                  }}>
                    {tp === 'RECEITA' ? '↑ Receita' : '↓ Despesa'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Descrição *</label>
              <input
                style={inputStyle}
                type="text"
                value={form.dsTransacao}
                onChange={e => setForm(f => ({ ...f, dsTransacao: e.target.value }))}
                placeholder="Ex: Aluguel de maio"
                maxLength={200}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Valor (R$) *</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.vlTransacao || ''}
                  onChange={e => setForm(f => ({ ...f, vlTransacao: parseFloat(e.target.value) || 0 }))}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Data *</label>
                <input
                  style={inputStyle}
                  type="date"
                  value={form.dtTransacao}
                  onChange={e => setForm(f => ({ ...f, dtTransacao: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Categoria</label>
              <select
                style={{ ...inputStyle, cursor: 'pointer' }}
                value={form.categoria}
                onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
              >
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => navigate('/transacoes')} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.625rem 1rem', borderRadius: 'var(--ft-radius-md)',
                border: '1px solid var(--ft-border)', background: 'transparent',
                color: 'var(--ft-text-muted)', cursor: 'pointer', fontSize: '0.85rem',
              }}>
                <ArrowLeft size={15} /> Cancelar
              </button>
              <button type="submit" disabled={saving} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.625rem 1.25rem', borderRadius: 'var(--ft-radius-md)',
                border: 'none', background: 'var(--ft-gradient-primary)',
                color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              }}>
                <Save size={15} /> {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </>
  );
};

export default FormTransacao;
