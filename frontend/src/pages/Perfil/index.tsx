import { useState, useRef } from 'react';
import { Camera, Lock, Settings, User, Eye, EyeOff, CheckCircle, Sun, Moon, FileText } from 'lucide-react';
import PageHeader from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import SectionCard from '@/components/ui/SectionCard';
import { updateUsuario as updateUsuarioApi } from '@/services/usuarioService';

const AVATAR_KEY = 'fincheck_avatar';

function getStoredAvatar(): string | null {
  try { return localStorage.getItem(AVATAR_KEY); } catch { return null; }
}
function saveAvatar(base64: string) {
  try { localStorage.setItem(AVATAR_KEY, base64); } catch { /* quota */ }
}

function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8)          score++;
  if (/[A-Z]/.test(pwd))        score++;
  if (/[0-9]/.test(pwd))        score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const levels = [
    { label: '',         color: 'transparent' },
    { label: 'Fraca',    color: '#EF4444' },
    { label: 'Razoável', color: '#F59E0B' },
    { label: 'Boa',      color: '#3B82F6' },
    { label: 'Forte',    color: '#22C55E' },
  ];
  return { score, ...levels[score] };
}

const Perfil = () => {
  const { session, login, updateUsuario: refreshSession } = useAuth();
  const { usuario } = session!;
  const { isDark, toggleTheme } = useTheme();

  /* Avatar */
  const [avatar, setAvatar] = useState<string | null>(getStoredAvatar);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setAvatar(base64);
      saveAvatar(base64);
    };
    reader.readAsDataURL(file);
  };

  /* Edição de dados pessoais */
  const [editingInfo, setEditingInfo] = useState(false);
  const [nome, setNome] = useState(usuario.nmCompleto);
  const [email, setEmail] = useState(usuario.dsEmail);
  const [infoSaved, setInfoSaved] = useState(false);

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setEditingInfo(false);
    setInfoSaved(true);
    setTimeout(() => setInfoSaved(false), 3000);
  };

  /* Senha */
  const [pwdForm, setPwdForm] = useState({ atual: '', nova: '', confirmar: '' });
  const [showPwd, setShowPwd] = useState({ atual: false, nova: false, confirmar: false });
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdSaved, setPwdSaved] = useState(false);
  const [pwdSubmitting, setPwdSubmitting] = useState(false);

  const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPwdForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSavePwd = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    if (pwdForm.nova !== pwdForm.confirmar) { setPwdError('As senhas não coincidem.'); return; }
    if (pwdForm.nova.length < 6) { setPwdError('A nova senha deve ter pelo menos 6 caracteres.'); return; }

    setPwdSubmitting(true);
    try {
      await login(usuario.dsEmail, pwdForm.atual);
    } catch {
      setPwdError('Senha atual incorreta.');
      setPwdSubmitting(false);
      return;
    }

    try {
      const atualizado = await updateUsuarioApi(usuario.idUsuario, {
        nmCompleto: usuario.nmCompleto,
        dtNascimento: usuario.dtNascimento,
        nmDocumento: usuario.nmDocumento,
        tpTipo: usuario.tpTipo,
        dsEmail: usuario.dsEmail,
        dsSenha: pwdForm.nova,
      });
      refreshSession(atualizado);
      setPwdForm({ atual: '', nova: '', confirmar: '' });
      setPwdSaved(true);
      setTimeout(() => setPwdSaved(false), 3000);
    } catch {
      setPwdError('Não foi possível atualizar a senha. Tente novamente.');
    } finally {
      setPwdSubmitting(false);
    }
  };

  const strength = getPasswordStrength(pwdForm.nova);
  const initials = usuario.nmCompleto.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

  return (
    <>
      <PageHeader title="Perfil" subtitle="Gerencie sua conta e preferências" />

      <div style={{ padding: '1.5rem', maxWidth: 860, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── Avatar + Nome ── */}
        <SectionCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 88, height: 88, borderRadius: '50%', overflow: 'hidden',
                background: avatar ? 'transparent' : 'var(--ft-gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.75rem', fontWeight: 800, color: '#fff',
                border: '3px solid rgba(245,158,11,0.35)',
                boxShadow: 'var(--ft-shadow-glow)',
              }}>
                {avatar
                  ? <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : initials}
              </div>
              <button onClick={() => fileRef.current?.click()} style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--ft-gradient-primary)', border: '2px solid var(--ft-bg-page)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff',
              }} title="Alterar foto">
                <Camera size={13} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
            </div>

            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--ft-text)' }}>
                {usuario.nmCompleto}
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--ft-text-muted)' }}>
                {usuario.dsEmail}
              </p>
              <span style={{
                display: 'inline-block', marginTop: '0.5rem', fontSize: '0.72rem', fontWeight: 600,
                padding: '2px 10px', borderRadius: 'var(--ft-radius-full)',
                background: 'var(--ft-amber-dim)', color: 'var(--ft-amber)',
              }}>
                {usuario.tpTipo ?? 'CPF'}
              </span>
            </div>
          </div>
        </SectionCard>

        {/* ── Dados Pessoais ── */}
        <SectionCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} style={{ color: 'var(--ft-amber)' }} />
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>Dados Pessoais</h4>
            </div>
            {!editingInfo && !infoSaved && (
              <button onClick={() => setEditingInfo(true)} style={{
                background: 'var(--ft-amber-dim)', border: 'none', borderRadius: 'var(--ft-radius-sm)',
                color: 'var(--ft-amber)', fontSize: '0.8rem', fontWeight: 600,
                padding: '0.375rem 0.875rem', cursor: 'pointer',
              }}>
                Editar
              </button>
            )}
            {infoSaved && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--ft-green)' }}>
                <CheckCircle size={14} /> Salvo!
              </span>
            )}
          </div>

          {editingInfo ? (
            <form onSubmit={handleSaveInfo}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Nome completo</label>
                  <input className="form-control" value={nome} onChange={e => setNome(e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">E-mail</label>
                  <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-primary px-4" style={{ fontSize: '0.875rem', color: '#000' }}>Salvar</button>
                <button type="button" className="btn btn-outline-secondary"
                  onClick={() => { setEditingInfo(false); setNome(usuario.nmCompleto); setEmail(usuario.dsEmail); }}
                  style={{ fontSize: '0.875rem' }}>Cancelar</button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Nome completo', value: nome },
                { label: 'E-mail',        value: email },
                { label: 'Tipo',          value: usuario.tpTipo ?? 'CPF' },
                { label: 'Documento',     value: usuario.nmDocumento },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--ft-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.label}
                  </p>
                  <p style={{ margin: '4px 0 0', fontWeight: 500, color: 'var(--ft-text)' }}>{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* ── Segurança ── */}
        <SectionCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Lock size={16} style={{ color: 'var(--ft-amber)' }} />
            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>Segurança</h4>
          </div>

          <form onSubmit={handleSavePwd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              {(['atual', 'nova', 'confirmar'] as const).map(field => (
                <div key={field}>
                  <label className="form-label">
                    {field === 'atual' ? 'Senha atual' : field === 'nova' ? 'Nova senha' : 'Confirmar'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="form-control"
                      type={showPwd[field] ? 'text' : 'password'}
                      name={field}
                      value={pwdForm[field]}
                      onChange={handlePwdChange}
                      placeholder="••••••••"
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <button type="button" onClick={() => setShowPwd(p => ({ ...p, [field]: !p[field] }))} style={{
                      position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ft-text-muted)',
                      padding: 0, display: 'flex',
                    }}>
                      {showPwd[field] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {pwdForm.nova && (
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 4, borderRadius: 2,
                      background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.1)',
                      transition: 'background 0.2s',
                    }} />
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: '0.72rem', color: strength.color, fontWeight: 500 }}>
                  {strength.label && `Senha ${strength.label.toLowerCase()}`}
                </p>
              </div>
            )}

            {pwdError && <div className="alert alert-danger mt-3 py-2 small" role="alert">{pwdError}</div>}
            {pwdSaved && (
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.85rem', color: 'var(--ft-green)' }}>
                <CheckCircle size={15} /> Senha atualizada!
              </div>
            )}

            <div style={{ marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary px-4" style={{ fontSize: '0.875rem', color: '#000' }} disabled={pwdSubmitting}>
                {pwdSubmitting ? 'Verificando…' : 'Alterar senha'}
              </button>
            </div>
          </form>
        </SectionCard>

        {/* ── Dados da Conta ── */}
        <SectionCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <FileText size={16} style={{ color: 'var(--ft-blue)' }} />
            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>Dados da Conta</h4>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Nome',      value: usuario.nmCompleto },
              { label: 'Documento', value: `${usuario.tpTipo ?? 'CPF'}: ${usuario.nmDocumento}` },
              { label: 'E-mail',    value: usuario.dsEmail },
              { label: 'ID',        value: String(usuario.idUsuario) },
            ].map(item => (
              <div key={item.label} style={{
                background: 'rgba(255,255,255,0.025)', borderRadius: 'var(--ft-radius-md)',
                padding: '0.875rem', border: '1px solid var(--ft-border)',
              }}>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--ft-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.label}
                </p>
                <p style={{ margin: '4px 0 0', fontWeight: 700, color: 'var(--ft-text)', wordBreak: 'break-all' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ── Preferências ── */}
        <SectionCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Settings size={16} style={{ color: 'var(--ft-text-muted)' }} />
            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>Preferências</h4>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.875rem 1rem',
            background: isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.025)',
            borderRadius: 'var(--ft-radius-md)', border: '1px solid var(--ft-border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--ft-radius-md)',
                background: isDark ? 'rgba(245,158,11,0.12)' : 'rgba(124,58,237,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isDark ? '#F59E0B' : 'var(--ft-purple)',
              }}>
                {isDark ? <Moon size={16} /> : <Sun size={16} />}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: 'var(--ft-text)' }}>
                  {isDark ? 'Tema Escuro' : 'Tema Claro'}
                </p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--ft-text-muted)' }}>
                  {isDark ? 'Fundo escuro, menor cansaço visual à noite' : 'Fundo claro, maior contraste diurno'}
                </p>
              </div>
            </div>

            <button onClick={toggleTheme} style={{
              width: 48, height: 26, borderRadius: 13, border: 'none',
              background: isDark ? 'var(--ft-gradient-primary)' : 'rgba(0,0,0,0.15)',
              display: 'flex', alignItems: 'center', padding: '0 3px',
              justifyContent: isDark ? 'flex-end' : 'flex-start',
              cursor: 'pointer', transition: 'all 250ms ease', flexShrink: 0,
            }} title={isDark ? 'Mudar para Light mode' : 'Mudar para Dark mode'}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', background: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isDark
                  ? <Moon size={10} style={{ color: '#7C3AED' }} />
                  : <Sun size={10} style={{ color: '#F59E0B' }} />}
              </div>
            </button>
          </div>
        </SectionCard>

      </div>
    </>
  );
};

export default Perfil;
