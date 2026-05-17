import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import type { Despesa } from '@/types/finance';
import { getDespesaById, createDespesa, updateDespesa } from '@/services/despesaService';
import SectionCard from '@/components/ui/SectionCard';

interface FormState {
  tpDespesa: string;
  vlDespesa: string;
  dtDespesa: string;
  numeroDaConta: string;
}

const EMPTY: FormState = { tpDespesa: '', vlDespesa: '', dtDespesa: '', numeroDaConta: '' };

const FormDespesa = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  const isEdit = !!id;

  const [form, setForm] = useState<FormState>({
    ...EMPTY,
    numeroDaConta: session!.conta.numeroDaConta,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    getDespesaById(Number(id))
      .then((d: Despesa) => setForm({
        tpDespesa: d.tpDespesa,
        vlDespesa: String(d.vlDespesa),
        dtDespesa: d.dtDespesa ?? '',
        numeroDaConta: d.numeroDaConta,
      }))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.tpDespesa.trim()) { setError('Tipo de despesa é obrigatório.'); return; }
    const vlDespesa = parseFloat(form.vlDespesa);
    if (!vlDespesa || vlDespesa <= 0) { setError('Valor deve ser positivo.'); return; }
    if (!form.numeroDaConta.trim()) { setError('Número da conta é obrigatório.'); return; }

    setLoading(true);
    try {
      const payload = {
        tpDespesa: form.tpDespesa,
        vlDespesa,
        dtDespesa: form.dtDespesa,
        numeroDaConta: form.numeroDaConta,
      };
      if (isEdit) {
        await updateDespesa(Number(id), payload);
      } else {
        await createDespesa(payload);
      }
      navigate('/despesas');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title={isEdit ? 'Editar Despesa' : 'Nova Despesa'}
        subtitle={isEdit ? `ID #${id}` : 'Preencha os dados abaixo'}
      />

      <div style={{ padding: '1.5rem', maxWidth: 560 }}>
        <SectionCard>
          {loading && !form.tpDespesa && (
            <p style={{ color: 'var(--ft-text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              Carregando...
            </p>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ft-text-muted)', marginBottom: '0.375rem' }}>
                Tipo de Despesa
              </label>
              <input
                type="text" name="tpDespesa" value={form.tpDespesa}
                onChange={handleChange} placeholder="ex: Alimentação, Transporte"
                required
                style={{
                  width: '100%', padding: '0.625rem 0.875rem',
                  background: 'var(--ft-bg-input, rgba(255,255,255,0.05))',
                  border: '1px solid var(--ft-border)', borderRadius: 'var(--ft-radius-md)',
                  color: 'var(--ft-text)', fontSize: '0.9rem', boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ft-text-muted)', marginBottom: '0.375rem' }}>
                Valor (R$)
              </label>
              <input
                type="number" name="vlDespesa" value={form.vlDespesa}
                onChange={handleChange} placeholder="0,00" min="0.01" step="0.01"
                required
                style={{
                  width: '100%', padding: '0.625rem 0.875rem',
                  background: 'var(--ft-bg-input, rgba(255,255,255,0.05))',
                  border: '1px solid var(--ft-border)', borderRadius: 'var(--ft-radius-md)',
                  color: 'var(--ft-text)', fontSize: '0.9rem', boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ft-text-muted)', marginBottom: '0.375rem' }}>
                Data
              </label>
              <input
                type="date" name="dtDespesa" value={form.dtDespesa}
                onChange={handleChange}
                style={{
                  width: '100%', padding: '0.625rem 0.875rem',
                  background: 'var(--ft-bg-input, rgba(255,255,255,0.05))',
                  border: '1px solid var(--ft-border)', borderRadius: 'var(--ft-radius-md)',
                  color: 'var(--ft-text)', fontSize: '0.9rem', boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ft-text-muted)', marginBottom: '0.375rem' }}>
                Número da Conta
              </label>
              <input
                type="text" name="numeroDaConta" value={form.numeroDaConta}
                onChange={handleChange} required
                style={{
                  width: '100%', padding: '0.625rem 0.875rem',
                  background: 'var(--ft-bg-input, rgba(255,255,255,0.05))',
                  border: '1px solid var(--ft-border)', borderRadius: 'var(--ft-radius-md)',
                  color: 'var(--ft-text)', fontSize: '0.9rem', boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <div style={{
                padding: '0.75rem 1rem', borderRadius: 'var(--ft-radius-md)',
                background: 'var(--ft-red-dim)', color: 'var(--ft-red)',
                border: '1px solid rgba(239,68,68,0.3)', fontSize: '0.85rem',
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => navigate('/despesas')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.625rem 1.25rem', borderRadius: 'var(--ft-radius-md)',
                  border: '1px solid var(--ft-border)', background: 'transparent',
                  color: 'var(--ft-text-muted)', cursor: 'pointer', fontSize: '0.875rem',
                }}
              >
                <ArrowLeft size={15} /> Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.625rem 1.25rem', borderRadius: 'var(--ft-radius-md)',
                  border: 'none', background: 'var(--ft-gradient-primary)',
                  color: '#fff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
                }}
              >
                <Save size={15} /> {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </>
  );
};

export default FormDespesa;
