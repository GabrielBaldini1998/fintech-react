import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import type { Investimento } from '@/types/finance';
import { getInvestimentos, createInvestimento, updateInvestimento } from '@/services/investimentoService';
import SectionCard from '@/components/ui/SectionCard';

interface FormState {
  nmAplicacao: string;
  nmBancoCorretora: string;
  vlAplicacao: string;
  dtAplicacao: string;
  dtVencimentoAplicacao: string;
  numeroDaConta: string;
}

const EMPTY: FormState = {
  nmAplicacao: '', nmBancoCorretora: '', vlAplicacao: '',
  dtAplicacao: '', dtVencimentoAplicacao: '', numeroDaConta: '',
};

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

const FormInvestimento = () => {
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
    getInvestimentos()
      .then((all: Investimento[]) => {
        const inv = all.find(x => x.idInvestimento === Number(id));
        if (inv) setForm({
          nmAplicacao: inv.nmAplicacao,
          nmBancoCorretora: inv.nmBancoCorretora,
          vlAplicacao: String(inv.vlAplicacao),
          dtAplicacao: inv.dtAplicacao ?? '',
          dtVencimentoAplicacao: inv.dtVencimentoAplicacao ?? '',
          numeroDaConta: inv.numeroDaConta,
        });
        else setError('Investimento não encontrado.');
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
    if (!form.nmAplicacao.trim()) { setError('Nome da aplicação é obrigatório.'); return; }
    if (!form.nmBancoCorretora.trim()) { setError('Banco/Corretora é obrigatório.'); return; }
    const vlAplicacao = parseFloat(form.vlAplicacao);
    if (!vlAplicacao || vlAplicacao <= 0) { setError('Valor de aplicação deve ser positivo.'); return; }
    if (!form.numeroDaConta.trim()) { setError('Número da conta é obrigatório.'); return; }
    if (form.dtVencimentoAplicacao && form.dtAplicacao && form.dtVencimentoAplicacao < form.dtAplicacao) {
      setError('Data de vencimento deve ser posterior à data de aplicação.'); return;
    }

    setLoading(true);
    try {
      const payload = {
        nmAplicacao: form.nmAplicacao,
        nmBancoCorretora: form.nmBancoCorretora,
        vlAplicacao,
        dtAplicacao: form.dtAplicacao,
        dtVencimentoAplicacao: form.dtVencimentoAplicacao,
        numeroDaConta: form.numeroDaConta,
      };
      if (isEdit) {
        await updateInvestimento(Number(id), payload);
      } else {
        await createInvestimento(payload);
      }
      navigate('/investimentos');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title={isEdit ? 'Editar Investimento' : 'Novo Investimento'}
        subtitle={isEdit ? `ID #${id}` : 'Preencha os dados abaixo'}
      />

      <div style={{ padding: '1.5rem', maxWidth: 600 }}>
        <SectionCard>
          {loading && !form.nmAplicacao && (
            <p style={{ color: 'var(--ft-text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              Carregando...
            </p>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Nome da Aplicação</label>
                <input
                  type="text" name="nmAplicacao" value={form.nmAplicacao}
                  onChange={handleChange} placeholder="ex: CDB, Tesouro Direto"
                  required style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Banco / Corretora</label>
                <input
                  type="text" name="nmBancoCorretora" value={form.nmBancoCorretora}
                  onChange={handleChange} placeholder="ex: XP Investimentos"
                  required style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Valor da Aplicação (R$)</label>
              <input
                type="number" name="vlAplicacao" value={form.vlAplicacao}
                onChange={handleChange} placeholder="0,00" min="0.01" step="0.01"
                required style={inputStyle}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Data de Aplicação</label>
                <input
                  type="date" name="dtAplicacao" value={form.dtAplicacao}
                  onChange={handleChange} style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Data de Vencimento</label>
                <input
                  type="date" name="dtVencimentoAplicacao" value={form.dtVencimentoAplicacao}
                  onChange={handleChange} style={inputStyle}
                />
              </div>
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
                onClick={() => navigate('/investimentos')}
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

export default FormInvestimento;
