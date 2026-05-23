import { useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';

const DICAS_ESTATICAS = [
  'Mantenha pelo menos 3 cofrinhos ativos: emergência, lazer e objetivo de prazo médio.',
  'Revise suas despesas recorrentes mensalmente e elimine assinaturas não utilizadas.',
  'Meta sugerida: poupe pelo menos 10% da sua receita mensal.',
  'Cofrinhos com meta definida têm 3× mais chance de serem concluídos.',
];

const DicasIA = () => {
  const [dicaIndex, setDicaIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const proximaDica = () => {
    setAnimating(true);
    setTimeout(() => {
      setDicaIndex(i => (i + 1) % DICAS_ESTATICAS.length);
      setAnimating(false);
    }, 200);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(34,197,94,0.05) 100%)',
      border: '1px solid rgba(245,158,11,0.2)',
      borderRadius: 'var(--ft-radius-lg)', padding: '1.25rem',
      display: 'flex', flexDirection: 'column', gap: '1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 'var(--ft-radius-md)',
          background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--ft-amber)', flexShrink: 0,
        }}>
          <Bot size={18} />
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: 'var(--ft-text)' }}>
            FinCheck IA
          </p>
          <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--ft-text-muted)' }}>
            Dicas personalizadas em breve
          </p>
        </div>
        <span style={{
          marginLeft: 'auto', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px',
          borderRadius: 'var(--ft-radius-full)', background: 'rgba(245,158,11,0.15)', color: 'var(--ft-amber)',
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          <Sparkles size={10} /> Em breve
        </span>
      </div>

      <div style={{
        opacity: animating ? 0 : 1, transition: 'opacity 0.2s ease',
        padding: '0.875rem', background: 'rgba(255,255,255,0.03)',
        borderRadius: 'var(--ft-radius-md)', border: '1px solid var(--ft-border)',
        minHeight: 60,
      }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ft-text)', lineHeight: 1.6 }}>
          💡 {DICAS_ESTATICAS[dicaIndex]}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <div style={{
          flex: 1, padding: '0.5rem 0.875rem', background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--ft-border)', borderRadius: 'var(--ft-radius-md)',
          fontSize: '0.8rem', color: 'var(--ft-text-muted)',
        }}>
          Integração com Watson em desenvolvimento...
        </div>
        <button onClick={proximaDica} style={{
          padding: '0.5rem 0.75rem', borderRadius: 'var(--ft-radius-md)',
          border: 'none', background: 'var(--ft-gradient-primary)',
          color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
        }} title="Próxima dica">
          <Send size={15} />
        </button>
      </div>
    </div>
  );
};

export default DicasIA;
