import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import type { Receita } from '@/types/finance';
import { getReceitas, createReceita, updateReceita } from '@/services/receitaService';
import SectionCard from '@/components/ui/SectionCard';

interface FormState {
  dsReceita: string;
  vlRecebido: string;
  dtReceita: string;
  numeroDaConta: string;
}

const EMPTY: FormState = { dsReceita: '', vlRecebido: '', dtReceita: '', numeroDaConta: '' };

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.625rem 0.875rem',
  background: 'var(--ft-bg-input, rgba(255,255,255,0.05))',
  border: '1px solid var(--ft-border)', borderRadius: 'var(--ft-radius-md)',
  color: 'var(--ft-text)', fontSize: '0.9rem', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.8rem', fontWeight: 600,
  color: 'var(--ft-text-muted)', marginBottom: '0.375rem',
};

const FormReceita = () => {
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
    getReceitas()
      .then((all: Receita[]) => {
        const r = all.find(x => x.idReceita === Number(id));
        if (r) setForm({
          dsReceita: r.dsReceita,
          vlRecebido: String(r.vlRecebido),
          dtReceita: r.dtReceita ?? '',
          numeroDaConta: r.numeroDaConta,
        });
        else setError('Receita não encontrada.');
      })
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
    if (!form.dsReceita.trim()) { setError('Descrição é obrigatória.'); return; }
    const vlRecebido = parseFloat(form.vlRecebido);
    if (!vlRecebido || vlRecebido <= 0) { setError('Valor deve ser positivo.'); return; }
    if (!form.numeroDaConta.trim()) { setError('Número da conta é obrigatório.'); return; }

    setLoading(true);
    try {
      const payload = {
        dsReceita: form.dsReceita,
        vlRecebido,
        dtReceita: form.dtReceita,
        numeroDaConta: form.numeroDaConta,
      };
      if (isEdit) {
        await updateReceita(Number(id), payload);
      } else {
        await createReceita(payload);
      }
      navigate('/receitas');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title={isEdit ? 'Editar Receita' : 'Nova Receita'}
        subtitle={isEdit ? `ID #${id}` : 'Preencha os dados abaixo'}
      />

      <div style={{ padding: '1.5rem', maxWidth: 560 }}>
        <SectionCard>
          {loading && !form.dsReceita && (
            <p style={{ color: 'var(--ft-text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              Carregando...
            </p>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Descrição</label>
              <input
                type="text" name="dsReceita" value={form.dsReceita}
                onChange={handleChange} placeholder="ex: Salário, Freelance"
                required style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Valor Recebido (R$)</label>
              <input
                type="number" name="vlRecebido" value={form.vlRecebido}
                onChange={handleChange} placeholder="0,00" min="0.01" step="0.01"
                required style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Data</label>
              <input
                type="date" name="dtReceita" value={form.dtReceita}
                onChange={handleChange} style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Número da Conta</label>
              <input
                type="text" name="numeroDaConta" value={form.numeroDaConta}
                onChange={handleChange} required style={inputStyle}
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
                onClick={() => navigate('/receitas')}
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

export default FormReceita;
