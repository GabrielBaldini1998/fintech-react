import { useState } from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import type { Investimento } from '@/types/finance';
import { formatCurrency, formatDate } from '@/utils/formatters';
import SectionCard from '@/components/ui/SectionCard';
import { ChevronDown, ChevronUp, Calculator } from 'lucide-react';

interface Props { investimentos: Investimento[] }

function calcRendimento(valor: number, taxaAnual: number, diasUteis: number): number {
  const taxaDiaria = Math.pow(1 + taxaAnual / 100, 1 / 252) - 1;
  return valor * Math.pow(1 + taxaDiaria, diasUteis) - valor;
}

const RenderingSimulator = ({ investimentos }: Props) => {
  const [open, setOpen] = useState(false);
  const [taxaAnual, setTaxaAnual] = useState('12');

  const taxa = parseFloat(taxaAnual) || 0;

  return (
    <SectionCard>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--ft-text)', padding: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calculator size={16} style={{ color: 'var(--ft-purple-light)' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Simulador de Rendimento</span>
        </div>
        {open ? <ChevronUp size={16} style={{ color: 'var(--ft-text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--ft-text-muted)' }} />}
      </button>

      {open && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--ft-text-muted)', fontWeight: 500, flexShrink: 0 }}>
              Taxa anual (% a.a.):
            </label>
            <input
              type="number"
              value={taxaAnual}
              min="0"
              max="100"
              step="0.1"
              onChange={e => setTaxaAnual(e.target.value)}
              style={{
                width: 90, padding: '0.375rem 0.625rem',
                background: 'var(--ft-bg-input)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--ft-radius-sm)', color: 'var(--ft-text)',
                fontSize: '0.875rem', outline: 'none',
              }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--ft-text-muted)' }}>
              (usando dias úteis ≈ 252/ano)
            </span>
          </div>

          {investimentos.length === 0 ? (
            <p style={{ color: 'var(--ft-text-muted)', fontSize: '0.85rem' }}>Nenhum investimento para simular.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {investimentos.map(inv => {
                const hoje = new Date();
                const venc = parseISO(inv.dtVencimentoAplicacao);
                const dias = Math.max(0, differenceInDays(venc, hoje));
                // Aproxima dias úteis: 70% dos dias corridos
                const diasUteis = Math.round(dias * 0.7);
                const rendimento = calcRendimento(inv.vlAplicacao, taxa, diasUteis);
                const totalFinal = inv.vlAplicacao + rendimento;

                return (
                  <div key={inv.idInvestimento} style={{
                    background: 'rgba(255,255,255,0.025)', borderRadius: 'var(--ft-radius-md)',
                    padding: '0.875rem', border: '1px solid var(--ft-border)',
                    display: 'grid', gridTemplateColumns: '1fr auto auto',
                    gap: '0.5rem', alignItems: 'center',
                  }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--ft-text)' }}>
                        {inv.nmAplicacao}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--ft-text-muted)' }}>
                        Vence: {formatDate(inv.dtVencimentoAplicacao)} · {dias}d corridos
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--ft-text-muted)' }}>Rendimento</p>
                      <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: 'var(--ft-green)' }}>
                        +{formatCurrency(rendimento)}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--ft-text-muted)' }}>Total Final</p>
                      <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: 'var(--ft-blue)' }}>
                        {formatCurrency(totalFinal)}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Totais */}
              <div style={{
                display: 'flex', justifyContent: 'flex-end', gap: '1.5rem',
                paddingTop: '0.75rem', borderTop: '1px solid var(--ft-border)',
              }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--ft-text-muted)' }}>Total Investido</p>
                  <p style={{ margin: 0, fontWeight: 700, color: 'var(--ft-text)' }}>
                    {formatCurrency(investimentos.reduce((s, i) => s + i.vlAplicacao, 0))}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--ft-text-muted)' }}>Rendimento Total</p>
                  <p style={{ margin: 0, fontWeight: 700, color: 'var(--ft-green)' }}>
                    +{formatCurrency(investimentos.reduce((s, inv) => {
                      const dias = Math.max(0, differenceInDays(parseISO(inv.dtVencimentoAplicacao), new Date()));
                      return s + calcRendimento(inv.vlAplicacao, taxa, Math.round(dias * 0.7));
                    }, 0))}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </SectionCard>
  );
};

export default RenderingSimulator;
