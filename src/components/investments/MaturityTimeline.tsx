import { differenceInDays, parseISO, isAfter } from 'date-fns';
import type { Investimento } from '@/types/finance';
import { formatCurrency, formatDate } from '@/utils/formatters';
import SectionCard from '@/components/ui/SectionCard';
import { Clock } from 'lucide-react';

interface Props { investimentos: Investimento[] }

function getStatus(dtVencimento: string): { label: string; color: string; bg: string } {
  const hoje = new Date();
  const venc = parseISO(dtVencimento);
  const dias = differenceInDays(venc, hoje);

  if (!isAfter(venc, hoje)) return { label: 'Vencido',          color: '#EF4444', bg: 'var(--ft-red-dim)' };
  if (dias <= 30)           return { label: 'Vencendo em breve', color: '#F59E0B', bg: 'var(--ft-yellow-dim)' };
  return                           { label: 'Ativo',             color: '#10B981', bg: 'var(--ft-green-dim)' };
}

function getProgress(dtAplicacao: string, dtVencimento: string): number {
  const start = parseISO(dtAplicacao);
  const end   = parseISO(dtVencimento);
  const total = differenceInDays(end, start);
  const elapsed = differenceInDays(new Date(), start);
  if (total <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

const MaturityTimeline = ({ investimentos }: Props) => {
  const sorted = [...investimentos].sort(
    (a, b) => parseISO(a.dtVencimentoAplicacao).getTime() - parseISO(b.dtVencimentoAplicacao).getTime()
  );

  if (sorted.length === 0) {
    return (
      <SectionCard>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)', marginBottom: '1rem' }}>
          Timeline de Vencimentos
        </h3>
        <p style={{ color: 'var(--ft-text-muted)', textAlign: 'center', padding: '1.5rem 0', fontSize: '0.85rem' }}>
          Nenhum investimento registrado.
        </p>
      </SectionCard>
    );
  }

  return (
    <SectionCard>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <Clock size={16} style={{ color: 'var(--ft-blue)' }} />
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)', margin: 0 }}>
          Timeline de Vencimentos
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sorted.map(inv => {
          const status = getStatus(inv.dtVencimentoAplicacao);
          const progress = getProgress(inv.dtAplicacao, inv.dtVencimentoAplicacao);
          const diasRestantes = differenceInDays(parseISO(inv.dtVencimentoAplicacao), new Date());

          return (
            <div key={inv.idInvestimento} style={{
              background: 'rgba(255,255,255,0.025)', borderRadius: 'var(--ft-radius-md)',
              padding: '0.875rem', border: '1px solid var(--ft-border)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.625rem' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: 'var(--ft-text)' }}>
                    {inv.nmAplicacao}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--ft-text-muted)' }}>
                    {inv.nmBancoCorretora} · Vence: {formatDate(inv.dtVencimentoAplicacao)}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px',
                    borderRadius: 'var(--ft-radius-full)',
                    background: status.bg, color: status.color,
                  }}>
                    {status.label}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ft-blue)' }}>
                    {formatCurrency(inv.vlAplicacao)}
                  </span>
                </div>
              </div>

              {/* Barra de progresso */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  flex: 1, height: 5, borderRadius: 3,
                  background: 'rgba(255,255,255,0.08)',
                }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: `${progress}%`,
                    background: progress >= 100 ? 'var(--ft-red)' : progress >= 80 ? 'var(--ft-yellow)' : 'var(--ft-gradient-primary)',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--ft-text-muted)', flexShrink: 0 }}>
                  {diasRestantes > 0 ? `${diasRestantes}d restantes` : 'Vencido'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
};

export default MaturityTimeline;
