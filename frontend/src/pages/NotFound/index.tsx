import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--ft-bg-page)', padding: '2rem', textAlign: 'center',
    }}>
      <div style={{
        fontSize: '6rem', fontWeight: 900, color: 'var(--ft-purple)',
        lineHeight: 1, letterSpacing: '-4px',
      }}>
        404
      </div>
      <h1 style={{ color: 'var(--ft-text)', margin: '1rem 0 0.5rem', fontSize: '1.5rem' }}>
        Página não encontrada
      </h1>
      <p style={{ color: 'var(--ft-text-muted)', marginBottom: '2rem', maxWidth: 360 }}>
        A rota que você tentou acessar não existe ou foi removida.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          background: 'var(--ft-gradient-primary)', color: '#fff',
          border: 'none', borderRadius: 'var(--ft-radius-md)',
          padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Voltar para o início
      </button>
    </div>
  );
};

export default NotFound;
