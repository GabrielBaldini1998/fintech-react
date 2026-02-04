import Navbar from '../../componentes/Navbar';
import SummaryCard from '../../componentes/SumaryCard';


const sumaryCardsInvest = [
    {
        "id": 1,
        "title": "Patrimônio Total",
        "value": 42500.00,
        "icon": "bi bi-safe",
        "iconColor": "primary",
        "subtitle": "+1.2% este mês",
        "trend": "up"
    },
    {
        "id": 2,
        "title": "Renda Fixa",
        "value": 30000.00,
        "icon": "bi bi-shield-check",
        "iconColor": "warning",
        "subtitle": "CDI, Tesouro",
        "trend": "stable"
    },
    {
        "id": 3,
        "title": "Renda Variável",
        "value": 12500.00,
        "icon": "bi bi-graph-up-arrow",
        "iconColor": "info",
        "subtitle": "-0.5% hoje",
        "trend": "down"
    }
]

const Investimentos = () => {
    return (
        <>
            <Navbar titulo="Investimentos" />
            <div className="px-5 py-4">
                <div className="row g-3 mb-4">
                    {sumaryCardsInvest.map((card) => (
                        <div key={card.id} className="col-md-4">
                            <SummaryCard
                                title={card.title}
                                value={card.value.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}
                                icon={card.icon}
                                iconColor={card.iconColor}
                                subtitle={card.subtitle}
                                trend={card.trend}
                                trendType={card.trend === 'up' ? 'success' : 'danger'}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Investimentos;