import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/Navbar';
import type { Usuario } from '@/types/finance';
import { getUsuarioById, createUsuario, updateUsuario } from '@/services/usuarioService';
import SectionCard from '@/components/ui/SectionCard';

type FormData = Omit<Usuario, 'idUsuario'>;

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

const emptyForm: FormData = {
  nmCompleto: '',
  dtNascimento: '',
  nmDocumento: '',
  tpTipo: 'CPF',
  dsEmail: '',
  dsSenha: '',
};

const FormUsuario = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    getUsuarioById(Number(id))
      .then(u => setForm({
        nmCompleto:   u.nmCompleto,
        dtNascimento: u.dtNascimento ?? '',
        nmDocumento:  u.nmDocumento,
        tpTipo:       u.tpTipo,
        dsEmail:      u.dsEmail,
        dsSenha:      u.dsSenha,
      }))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (field: keyof FormData, value: string) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.nmCompleto.trim())  { setError('Nome é obrigatório.'); return; }
    if (!form.nmDocumento.trim()) { setError('Documento é obrigatório.'); return; }
    if (!form.dsEmail.trim())     { setError('E-mail é obrigatório.'); return; }
    if (!isEdit && !form.dsSenha) { setError('Senha é obrigatória.'); return; }

    setSaving(true);
    try {
      if (isEdit) {
        await updateUsuario(Number(id), form);
      } else {
        await createUsuario(form);
      }
      navigate('/usuarios');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <>
      <PageHeader title={isEdit ? 'Editar Usuário' : 'Novo Usuário'} />
      <div style={{ padding: '2rem', color: 'var(--ft-text-muted)', textAlign: 'center' }}>Carregando...</div>
    </>
  );

  return (
    <>
      <PageHeader
        title={isEdit ? 'Editar Usuário' : 'Novo Usuário'}
        subtitle="Preencha os dados abaixo"
      />

      <div style={{ padding: '1.5rem', maxWidth: 640 }}>
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
            {/* Nome */}
            <div>
              <label style={labelStyle}>Nome completo *</label>
              <input
                style={inputStyle}
                type="text"
                value={form.nmCompleto}
                onChange={e => set('nmCompleto', e.target.value)}
                placeholder="Ex: João da Silva"
                maxLength={100}
                required
              />
            </div>

            {/* Tipo + Documento */}
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Tipo *</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={form.tpTipo}
                  onChange={e => set('tpTipo', e.target.value)}
                >
                  <option value="CPF">CPF</option>
                  <option value="CNPJ">CNPJ</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>{form.tpTipo} *</label>
                <input
                  style={inputStyle}
                  type="text"
                  inputMode="numeric"
                  value={form.nmDocumento}
                  onChange={e => set('nmDocumento', e.target.value)}
                  maxLength={form.tpTipo === 'CPF' ? 11 : 14}
                  placeholder={form.tpTipo === 'CPF' ? '00000000000' : '00000000000000'}
                  required
                />
              </div>
            </div>

            {/* Data de nascimento */}
            <div>
              <label style={labelStyle}>Data de nascimento</label>
              <input
                style={inputStyle}
                type="date"
                value={form.dtNascimento}
                onChange={e => set('dtNascimento', e.target.value)}
              />
            </div>

            {/* E-mail */}
            <div>
              <label style={labelStyle}>E-mail *</label>
              <input
                style={inputStyle}
                type="email"
                value={form.dsEmail}
                onChange={e => set('dsEmail', e.target.value)}
                placeholder="usuario@email.com"
                maxLength={100}
                required
              />
            </div>

            {/* Senha */}
            <div>
              <label style={labelStyle}>
                {isEdit ? 'Senha (deixe vazio para manter)' : 'Senha *'}
              </label>
              <input
                style={inputStyle}
                type="password"
                value={form.dsSenha}
                onChange={e => set('dsSenha', e.target.value)}
                placeholder="••••••••"
                maxLength={100}
                required={!isEdit}
              />
            </div>

            {/* Botões */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => navigate('/usuarios')} style={{
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

export default FormUsuario;
