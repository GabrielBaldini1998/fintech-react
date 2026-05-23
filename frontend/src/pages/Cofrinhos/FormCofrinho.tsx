import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import type { Cofrinho } from '@/types/finance';
import { getCofrinhoById, createCofrinho, updateCofrinho } from '@/services/cofrinhoService';
import SectionCard from '@/components/ui/SectionCard';

const ICONES = ['PiggyBank', 'Plane', 'Shield', 'Home', 'Car', 'Graduation', 'Heart', 'Star', 'Gift', 'Zap'];
const CORES = ['#F59E0B', '#22C55E', '#3B82F6', '#A855F7', '#EF4444', '#F97316', '#06B6D4', '#EC4899'];

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

const FormCofrinho = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { session } = useAuth();
  const idUsuario = session!.usuario.idUsuario;

  const [form, setForm] = useState<Omit<Cofrinho, 'idCofrinho'>>({
    nmCofrinho: '',
    dsCofrinho: '',
    vlMeta: 0,
    vlAtual: 0,
    dsIcone: 'PiggyBank',
    dsCor: '#F59E0B',
    idUsuario,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    getCofrinhoById(Number(id))
      .then(c => setForm({
        nmCofrinho: c.nmCofrinho,
        dsCofrinho: c.dsCofrinho ?? '',
        vlMeta: c.vlMeta,
        vlAtual: c.vlAtual,
        dsIcone: c.dsIcone ?? 'PiggyBank',
        dsCor: c.dsCor ?? '#F59E0B',
        idUsuario: c.idUsuario,
      }))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.nmCofrinho.trim()) { setError('Nome do cofrinho é obrigatório.'); return; }

    setSaving(true);
    try {
      if (isEdit) {
        await updateCofrinho(Number(id), form);
      } else {
        await createCofrinho(form);
      }
      navigate('/cofrinhos');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <>
      <PageHeader title={isEdit ? 'Editar Cofrinho' : 'Novo Cofrinho'} />
      <div style={{ padding: '2rem', color: 'var(--ft-text-muted)', textAlign: 'center' }}>Carregando...</div>
    </>
  );

  return (
    <>
      <PageHeader title={isEdit ? 'Editar Cofrinho' : 'Novo Cofrinho'} subtitle="Configure sua meta financeira" />

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
              <label style={labelStyle}>Nome do Cofrinho *</label>
              <input
                style={inputStyle}
                type="text"
                value={form.nmCofrinho}
                onChange={e => setForm(f => ({ ...f, nmCofrinho: e.target.value }))}
                placeholder="Ex: Viagem Europa"
                maxLength={100}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Descrição</label>
              <input
                style={inputStyle}
                type="text"
                value={form.dsCofrinho}
                onChange={e => setForm(f => ({ ...f, dsCofrinho: e.target.value }))}
                placeholder="Ex: Fundo para viagem em 2027"
                maxLength={200}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Meta (R$)</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.vlMeta || ''}
                  onChange={e => setForm(f => ({ ...f, vlMeta: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <label style={labelStyle}>Valor Atual (R$)</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.vlAtual || ''}
                  onChange={e => setForm(f => ({ ...f, vlAtual: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Cor</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {CORES.map(cor => (
                  <button key={cor} type="button" onClick={() => setForm(f => ({ ...f, dsCor: cor }))} style={{
                    width: 28, height: 28, borderRadius: '50%', background: cor, border: 'none',
                    cursor: 'pointer', outline: form.dsCor === cor ? `3px solid #fff` : 'none',
                    outlineOffset: 2,
                  }} />
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Ícone</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {ICONES.map(ic => (
                  <button key={ic} type="button" onClick={() => setForm(f => ({ ...f, dsIcone: ic }))} style={{
                    padding: '0.375rem 0.625rem', borderRadius: 'var(--ft-radius-sm)',
                    border: form.dsIcone === ic ? 'none' : '1px solid var(--ft-border)',
                    background: form.dsIcone === ic ? 'var(--ft-gradient-primary)' : 'transparent',
                    color: form.dsIcone === ic ? '#fff' : 'var(--ft-text-muted)',
                    cursor: 'pointer', fontSize: '0.72rem',
                  }}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => navigate('/cofrinhos')} style={{
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

export default FormCofrinho;
